import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { EncryptionService } from '../usuario/encrypter/encrypter-repository.service';
import { from, Observable } from 'rxjs';

export interface Usuario {
  email: string;
  id: string;
  roles: string[];
  estado: string;
  nombre: string;
  apellido: string;
  cargo: string;
}

@Injectable({
  providedIn: 'root'
})
export class BehavierIdbRepository {
  private collectionName = 'user';

  constructor(
    private dbService: NgxIndexedDBService,
/*     private encryptionService: EncryptionService */
  ) {}
  user: any;

  async guardarUsuario(usuario: any): Promise<void> {
    console.log('Usuario a guardar en IndexedDB:', usuario);
    const { email, id, roles, estado, nombre, apellido, cargo } = usuario;
    const user = { email, id, roles, estado,  nombre, apellido, cargo };

    console.log(user);
    
    try {
      await from(this.dbService.add(this.collectionName, user)).toPromise();
      console.log('Usuario guardado en IndexedDB:', user);
    } catch (error) {
      console.error('Error al agregar usuario a IndexedDB', error);
    }
  }

  async getUserbyEmail(email: string): Promise<any> {
    this.user = await this.dbService.getByIndex(this.collectionName, 'email', email);
    if(this.user){
      const data = {
        email: this.user.email!,
        apellido: this.user.apellido,
        cargo: this.user.cargo
      };
      return data;
    }
  }

  async deleteUsers(): Promise<void> {
    try {
      await from(this.dbService.clear(this.collectionName)).toPromise();
      console.log('Todos los usuarios eliminados de IndexedDB.');
    } catch (error) {
      console.error('Error al eliminar usuarios de IndexedDB', error);
    }
  }

  getUser(): Promise<any> | undefined {
    try {
      return this.dbService.getAll(this.collectionName).toPromise().then((users: any) => {
        console.log('Usuarios obtenidos de IndexedDB:', users);
        return users;
      });
      //console.log('Usuarios obtenidos de IndexedDB:', usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios de IndexedDB', error);
    }
    return undefined;
  }

  async getUserId(): Promise<string | undefined> {
    try {
      const users = await this.getUser();
      return users && users.length > 0 ? users[0].id : undefined;
    } catch (error) {
      console.error('Error al obtener el ID del usuario', error);
    }
    return undefined;
  }
}
