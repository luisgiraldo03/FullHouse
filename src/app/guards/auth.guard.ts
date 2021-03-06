import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storage: Storage) {}

  async canActivate() {
    const isUserLogged = await this.storage.get('isUserLogged');
    if (isUserLogged) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
