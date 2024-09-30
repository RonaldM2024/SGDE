import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BehavierIdbRepository } from 'src/app/features/persistence/behavierIdb-repository.service';

@Injectable({
  providedIn: 'root',
})

export class roleGuard {
  constructor(public router: Router, public aRoute: ActivatedRoute, private behavierIdbRepository: BehavierIdbRepository) {}

  // Metodo que se ejecuta antes de cargar la ruta
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {

    const expectedRoles = route.data['roles'] as string[];
    const user = await this.behavierIdbRepository.getUser();
    const roles = user[0]?.roles;

    // Verifica si el usuario tiene los roles necesarios para acceder a la ruta
    if (roles) {
      // Comprueba si el usuario tiene al menos uno de los roles necesarios
      for (let expectedRole of expectedRoles) {
        if (roles.includes(expectedRole)) {
          return true; // Si el usuario tiene al menos uno de los roles necesarios, permite el acceso
        }
      }
    }
    
    // Redirige a una página de acceso denegado o página de inicio
    this.router.navigate(['/access-denied']);
    return false;
  }
}