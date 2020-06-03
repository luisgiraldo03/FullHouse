import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Operator } from '../../models/operator';
import { CrudService } from 'src/app/services/crud.service';
import { MinTicService } from 'src/app/services/min-tic.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss']
})
export class PremiumPage implements OnInit {
  operators: any = []; //ACA GUARAMOS LOS OPERADORES PREMIUM
  user: User; // USUARIO
  //ENTIDADES DISPONIBLES
  entities = [{ name: 'UNE' }, { name: 'MinTic' }, { name: 'MIN' }, { name: 'EAFIT' }]; //ENTIDADES PARA VOLSERSE PREMIUM

  //ENTIDAD SELECCIONADA
  selectedEntity = { name: '' };

  // para mostrar en la UI si ya estamos o no vinculados a un operador
  isAlreadySuscribed: string = 'Vincular';
  isAlreadySuscribedColor: string = 'success';
  isAlreadySuscribedIcon: string = 'checkmark-outline';

  constructor(private crud: CrudService, private minTic: MinTicService, private navCtrl: NavController) {
    //CREAMOS EL SINGLETON Y LE PONEMOS UN OBSERVABLE PARA QUE SE ACTUALIZE CON LA DB SIEMPRE
    this.user = User.GetInstance();
    this.crud.SuscribeUser();
    this.TransformToObject(this.user.operators); //actualizamos los operadores de RAW string a objetos
  }

  ngOnInit() {}

  //CAMBIOS EN EL SELECT DE ENTIDADES
  onChange($event) {
    this.selectedEntity.name = $event.target.value;

    //cambios en la ui del color y texto
    this.isAlreadySuscribed = 'Vincular';
    this.isAlreadySuscribedColor = 'success';
    this.isAlreadySuscribedIcon = 'checkmark-outline';
    //miramos si tenemos el operador en los premium
    this.operators.forEach((x) => {
      if (
        x.name
          .toLocaleUpperCase()
          .split('')
          .join('')
          .includes(this.selectedEntity.name.toLocaleUpperCase().split('').join(''))
      ) {
        this.isAlreadySuscribed = 'Ya vinculado';
        this.isAlreadySuscribedColor = 'warning';
        this.isAlreadySuscribedIcon = 'alert-outline';
      }
    });
  }

  //NOS SUSCRIBIMOS, ENVIANDO LA INFO A LA DB TANTO DEL USUARIO, COMO DEL OPERADOR DE LA ENTIDAD
  Suscribe(targetEntity) {
    var targetOperator = this.minTic.SearchOperator(targetEntity);
    var operatorObjectToDb = targetEntity + '-' + targetOperator + '-' + this.dateNow();
    if (this.isAlreadySuscribed == 'Vincular') {
      this.crud.Suscribe(targetOperator, targetEntity, this.user.cedula, operatorObjectToDb);
      this.navCtrl.navigateBack('/home');
    }
  }

  //PARA SACAR LA FECHA EN UN STRING
  dateNow() {
    var dateFormated = '';
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    dateFormated = dd + '/' + mm + '/' + yyyy;
    return dateFormated;
  }

  //PARA CONVERTIR EL STRING QUE LLEGA DE FORMA {nombre-operador-fecha} A UN ARREGLO DE OBJETOS
  TransformToObject(data) {
    var count = 1;
    var firstOccurrent, secondOcurrent, thirdOcurrent;
    data.forEach((element) => {
      firstOccurrent = element.indexOf('-');
      secondOcurrent = element.indexOf('-', firstOccurrent + 1);
      thirdOcurrent = element.indexOf('-', secondOcurrent + 1);
      this.operators.push({
        id: count,
        name: element.substring(0, firstOccurrent),
        company: element.substring(firstOccurrent + 1, secondOcurrent),
        bondingDate: element.substring(secondOcurrent + 1)
      });
      count++;
    });
  }
}
