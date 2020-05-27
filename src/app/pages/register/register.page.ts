import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'; //FORMS DINAMICOS
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service'; //AUTH SERVICE
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  //FORMS DINAMICOS PARA EL REGISTRO
  validationForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validationMessages = {
    id: [
      { type: 'required', message: 'La cedula es requerida.' },
      { type: 'minlength', message: 'La cedula debe tener al menos 10 caracteres.' },
      { type: 'pattern', message: 'Escribe una cedula valida.' }
    ],
    name: [
      { type: 'required', message: 'El nombre es requerido.' },
      { type: 'minlength', message: 'El nombre debe de tener al menos 2 caracteres.' },
      { type: 'pattern', message: 'Escribe un nombre valido.' }
    ],
    password: [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 4 caracteres.' }
    ]
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      id: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]\d*$/)])
      ),
      name: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')])
      ),
      password: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4)]))
    });
  }

  //RESGISTRAMOS AL USUARIO Y SI FUNCIONA LO LOGGEAMOS
  Register(credentials) {
    //LE CREAMOS EL EMAIL AL USUARIO CON SU CEDULA
    var _email = credentials.id + '@' + 'fullHouse.com';
    var newCredentials = {
      email: _email,
      password: credentials.password
    };
    //LO REGISTRAMOS
    this.authService.registerUser(newCredentials).then(
      (res) => {
        this.errorMessage = '';
        this.successMessage = 'Cuenta creada, espera mientras te loggeas.';

        //LOGGEAMOS AL USUARIO LUEGO DE CREARLE LA CUENTA, CON SU EMAIL NUEVO Y CONTRASEÑA
        this.authService.loginUser(newCredentials).then(
          () => {
            this.GoHomePage();
          },
          //ERRORES
          (eLogin) => {
            this.errorMessage = eLogin.message;
            this.successMessage = '';
          }
        );
      },
      //ERRORES
      (err) => {
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    );
  }

  //ESPERAMOS A PONER EL VALOR EN EL LOCALSTORAGE Y AVANZAMOS
  //TIENE QUE SER ASYNC PARA QUE EL GUARD NO NOS DEVUELVA AL LOGIN
  async GoHomePage() {
    const logUser = await this.storage.set('isUserLogged', true);
    this.navCtrl.navigateForward('/home');
  }
}
