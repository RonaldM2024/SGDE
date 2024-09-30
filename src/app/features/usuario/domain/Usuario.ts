import { Empleado } from './Empleado';
import { Rol } from './ValueObject/Rol';
import { Email } from './ValueObject/Email';
import { Password } from './ValueObject/Password';
import { EstadoCuentaUser } from './ValueObject/EstadoCuentaUser';

export class Usuario {
  public id: string | null;
  private readonly email: Email;
  private password: Password;
  public readonly empleado: Empleado;
  private roles: Rol[];
  private estado: EstadoCuentaUser;
  private aceptaTerminosCondiciones: boolean;

  constructor(id: string | null, email: Email, password: Password, empleado: Empleado, roles: string[], estado: EstadoCuentaUser, aceptaTerminosCondiciones: boolean) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.empleado = empleado;
    this.roles = roles.map(rol => new Rol(rol));
    this.estado = estado;
    this.aceptaTerminosCondiciones = aceptaTerminosCondiciones;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPassword(): Password {
    return this.password;
  }

  public getEmpleado(): Empleado {
    return this.empleado;
  }

  public getRoles(): string[] {
    return this.roles.map(rol => rol.getRol());
  }

  public getEstado(): EstadoCuentaUser {
    return this.estado;
  }

  public aceptaTerminos(): boolean {
    return this.aceptaTerminosCondiciones;
  }

  public agregarRol(nuevoRol: string): void {
    if (!Rol.esRolValido(nuevoRol)) {
      throw new Error(`Rol inválido: ${nuevoRol}`);
    }
    if (!this.roles.some(rol => rol.getRol() === nuevoRol)) {
      this.roles.push(new Rol(nuevoRol));
    }
  }

  public eliminarRol(rolAEliminar: string): void {
    this.roles = this.roles.filter(rol => rol.getRol() !== rolAEliminar);
  }

  public actualizarPassword(nuevaPassword: Password): void {
    this.password = nuevaPassword;
  }

  public actualizarEstado(nuevoEstado: EstadoCuentaUser): void {
    this.estado = nuevoEstado;
  }

  public actualizarAceptacionTerminos(aceptacion: boolean): void {
    this.aceptaTerminosCondiciones = aceptacion;
  }
}
