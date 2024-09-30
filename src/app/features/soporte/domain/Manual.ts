export class Manual {
    public id: string;
    public titulo: string;
    public fechaRegistro: Date;
    public url: string;
  
    constructor(id: string, titulo: string, fechaRegistro: Date, url: string) {
      this.id = id;
      this.titulo = titulo;
      this.fechaRegistro = fechaRegistro;
      this.url = url;
    }
  }
  