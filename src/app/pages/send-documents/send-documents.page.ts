import { Component, OnInit } from '@angular/core';
import { Document } from '../../models/document';
import { CrudService } from 'src/app/services/crud.service';
import { User } from '../../models/user';
import { MinTicService } from './../../services/min-tic.service';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-send-documents',
  templateUrl: './send-documents.page.html',
  styleUrls: ['./send-documents.page.scss']
})
export class SendDocumentsPage implements OnInit {
  public documentsAdded: Document[] = []; //DOCS A ENVIAR
  user: User;
  documents: Document[]; // DOCS ACTUALES
  waitingMinTic: boolean = false; // PARA SABER SI ESTAMOS REALIZANDO UNA BUSQUEDA EN EL MIN TIC
  destinationOperator: string = 'null'; //PARA SABER A QUE OPERADOR ENVIAREMOS LOS DOCS
  successMessage: string = '';
  _operador: string; // AQUI GUARDAREMOS LA ENTIDAD DESTINO EN EL HTML
  sendDocForm: FormGroup;
  operators: any = []; //ACA GUARAMOS LOS OPERADORES PREMIUM

  //ENTIDADES LAS CUALES ESTAN DISPONIBLES PARA ENVIAR DOCS
  public gubernamentalEntitis = [
    {
      name: 'EAFIT'
    },
    {
      name: 'MinTic'
    },
    {
      name: 'MIN'
    },
    {
      name: 'UNE'
    }
  ];

  constructor(
    private crud: CrudService,
    private minTic: MinTicService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder
  ) {
    this.user = User.GetInstance();
    this.crud.SuscribeUser();
    this.documents = this.user.documents;
    this.TransformToObject(this.user.operators); //actualizamos los operadores de RAW string a objetos
  }

  //ACTIVAMOS EL FORM
  ngOnInit() {
    this.sendDocForm = this.formBuilder.group({
      entity: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  //AÑADIMOS DOCUMENTOS PARA ENVIAR
  public addDocument(id: number) {
    var doc = this.documents.find((el) => el.id === id);
    this.documentsAdded.push({
      id: id,
      name: doc.name,
      procededEntity: doc.procededEntity,
      type: doc.type,
      user: doc.user,
      date: doc.date,
      certificated: false,
      actualHolder: doc.actualHolder,
      premium: doc.premium
    });

    var el = this.documents.findIndex((_el) => _el.id === id);
    if (el > -1) {
      this.documents.splice(el, 1);
    }
  }

  //BORRAMOS DOCUMENTOS DE LOS QUE IBAMOS A ENVIAR
  public leaveDocument(id: number) {
    var doc = this.documentsAdded.find((el) => el.id === id);
    this.documents.push({
      id: id,
      name: doc.name,
      procededEntity: doc.procededEntity,
      type: doc.type,
      user: doc.user,
      date: doc.date,
      certificated: false,
      actualHolder: doc.actualHolder,
      premium: doc.premium
    });

    var el = this.documentsAdded.findIndex((_el) => _el.id === id);
    if (el > -1) {
      this.documentsAdded.splice(el, 1);
    }
  }

  //BUSCAMOS EL OPERADOR DE LA ENTIDAD A LA QUE ENVIAREMOS EL DOCUMENTO
  //EL SERVICIO DE MIN TIC SE ENCARGARA DE ESTO
  public FindOperatorName(entity) {
    this.destinationOperator = this.minTic.SearchOperator(entity);
  }

  //ENVIAMOS UN DOCUMENTO A LA DIRECCION QUE NOS DEVOLVIO EL MIN TIC
  public SendDocument(data) {
    var entity = data.entity;
    //HALLAMOS EL NOMBRE DEL OPERADOR
    this.FindOperatorName(entity);

    //ENVIAMOS EL DOC
    if (this.destinationOperator != undefined) {
      this.documentsAdded.forEach((x) => (x.actualHolder = entity));
      this.CheckPremium(entity);
      this.crud.SendDoc(this.documentsAdded, this.destinationOperator);
      this.navCtrl.navigateBack('/home');
    } else {
      this.successMessage = '...Confirmando direccion, clickea de nuevo para enviar';
    }
  }

  //PARA CONVERTIR EL STRING QUE LLEGA DE OPERADORES DE
  //FORMA {nombre-operador-fecha} A UN ARREGLO DE OBJETOS
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

  //REVISAMOS SI OMOS PREMIUM, PARA QUITAR LA VARIABLE PREMIUM DE LOS DOCS SI NO ES EL CASO.
  CheckPremium(entity) {
    //todos en false
    this.documentsAdded.forEach((x) => (x.premium = false));
    //miramos si tenemos el operador en los premium
    this.operators.forEach((x) => {
      //a menos que encontremos que somos premium de la entidad destinjo
      if (x.name.toLocaleUpperCase().split('').join('').includes(entity.toLocaleUpperCase().split('').join(''))) {
        this.documentsAdded.forEach((x) => (x.premium = true));
      }
    });
  }
}
