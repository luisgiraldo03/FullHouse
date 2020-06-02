import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

//SERVICIO DE AUTH
import { AuthenticationService } from '../../services/authentication.service';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: String = '';
  user: User;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private storage: Storage,
    private authService: AuthenticationService,
    private faio: FingerprintAIO
  ) { }

  ngOnInit() {
    // EL FORM SE USARA PARA VALIDAR CON COLORES MIENTRAS EL USUARIO ESCRIBE
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
      ),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]))
    });
  }

  // MENSAJES DE ERROR EN CASO DE QUE SE PONGA MAL LOS DATOS
  validationMessage = {
    email: [
      { type: 'required', message: 'El email es requerido' },
      { type: 'pattern', message: 'Este no es un email valido' }
    ],
    password: [
      { type: 'required', message: 'La contraseña es requerida' },
      { type: 'min', message: 'Minimo 4 caracteres para la contraseña' }
    ]
  };

  //AUNTEICAMOS AL USUARIO CON FIREBASE AUTH SERVICE
  loginUser(credentials) {
    this.authService.loginUser(credentials).then(
      (res) => {
        this.errorMessage = '';
        this.StartUserInstance(credentials);
        this.GoToHome();
      },
      (err) => {
        this.errorMessage = err.message;
        this.loginForm.reset(); //RESETEAMOS EL FORM
      }
    );
  }

  public loginFinger() {
    this.faio.show({
      description: 'autenticando...'
    })
      .then((user: User) => {
        this.GoToHome();
        this.user.fingerPrint = user
      })
      .catch((error: any) => console.log(error));
  }

  //VAMOS AL REGISTRO
  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }

  //VAMOS AL HOME LUEGO DE DESACTIVAR EL GUARD DE LOGGED
  async GoToHome() {
    await this.storage.set('isUserLogged', true);
    this.navCtrl.navigateForward('/home');
  }

  //CREAMOS EL SINGLETON DEL USUARIO Y LE AGREGAMOS LA CEDULA TANTO AL SINGLETON COMO AL LOCAL STORAGE
  async StartUserInstance(credentials) {
    this.user = User.GetInstance();
    var cedula = credentials.email.substring(0, credentials.email.indexOf('@'));
    await this.storage.set('UserCedula', cedula);
    this.user.cedula = cedula;
  }
}
