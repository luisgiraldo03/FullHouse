import { Component, OnInit } from '@angular/core';
import { Document } from '../../models/document';
import { CrudService } from 'src/app/services/crud.service';
import { MinTicService } from './../../services/min-tic.service';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.page.html',
  styleUrls: ['./operators.page.scss']
})
export class OperatorsPage implements OnInit {
  public documentsAdded: Document[] = []; //DOCS A ENVIAR
  documents: Document[]; // DOCS ACTUALES
  waitingMinTic: boolean = false; // PARA SABER SI ESTAMOS REALIZANDO UNA BUSQUEDA EN EL MIN TIC
  destinationOperator: string = 'null'; //PARA SABER A QUE OPERADOR ENVIAREMOS LOS DOCS
  successMessage: string = '';
  searchOperator: string; // AQUI GUARDAREMOS LA ENTIDAD ACTUAL EN EL HTML
  sendDocForm: FormGroup;

  //POSIBLES OPCIONES DE ENTIDADES
  public operators = [
    {
      name: 'GovCarpeta'
    },
    {
      name: 'MinCarpeta'
    },
    {
      name: 'TicCarpeta'
    }
  ];

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
  }

  //ACTULIAZAMOS LOS DOCUMENTOS DEL OPERADOR CONFORME LOS CAMBIEMOS EN EL ION SELECT
  onChange($event) {
    this.crud.GetOperatorDocs($event.target.value).subscribe((data) => {
      this.documents = data.map((e) => {
        return {
          id: e.payload.doc.data()['id'],
          type: e.payload.doc.data()['type'],
          procededEntity: e.payload.doc.data()['procededEntity'],
          date: e.payload.doc.data()['date'],
          user: e.payload.doc.data()['user'],
          name: e.payload.doc.data()['name'],
          certificated: e.payload.doc.data()['certificated'],
          actualHolder: e.payload.doc.data()['actualHolder']
        };
      });
    });
  }

  public addDocument(id: number) {
    var doc = this.documents.find((el) => el.id === id);
    this.documentsAdded.push({
      id: id,
      name: doc.name,
      procededEntity: doc.procededEntity,
      type: doc.type,
      user: doc.user,
      date: doc.date,
      certificated: true
    });

    var el = this.documents.findIndex((_el) => _el.id === id);
    if (el > -1) {
      this.documents.splice(el, 1);
    }
    console.log(this.documentsAdded);
  }

  public leaveDocument(id: number) {
    var doc = this.documentsAdded.find((el) => el.id === id);
    this.documents.push({
      id: id,
      name: doc.name,
      procededEntity: doc.procededEntity,
      type: doc.type,
      user: doc.user
    });

    var el = this.documentsAdded.findIndex((_el) => _el.id === id);
    if (el > -1) {
      this.documentsAdded.splice(el, 1);
    }
  }

  SendDocuments(data) {
    //SI HAY MENOS DE 1 DOCUMENTO NO SE PODRA ENVIAR
    if (this.documentsAdded.length < 1) {
      console.log('Necesitas mas documentos para enviar');
      return;
    } else {
      this.destinationOperator = this.minTic.SearchOperator(data.email);
      if (this.destinationOperator != undefined) {
        this.documentsAdded.forEach((x) => (x.actualHolder = data.email));
        this.crud.SendDoc(this.documentsAdded, this.destinationOperator, data.email);
        this.navCtrl.navigateBack('/documents');
      } else {
        this.successMessage = '...Confirmando direccion, clickea de nuevo para enviar';
      }
    }

    //this.crud.Test();
  }
}
