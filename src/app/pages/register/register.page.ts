import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'; //FORMS DINAMICOS
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service'; //AUTH SERVICE
import { Storage } from '@ionic/storage'; //LOCAL STORAGE
import { User } from '../../models/user'; //INTERFACES
import { Operator } from '../../models/operator'; //INTERFACES
import { CrudService } from '../../services/crud.service';

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

  //DEFINIMOS EL USUARIO Y EL OPERADOR, DEBEMOS DE USAR UNA FABRICA PARA MEJORAR ESTO
  user: User;
  fullHouseOperator: Operator = {
    id: 0,
    name: 'Full House',
    company: 'Full House',
    bondingDate: '25/05/2020'
  };

  //MENSAJES PARA AVISAR QUE HAY UN ERROR EN LA CREACION
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
    private storage: Storage,
    private crud: CrudService
  ) {}

  //INICIALIZAMOS LAS OPCIONES DE VALIDACION EN EL FORM
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
    var _email = credentials.id + '@' + 'fullHouse.com'; //LE CREAMOS EL EMAIL AL USUARIO CON SU CEDULA
    var newCredentials = {
      email: _email,
      password: credentials.password
    };
    //LO REGISTRAMOS
    this.authService.registerUser(newCredentials).then(
      (res) => {
        this.errorMessage = '';
        this.successMessage = 'Cuenta creada, espera mientras te loggeas...';

        //LOGGEAMOS AL USUARIO LUEGO DE CREARLE LA CUENTA, CON SU EMAIL NUEVO Y CONTRASEÑA
        this.authService.loginUser(newCredentials).then(
          () => {
            this.AddUserValues(credentials, newCredentials); //LE ACTUALIZAMOS LOS VAL AL USUARIO
            this.SaveCedulaLocally(this.user.cedula);
            var cedula = this.user.cedula;
            this.user = { ...this.user }; //CONVERTIMOS AL USUARIO EN JSON PARA ENVIARLO A LA DB
            this.CreateDBAndGoHomePage(cedula);
          },
          //ERRORES
          (eLogin) => {
            this.errorMessage = eLogin.message;
            this.successMessage = '';
            this.validationForm.reset(); //RESETEAMOS EL FORM
          }
        );
      },
      //ERRORES
      (err) => {
        this.errorMessage = err.message;
        this.successMessage = '';
        this.validationForm.reset(); //RESETEAMOS EL FORM
      }
    );
  }

  //ESPERAMOS A PONER EL VALOR EN EL LOCALSTORAGE Y AVANZAMOS
  //TIENE QUE SER ASYNC PARA QUE EL GUARD NO NOS DEVUELVA AL LOGIN
  async CreateDBAndGoHomePage(cedula) {
    await this.storage.set('isUserLogged', true);
    await this.crud.CreateUser(cedula, this.user);
    this.navCtrl.navigateForward('/home');
  }

  async SaveCedulaLocally(cedula) {
    await this.storage.set('UserCedula', cedula);
  }

  //LE AGREGAMOS AL USUARIO LOS DATOS DE UN NUEVO USUARIO
  AddUserValues(credentials, newCredentials) {
    this.user = User.GetInstance();
    this.user.cedula = credentials.id;
    this.user.name = credentials.name;
    this.user.email = newCredentials.email;
    this.user.password = newCredentials.password;
    this.user.fingerPrint = '';
    this.user.operators = null;
    this.user.requests = null;
    this.user.suscriptionType = 'normal';
    this.user.bondedOperator = this.fullHouseOperator;
  }
}
