import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { UsuarioRepository } from '../domain/Repository/UsuarioRepository';
import { Usuario } from '../domain/Usuario';
import { Rol } from '../domain/ValueObject/Rol';
import { Empleado } from '../domain/Empleado';
import { NombreCompleto } from '../../egresado/domain/ValueObject/NombreCompleto';
import { Cedula } from '../../egresado/domain/ValueObject/Cedula';
import { Cargo } from '../domain/ValueObject/Cargo';
import { Telefono } from '../domain/ValueObject/Telefono';
import { EstadoEmpleado } from '../domain/ValueObject/EstadoEmpleado';
import { Email } from '../domain/ValueObject/Email';
import { Password } from '../domain/ValueObject/Password';
import { EstadoCuentaUser } from '../domain/ValueObject/EstadoCuentaUser';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUsuarioRepositoryService implements UsuarioRepository {

  private collectionName = 'usuarios';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
  ) { }

  registrarUsuario(usuario: Usuario): Observable<string> {
    return from(
      this.afAuth.createUserWithEmailAndPassword(usuario.getEmail().getValue(), usuario.getPassword().getValue())
    ).pipe(
      switchMap((userCredential) => {
        const id = userCredential.user?.uid;
        if (!id) {
          throw new Error('No se pudo obtener el ID del usuario después de la creación.');
        }

        const plainUsuario = {
          id: id,
          email: usuario.getEmail().getValue(),
          password: usuario.getPassword().getValue(),
          empleado: {
            nombreCompleto: {
              nombre: usuario.getEmpleado().getNombre(),
              apellido: usuario.getEmpleado().getApellido()
            },
            cedula: usuario.getEmpleado().cedula.getValue(),
            telefono: usuario.getEmpleado().getTelefono().getValue(),
            cargo: usuario.getEmpleado().getCargo().getCargo(),
            estadoEmpleo: usuario.getEmpleado().getEstado().getEstado(),
            direccion: usuario.getEmpleado().getDireccion()
          },
          roles: usuario.getRoles(),
          estado: 'INACTIVO', // Estado inicial
          aceptaTerminosCondiciones: usuario.aceptaTerminos()
        };

        // Enviar email de verificación
        userCredential.user?.sendEmailVerification();

        return from(this.firestore.collection(this.collectionName).doc(id).set(plainUsuario))
          .pipe(
            map(() => id),
            catchError(error => throwError(() => new Error(`Error al registrar usuario en Firestore: ${error.message}`)))
          );
      }),
      catchError(error => {
        if (error.code === 'auth/email-already-in-use') {
          this.toastr.error('El correo electrónico ya está en uso por otra cuenta.', 'Error de registro');
        }
        return throwError(() => new Error(`Error al crear usuario en Firebase Authentication: ${error.message}`));
      })
    );
  }

  consultarUsuario(id: string): Observable<Usuario | undefined> {
    return this.firestore.collection(this.collectionName).doc(id).get().pipe(
      map(doc => {
        if (doc.exists) {
          const data = doc.data();
          return this.convertToUsuario(data);
        } else {
          return undefined;
        }
      })
    );
  }

  consultarUsuarios(): Observable<Usuario[]> {
    return this.firestore.collection(this.collectionName).get().pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => this.convertToUsuario(doc.data()));
      })
    );
  }

  consultarUsuarioPorCedula(cedula: string): Observable<Usuario | undefined> {
    return this.firestore.collection(this.collectionName, ref => ref.where('empleado.cedula', '==', cedula)).get().pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          return this.convertToUsuario(snapshot.docs[0].data());
        } else {
          return undefined;
        }
      }),
      catchError(error => throwError(() => new Error(`Error al consultar usuario por cédula: ${error.message}`)))
    );
  }

  consultarUsuarioPorEmail(email: string): Observable<Usuario | undefined> {
    return this.firestore.collection<Usuario>(this.collectionName, ref => ref.where('email', '==', email)).get().pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          return snapshot.docs[0].data();
        } else {
          return undefined;
        }
      }),
      catchError(error => throwError(() => new Error(`Error al consultar usuario por email: ${error.message}`)))
    );
  }

  private convertToUsuario(data: any): Usuario {
    const empleado = new Empleado(
      data.empleado.id,
      new NombreCompleto(data.empleado.nombreCompleto.nombre, data.empleado.nombreCompleto.apellido),
      new Cedula(data.empleado.cedula),
      new Cargo(data.empleado.cargo),
      new Telefono(data.empleado.telefono),
      data.empleado.direccion,
      new EstadoEmpleado(data.empleado.estadoEmpleo)
    );

    const estado = new EstadoCuentaUser(data.estado);
    const aceptaTerminosCondiciones = data.aceptaTerminosCondiciones;

    return new Usuario(
      data.id,
      new Email(data.email),
      new Password(data.password),
      empleado,
      data.roles,
      estado,
      aceptaTerminosCondiciones
    );
  }

  actualizarUsuario(usuario: Usuario): Observable<string> {
    if (!usuario.id) {
      throw new Error('El ID del usuario no puede ser null o undefined');
    }

    const plainUsuario = {
      email: usuario.getEmail().getValue(),
      password: usuario.getPassword().getValue(),
      empleado: {
        nombreCompleto: {
          nombre: usuario.getEmpleado().getNombre(),
          apellido: usuario.getEmpleado().getApellido()
        },
        cedula: usuario.getEmpleado().cedula.getValue(),
        telefono: usuario.getEmpleado().getTelefono().getValue(),
        cargo: usuario.getEmpleado().getCargo().getCargo(),
        estadoEmpleo: usuario.getEmpleado().getEstado().getEstado(),
        direccion: usuario.getEmpleado().getDireccion()
      },
      roles: usuario.getRoles(),
      estado: usuario.getEstado().getEstado(),
      aceptaTerminosCondiciones: usuario.aceptaTerminos()
    };

    return from(this.firestore.collection(this.collectionName).doc(usuario.id).update(plainUsuario))
      .pipe(
        map(() => usuario.id as string),
        catchError(error => throwError(() => new Error(`Error al actualizar usuario: ${error.message}`)))
      );
  }

  //Login
  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  //Logout
  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  // Método para restaurar contraseña
  restaurarContrasena(email: string): Observable<void> {
    return from(this.afAuth.sendPasswordResetEmail(email)).pipe(
      map(() => {
        console.log('Correo de restauración de contraseña enviado.');
      }),
      catchError(error => throwError(() => new Error(`Error al enviar correo de restauración de contraseña: ${error.message}`)))
    );
  }

  /**
   * Verifica si el email del usuario ha sido validado.
   * @param userId ID del usuario.
   * @returns Observable que emite true si el email ha sido validado, false en caso contrario.
   */
  verificarEmailUsuario(userId: string): Observable<boolean> {
    return from(this.afAuth.user).pipe(
      switchMap(user => {
        if (user && user.uid === userId) {
          return of(user.emailVerified);
        } else {
          return this.afAuth.authState.pipe(
            switchMap(authUser => {
              if (authUser && authUser.uid === userId) {
                return of(authUser.emailVerified);
              } else {
                return of(false);
              }
            })
          );
        }
      }),
      switchMap(emailVerified => {
        if (emailVerified) {
          return this.actualizarEstadoUsuario(userId, 'ACTIVO').pipe(
            map(() => true),
            catchError(() => of(false))
          );
        } else {
          return of(false);
        }
      }),
      catchError(() => of(false))
    );
  }

  private actualizarEstadoUsuario(userId: string, nuevoEstado: string): Observable<void> {
    return this.firestore.collection(this.collectionName).doc(userId).get().pipe(
      take(1), // Asegura que solo se realice una suscripción
      switchMap(doc => {
        const data = doc.data() as { estado?: string }; // Define el tipo de data
        if (data && data.estado === 'SUSPENDIDA' && nuevoEstado === 'ACTIVO') {
          console.error('No se puede cambiar el estado de una cuenta suspendida a ACTIVO.');
          return throwError(() => new Error('No se puede cambiar el estado de una cuenta suspendida a ACTIVO.'));
        } else {
          const estado = new EstadoCuentaUser(nuevoEstado);
          return from(this.firestore.collection(this.collectionName).doc(userId).update({ estado: estado.getEstado() })).pipe(
            catchError(error => {
              console.error(`Error al actualizar el estado del usuario: ${error.message}`);
              return throwError(() => new Error(`Error al actualizar el estado del usuario: ${error.message}`));
            })
          );
        }
      }),
      catchError(error => {
        console.error(`Error al consultar el estado actual del usuario: ${error.message}`);
        return throwError(() => new Error(`Error al consultar el estado actual del usuario: ${error.message}`));
      })
    );
  }


}
