import { Cedula } from '../../egresado/domain/ValueObject/Cedula';
import { NombreCompleto } from '../../egresado/domain/ValueObject/NombreCompleto';
import { Cargo } from './ValueObject/Cargo';
import { EstadoEmpleado } from './ValueObject/EstadoEmpleado';
import { Telefono } from './ValueObject/Telefono';

export class Empleado {
  public id: string | null;
  public readonly cedula: Cedula;
  private nombreCompleto: NombreCompleto;
  private cargo: Cargo;
  private telefono: Telefono;
  private direccion: string;
  private estadoEmpleo: EstadoEmpleado;

  constructor(
    id: string | null,
    nombreCompleto: NombreCompleto,
    cedula: Cedula,
    cargo: Cargo,
    telefono: Telefono,
    direccion: string,
    estadoEmpleo: EstadoEmpleado
  ) {
    this.id = id;
    this.nombreCompleto = nombreCompleto;
    this.cedula = cedula;
    this.cargo = cargo;
    this.telefono = telefono;
    this.direccion = direccion;
    this.estadoEmpleo = estadoEmpleo;
  }

  public getNombre(): string {
    return this.nombreCompleto.getNombre();
  }

  public getApellido(): string {
    return this.nombreCompleto.getApellido();
  }

  public getNombreCompleto(): NombreCompleto {
    return this.nombreCompleto;
  }

  public getEstado(): EstadoEmpleado {
    return this.estadoEmpleo;
  }

  public getCargo(): Cargo {
    return this.cargo;
  }

  public getTelefono(): Telefono {
    return this.telefono;
  }

  public getDireccion(): string {
    return this.direccion;
  }

  public actualizarEstadoEmpleado(nuevoEstadoEmpleado: EstadoEmpleado): void {
    this.estadoEmpleo = nuevoEstadoEmpleado;
  }

  public actualizarCargo(nuevoCargo: Cargo): void {
    this.cargo = nuevoCargo;
  }

  public actualizarTelefono(nuevoTelefono: Telefono): void {
    this.telefono = nuevoTelefono;
  }

  public actualizarDireccion(nuevaDireccion: string): void {
    this.direccion = nuevaDireccion;
  }
}
