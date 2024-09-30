export class Log {
  constructor(
    public id: string,
    public accion: string,
    public fecha: Date,
    public userId: string,
    public ip: string,
    public detalle: string
  ) {}
}