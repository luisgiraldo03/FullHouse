import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  // MENSAJES DE ERROR EN CASO DE QUE SE PONGA MAL LOS DATOS
  validationMessage = {
    email: [
      { type: 'required', message: 'El email es requerido' },
      { type: 'pattern', message: 'Este no es un email valido' },
    ],
    password: [
      { type: 'required', message: 'La contraseña es requerida' },
      { type: 'min', message: 'Minimo 4 caracteres para la contraseña' },
    ],
  };
  errorMessage: String = '';

  constructor(private formBuilder: FormBuilder, private navCtrl: NavController, private storage: Storage) {
    // EL FORM SE USARA PARA VALIDAR CON COLORES MIENTRAS EL USUARIO ESCRIBE
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
    });
  }

  ngOnInit() {}

  // inventamos un servicio que hace las de backend
  loginUser(credentials) {
    // this.authService.loginUser(credentials).then(res => {
    //   this.errorMessage = '';
    //   this.storage.set('isUserLoggedIn', true);
    //   // navegacion diferente
    //   this.navCtrl.navigateForward('/menu/home');
    // })
    // .catch(err => {
    //   this.errorMessage = err;
    // });
    this.storage.set('isUserLogged', true);
    this.navCtrl.navigateForward('/home');
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}
