import { Observable } from 'rxjs';
import { Usuario } from '../Usuario';

export interface UsuarioRepository {
  registrarUsuario(usuario: Usuario): Observable<string>;
  consultarUsuario(id: string): Observable<Usuario | undefined>;
  consultarUsuarios(): Observable<Usuario[]>;
  actualizarUsuario(usuario: Usuario): Observable<string>;
}
