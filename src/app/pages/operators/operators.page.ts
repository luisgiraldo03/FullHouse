import { Component, OnInit, ɵConsole } from '@angular/core';
import { Document } from '../../models/document';
import { CrudService } from 'src/app/services/crud.service';
import { MinTicService } from './../../services/min-tic.service';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Request } from '../../models/request';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.page.html',
  styleUrls: ['./operators.page.scss']
})
export class OperatorsPage implements OnInit {
  public documentsAdded: Document[] = []; //DOCS A ENVIAR
  requests: Request;
  documents: Document[]; // DOCS ACTUALES
  waitingMinTic: boolean = false; // PARA SABER SI ESTAMOS REALIZANDO UNA BUSQUEDA EN EL MIN TIC
  destinationOperator: string = 'null'; //PARA SABER A QUE OPERADOR ENVIAREMOS LOS DOCS
  successMessage: string = '';
  searchOperator: string; // AQUI GUARDAREMOS LA ENTIDAD ACTUAL EN EL HTML
  sendDocForm: FormGroup;
  sendRequests: FormGroup;
  localPremiumArr: any = []; // ARREGLO DE PREMIUMS

  //POSIBLES OPCIONES DE OPERADORES
  public operators = [
    {
      name: 'GovCarpeta/MinTic'
    },
    {
      name: 'MinCarpeta/MIN'
    },
    {
      name: 'TicCarpeta/EAFIT'
    },
    {
      name: 'PQcarpeta/UNE'
    }
  ];

  //POSIBLES OPCIONES DE ENTIDADES
  public entity = [
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

  //TIPOS DE REQUEST
  public requestTypes = [
    {
      name: 'certificado'
    },
    {
      name: 'extracto bancario'
    },
    {
      name: 'documento'
    },
    {
      name: 'identidad'
    }
  ];

  targetOperator: string;
  targetEntity: string;

  constructor(
    private crud: CrudService,
    private minTic: MinTicService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder
  ) {}

  //FORM PARA QUE AGREGUEN TODOS LOS DATOS
  ngOnInit() {
    this.sendDocForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
      ),
      operator: new FormControl('', Validators.compose([Validators.required]))
    });

    this.sendRequests = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
      ),
      requestType: new FormControl('', Validators.compose([Validators.required])),
      docReq: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  //ACTULIAZAMOS LOS DOCUMENTOS DEL OPERADOR CONFORME LOS CAMBIEMOS EN EL ION SELECT
  onChange($event) {
    this.targetOperator = $event.target.value.substring(0, $event.target.value.indexOf('/'));
    this.targetEntity = $event.target.value.substring($event.target.value.indexOf('/') + 1);
    this.crud.GetOperatorDocs(this.targetOperator, this.targetEntity).subscribe((data) => {
      this.documents = data.map((e) => {
        return {
          id: e.payload.doc.data()['id'],
          type: e.payload.doc.data()['type'],
          procededEntity: e.payload.doc.data()['procededEntity'],
          date: e.payload.doc.data()['date'],
          user: e.payload.doc.data()['user'],
          name: e.payload.doc.data()['name'],
          certificated: e.payload.doc.data()['certificated'],
          actualHolder: e.payload.doc.data()['actualHolder'],
          premium: e.payload.doc.data()['premium']
        };
      });
    });

    //TRAEMOS SUS USUARIOS PREMIUM
    var dataPremiumArr = this.crud.GetOperatorPremium(this.targetOperator, this.targetEntity);
    dataPremiumArr.forEach((element) => {
      this.localPremiumArr.push(element.payload.data());
    });
  }

  addDocument(id: number) {
    var doc = this.documents.find((el) => el.id === id);
    this.documentsAdded.push({
      id: id,
      name: doc.name,
      procededEntity: doc.procededEntity,
      type: doc.type,
      user: doc.user,
      date: doc.date,
      certificated: true,
      actualHolder: doc.actualHolder,
      premium: doc.premium
    });

    var el = this.documents.findIndex((_el) => _el.id === id);
    if (el > -1) {
      this.documents.splice(el, 1);
    }
  }

  public leaveDocument(id: number) {
    var doc = this.documentsAdded.find((el) => el.id === id);
    this.documents.push({
      id: id,
      name: doc.name,
      procededEntity: doc.procededEntity,
      type: doc.type,
      user: doc.user,
      date: doc.date,
      certificated: true,
      actualHolder: doc.actualHolder,
      premium: doc.premium
    });

    var el = this.documentsAdded.findIndex((_el) => _el.id === id);
    if (el > -1) {
      this.documentsAdded.splice(el, 1);
    }
  }

  //LE ENVIAMOS 1 O MAS DOCUMENTOS AL USUARIO
  SendDocuments(data) {
    //SI HAY MENOS DE 1 DOCUMENTO NO SE PODRA ENVIAR
    if (this.documentsAdded.length < 1) {
      console.log('Necesitas mas documentos para enviar');
      return;
    } else {
      this.destinationOperator = this.minTic.SearchOperator(data.email);
      if (this.destinationOperator != undefined) {
        this.documentsAdded.forEach((x) => (x.actualHolder = data.email));
        if (this.CheckPremium(data.email)) this.documentsAdded.forEach((x) => (x.premium = true));
        this.crud.SendDoc(this.documentsAdded, this.destinationOperator, data.email);
        this.navCtrl.navigateBack('/home');
      } else {
        this.successMessage = '...Confirmando direccion, clickea de nuevo para enviar';
      }
    }
  }

  //LE HACEMOS UNA PETICION AL USUARIO PARA QUE NOS ENVIE UN DOCUMENTO
  SendRequests(data) {
    this.destinationOperator = this.minTic.SearchOperator(data.email);
    this.requests = {
      id: 0,
      type: data.requestType,
      origin: this.targetEntity,
      documentRequest: data.docReq,
      date: '20/05/1996'
    };
    if (this.destinationOperator != undefined) {
      if (!this.CheckPremium(data.email)) {
        this.crud.SendRequests(this.requests, this.destinationOperator, data.email);
      } else {
        this.crud.PremiumDocRequest(
          this.requests,
          this.destinationOperator,
          data.email,
          this.targetOperator,
          this.targetEntity
        );
      }
      this.navCtrl.navigateBack('/home');
    } else {
      this.successMessage = '...Confirmando direccion, clickea de nuevo para enviar';
    }
  }

  //CHEQUEAMOS SI AL USUARIO AL QUE LE ENVIAREMOS EL DOC ES PREMIUM
  CheckPremium(email) {
    email = email.substring(0, email.indexOf('@'));
    if (this.localPremiumArr['0'] != undefined && this.localPremiumArr['0']['Users'] != undefined) {
      if (this.localPremiumArr['0']['Users'].includes(email)) return true; // es un objeto con 1 objeto aninado y 1 arreglo dentro de ese segundo objeto
    }
    return false;
  }
}
