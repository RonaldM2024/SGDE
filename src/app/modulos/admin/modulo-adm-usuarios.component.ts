import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Cedula } from 'src/app/features/egresado/domain/ValueObject/Cedula';
import { NombreCompleto } from 'src/app/features/egresado/domain/ValueObject/NombreCompleto';
import { isValidCI } from 'src/app/features/egresado/domain/ValueObject/validateCI';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { Empleado } from 'src/app/features/usuario/domain/Empleado';
import { Usuario } from 'src/app/features/usuario/domain/Usuario';
import { Cargo } from 'src/app/features/usuario/domain/ValueObject/Cargo';
import { Email } from 'src/app/features/usuario/domain/ValueObject/Email';
import { EstadoCuentaUser } from 'src/app/features/usuario/domain/ValueObject/EstadoCuentaUser';
import { EstadoEmpleado } from 'src/app/features/usuario/domain/ValueObject/EstadoEmpleado';
import { Password } from 'src/app/features/usuario/domain/ValueObject/Password';
import { Rol } from 'src/app/features/usuario/domain/ValueObject/Rol';
import { Telefono } from 'src/app/features/usuario/domain/ValueObject/Telefono';
import { FirebaseUsuarioRepositoryService } from 'src/app/features/usuario/infrastructure/firebase-usuario-repository.service';

@Component({
  selector: 'app-modulo-adm-usuarios',
  templateUrl: './modulo-adm-usuarios.component.html',
  styleUrls: ['./modulo-adm-usuarios.component.css']
})
export class ModuloAdmUsuariosComponent {
  showRegisterForm: boolean = false;
  displayedColumns: string[] = ['email', 'rol', 'estado', 'acciones'];
  isDesktop: boolean = true;
  mobileMaxWidth: number = 768;

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }

  cancel() {
    this.showRegisterForm = !this.showRegisterForm;
    this.limpiarCampos();
  }

  empleadoForm: FormGroup;
  cuentaForm: FormGroup;
  buscarForm: FormGroup;
  rolesSeleccionados: string[] = [];
  usuarios: Usuario[] = [];
  usuarioEncontrado: Usuario | undefined;
  editandoUsuario: boolean = false;
  usuarioSeleccionadoId: string | null = null;
  roles = Rol.getRolesValidos();
  cargos = Cargo.getCargosValidos();
  estadosEmpleo = EstadoEmpleado.getEstadosValidos();
  estadosCuentaUser = EstadoCuentaUser.getEstadosValidos().filter(estado => estado !== 'INACTIVO');

  constructor(
    private fb: FormBuilder, 
    private usuarioService: FirebaseUsuarioRepositoryService,
    private logRepository: FirestoreLogRepositoryService,
    private toastr: ToastrService,
  ) {
    this.empleadoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      apellido: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      telefono: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      direccion: [''],
      cargo: ['', Validators.required],
      estadoEmpleo: ['', Validators.required]
    });

    this.cuentaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      roles: [''],
      estadoCuentaUser: ['INACTIVO'],
      aceptaTerminos: [false]
    }, { validators: this.passwordMatchValidator });

    this.buscarForm = this.fb.group({
      buscarId: [''],
      buscarCedula: ['', [Validators.minLength(10), Validators.pattern('^[0-9]*$')]]
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = window.innerWidth > this.mobileMaxWidth;
  }

  ngOnInit(): void {
    this.isDesktop = window.innerWidth > this.mobileMaxWidth;
    this.consultarUsuarios();
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    const inputValue = (event.target as HTMLInputElement).value;

    // Solo permitir números (0-9) y verificar la longitud
    if (charCode >= 48 && charCode <= 57) {
      if (inputValue.length < 10) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
    event.preventDefault();
    return false;
  }

  allowOnlyLetters(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    // Solo permitir letras (a-zA-Z) y espacio
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { 'mismatch': true } : null;
  }

  onRoleChange(event: any) {
    const rol = event.target.value;
    if (event.target.checked) {
      this.rolesSeleccionados.push(rol);
    } else {
      this.rolesSeleccionados = this.rolesSeleccionados.filter(r => r !== rol);
    }
  }

  registrarUsuario() {
    if (this.cuentaForm.invalid) {
      this.cuentaForm.markAllAsTouched();
      this.toastr.error('Error: Formulario incompleto. Rellene todos los campos.')
      return;
    }
    
    const cedulaValue = this.empleadoForm.get('cedula')?.value;
    if(!isValidCI(cedulaValue)){
      console.log(cedulaValue)
      this.cuentaForm.markAllAsTouched();
      this.toastr.error('Error: Cedula invalida')
      return;
    }

    if (this.rolesSeleccionados.length === 0) {
      this.toastr.error('Error: Debe seleccionar al menos un rol.');
      return;
    }

    if (!this.cuentaForm.value.aceptaTerminos) {
      this.toastr.error('Error: Debe aceptar los términos y condiciones.');
      return;
    }
    
    const usuario = this.crearUsuarioDesdeFormularios();
    this.usuarioService.registrarUsuario(usuario).subscribe({
      next: (id) => {
        console.log(`Usuario registrado con ID: ${id}`);
        this.consultarUsuarios();
        this.limpiarCampos();
        this.cancel();
        this.toastr.success('Se creo el usuario con exito');
        this.logRepository.registrarAccion(
          TipoModulo.MODULO_ADMINISTRACION_USUARIOS,
          "Registrar usuario", 
          `ID del usuario registrado: ${id}`
        );
      },
      error: (err) => {
        this.toastr.error('Error al registrar usuario');
        console.error(`Error al registrar usuario: ${err.message}`);
      }
    });
  }

  actualizarUsuario() {
    if (this.usuarioSeleccionadoId) {
      const usuario = this.crearUsuarioDesdeFormularios();
      usuario.id = this.usuarioSeleccionadoId;
      this.usuarioService.actualizarUsuario(usuario).subscribe({
        next: () => {
          console.log(`Usuario actualizado con ID: ${this.usuarioSeleccionadoId}`);
          this.consultarUsuarios();
          this.limpiarCampos();
          this.editandoUsuario = false;
          this.cancel();
          this.toastr.success('Se actualizo el usuario con exito');
          this.logRepository.registrarAccion(
            TipoModulo.MODULO_ADMINISTRACION_USUARIOS,
            "Actualizar información de usuario", 
            `ID de usuario actualizado: ${usuario.id}`
          )
        },
        error: (err) => {
          console.error(`Error al actualizar usuario: ${err.message}`);
          this.toastr.error('Error al actualizar usuario');
        }
      });
    }
  }

  buscarUsuarioPorCedula() {
    const cedula = this.buscarForm.value.buscarCedula;
    if (cedula) {
      if (cedula.length !== 10) {
        this.toastr.error('La cédula debe tener 10 dígitos');
        return;
      }

      this.usuarioService.consultarUsuarioPorCedula(cedula).subscribe({
        next: (usuario) => {
          if (usuario) {
            this.usuarios = [usuario];
            this.toastr.success(`Se encontró el usuario con la cédula ${cedula}`);
            this.logRepository.registrarAccion(
              TipoModulo.MODULO_ADMINISTRACION_USUARIOS,
              'Buscar usuario por cédula', 
              `ID del usuario buscado: ${usuario.id}`
            );
          } else {
            this.toastr.error(`No se encontró un usuario con la cédula ${cedula}`);
          }
        },
        error: (err) => {
          console.error(`Error al buscar usuario por cédula: ${err.message}`);
          this.usuarioEncontrado = undefined;
          this.toastr.error('Ocurrió un error al buscar el usuario');
        }
      });
    } else {
      this.toastr.error('Por favor, ingrese una cédula');
    }
  }

  seleccionarUsuario(usuario: Usuario) {
    this.toggleRegisterForm();
    this.empleadoForm.patchValue({
      nombre: usuario.getEmpleado().getNombre(),
      apellido: usuario.getEmpleado().getApellido(),
      cedula: usuario.getEmpleado().cedula.getValue(),
      telefono: usuario.getEmpleado().getTelefono().getValue(),
      direccion: usuario.getEmpleado().getDireccion(),
      cargo: usuario.getEmpleado().getCargo().getCargo(),
      estadoEmpleo: usuario.getEmpleado().getEstado().getEstado()
    });

    this.cuentaForm.patchValue({
      email: usuario.getEmail().getValue(),
      password: usuario.getPassword().getValue(),
      confirmPassword: usuario.getPassword().getValue(),
      estadoCuentaUser: usuario.getEstado().getEstado(),
      aceptaTerminos: usuario.aceptaTerminos()
    });

    this.cuentaForm.get('password')?.disable();
    this.cuentaForm.get('confirmPassword')?.disable();

    this.rolesSeleccionados = usuario.getRoles();
    this.editandoUsuario = true;
    this.usuarioSeleccionadoId = usuario.id;
  }

  editarUsuario(usuario: Usuario) {
    this.seleccionarUsuario(usuario);
  }

  limpiarCampos() {
    this.empleadoForm.reset();
    this.cuentaForm.reset();
    this.cuentaForm.get('password')?.enable();
    this.cuentaForm.get('confirmPassword')?.enable();
    this.rolesSeleccionados = [];
    this.usuarioEncontrado = undefined;
    this.editandoUsuario = false;
    this.usuarioSeleccionadoId = null;
    this.cuentaForm.value.estadoCuentaUser = 'INACTIVO';
  }

  consultarUsuarios() {
    this.usuarioService.consultarUsuarios().subscribe({
      next: (usuarios) => this.usuarios = usuarios,
      error: (err) => console.error(`Error al consultar usuarios: ${err.message}`)
    });
  }

  convertirAMayusculas(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    this.empleadoForm.get(controlName)?.setValue(valor);
  }

  private crearUsuarioDesdeFormularios(): Usuario {
    const nombreCompleto = new NombreCompleto(this.empleadoForm.value.nombre, this.empleadoForm.value.apellido);
    const cedula = new Cedula(this.empleadoForm.value.cedula);
    const telefono = new Telefono(this.empleadoForm.value.telefono);
    const cargo = new Cargo(this.empleadoForm.value.cargo);
    const estadoEmpleo = new EstadoEmpleado(this.empleadoForm.value.estadoEmpleo);
    const empleado = new Empleado(null, nombreCompleto, cedula, cargo, telefono, this.empleadoForm.value.direccion, estadoEmpleo);

    const email = new Email(this.cuentaForm.value.email);
    const password = new Password(this.cuentaForm.get('password')?.value);
    const estadoCuentaUser = this.cuentaForm.value.estadoCuentaUser ? new EstadoCuentaUser(this.cuentaForm.value.estadoCuentaUser) : new EstadoCuentaUser('INACTIVO');
    const aceptaTerminosCondiciones = this.cuentaForm.value.aceptaTerminos;
    return new Usuario(null, email, password, empleado, this.rolesSeleccionados, estadoCuentaUser, aceptaTerminosCondiciones);
  }
}
