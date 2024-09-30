import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { BehavierIdbRepository } from 'src/app/features/persistence/behavierIdb-repository.service';
import { FirebaseUsuarioRepositoryService } from 'src/app/features/usuario/infrastructure/firebase-usuario-repository.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  subscriptionUser: Subscription = new Subscription();
  subscriptionLogin: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private toastService: ToastrService, 
    private indexedDbService: BehavierIdbRepository, 
    private auth: FirebaseUsuarioRepositoryService,
    private logRepository: FirestoreLogRepositoryService
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]]    
    });
  }

  ngOnDestroy(): void {
    this.subscriptionUser.unsubscribe();
    this.subscriptionLogin.unsubscribe();
  }

  login() {
    this.loading = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.error('Formulario invalido', 'Error', { timeOut: 3000 });
      this.loading = false;
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.auth.login(email, password).pipe(take(1)).subscribe(
      () => {
        this.auth.consultarUsuarioPorEmail(email).pipe(take(1)).subscribe(
          (user: any) => {
            if (user) {
              // Primera ejecución de verificarEmailUsuario para actualizar estado a 'ACTIVO' si es necesario
              this.auth.verificarEmailUsuario(user.id).pipe(take(1)).subscribe(
                (emailVerified) => {
                  // Segunda ejecución de verificarEmailUsuario para validar si el email está verificado
                  this.auth.verificarEmailUsuario(user.id).pipe(take(1)).subscribe(
                    async (isEmailVerified) => {
                      if (isEmailVerified) {
                        if (user.estado === 'ACTIVO') {
                          const usuarioDAO = {
                            email: user.email,
                            id: user.id,
                            roles: user.roles,
                            estado: user.estado,
                            nombre: user.empleado.nombreCompleto.nombre,
                            apellido: user.empleado.nombreCompleto.apellido,
                            cargo: user.empleado.cargo
                          };
                          await this.indexedDbService.guardarUsuario(usuarioDAO).then(
                            () => {
                              this.loading = false;
                              this.router.navigate(['/sgda']);
                              this.toastService.success('Bienvenido a SGDE', 'Inicio de sesión exitoso', { timeOut: 3000 });

                              this.logRepository.registrarAccion(
                                TipoModulo.MODULO_ADMINISTRACION_USUARIOS,
                                "Iniciar sesión", 
                                `El usuario con cargo ${usuarioDAO.cargo} ha iniciado sesión`
                              );
                            },
                            (error: Error) => {
                              console.error('Error al agregar usuario a IndexedDB', error);
                              this.loading = false;
                            }
                          );
                        } else {
                          //this.toastService.error('Usuario inactivo o cuenta suspendida', 'Acceso Denegado', { timeOut: 3000 });
                          this.toastService.info('Si verificado su email y es primera vez iniciando sesión, intente de nuevo.', "Aviso" ,{ timeOut: 10000 })
                          this.loading = false;
                        }
                      } else {
                        this.toastService.error('Cuenta suspendida o falta verificación de correo electrónico', 'Acceso Denegado', { timeOut: 5000 });
                        this.loading = false;
                      }
                    },
                    (error) => {
                      this.toastService.error('Error al verificar el correo electrónico', 'Acceso Denegado', { timeOut: 3000 });
                      this.loading = false;
                    }
                  );
                },
                (error) => {
                  this.toastService.error('Error al verificar el correo electrónico', 'Acceso Denegado', { timeOut: 3000 });
                  this.loading = false;
                }
              );
            } else {
              this.toastService.error('Usuario no registrado', 'Acceso Denegado', { timeOut: 3000 });
              this.loading = false;
            }
          },
          (error: Error) => {
            this.toastService.error('Error al consultar usuario', 'Acceso Denegado', { timeOut: 3000 });
            this.loading = false;
          }
        );
      },
      (error) => {
        this.toastService.error('Usuario o contraseña incorrecta', 'Error', { timeOut: 3000 });
        this.loading = false;
      }
    );
  }

  reset() {
    this.router.navigate(['/auth/reset-password']);
  }
}
