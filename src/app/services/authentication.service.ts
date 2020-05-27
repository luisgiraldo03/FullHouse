import { Injectable } from '@angular/core';

//BASE DE DATOS
import { AngularFireAuth } from '@angular/fire/auth';

//COMO ESTA PROVIDED IN ROOT, NO NECESITAMOS INYECTARLO EN APP.MODULES
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private auth: AngularFireAuth) {}

  //REGISTRAMOS USUARIO CON EMAIL Y CONTRASEÑA
  registerUser(credentials) {
    return new Promise<any>((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  //LOGGEAMOS AL USUARIO CON EMAIL Y CONTRASEÑA
  loginUser(credentials) {
    return new Promise<any>((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(
        (res) => resolve(res),
        (err) => reject(err)
      );
    });
  }
}
