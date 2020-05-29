import { Component, OnInit } from '@angular/core';
import { Operator } from 'src/app/models/operator';
import { Document } from '../../models/document';
import { CrudService } from 'src/app/services/crud.service';
import { User } from '../../models/user';
import { MinTicService } from './../../services/min-tic.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-send-documents',
  templateUrl: './send-documents.page.html',
  styleUrls: ['./send-documents.page.scss']
})
export class SendDocumentsPage implements OnInit {
  public documentsAdded: Document[] = [];
  user: User;
  documents: Document[];
  waitingMinTic: boolean = false;
  destinationOperator: string = 'null';
  successMessage: string = '';
  _operador: string;

  public gubernamentalEntitis = [
    {
      name: 'EAFIT'
    },
    {
      name: 'Min Tic'
    },
    {
      name: 'MIN'
    }
  ];

  // public documents: Document[] = [
  //   {
  //     id: 1,
  //     date: '20/12/2020',
  //     name: 'Cédula de ciudadanía',
  //     procededEntity: 'Registraduría',
  //     type: 'Documento',
  //     user: 'Luis Giraldo'
  //   },
  //   {
  //     id: 2,
  //     date: '20/12/2020',
  //     name: 'Registro civil',
  //     procededEntity: 'Registraduría',
  //     type: 'Documento',
  //     user: 'Luis Giraldo'
  //   },
  //   {
  //     id: 3,
  //     date: '20/12/2020',
  //     name: 'Certificado de estudio',
  //     procededEntity: 'Universiad EAFIT',
  //     type: 'Documento',
  //     user: 'Luis Giraldo'
  //   },
  //   {
  //     id: 4,
  //     date: '20/12/2020',
  //     name: 'Hoja de vida',
  //     procededEntity: 'Empresa de desarrollo',
  //     type: 'Documento',
  //     user: 'Luis Giraldo'
  //   }
  // ];

  constructor(private crud: CrudService, private minTic: MinTicService, private navCtrl: NavController) {
    this.user = User.GetInstance();
    this.crud.SuscribeUser();
    this.documents = this.user.documents;
  }

  ngOnInit() {}

  public addDocument(id: number) {
    var doc = this.documents.find((el) => el.id === id);
    this.documentsAdded.push({
      id: id,
      name: doc.name,
      procededEntity: doc.procededEntity,
      type: doc.type,
      user: doc.user
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

  //BUSCAMOS EL OPERADOR DE LA ENTIDAD A LA QUE ENVIAREMOS EL DOCUMENTO
  //EL SERVICIO DE MIN TIC SE ENCARGARA DE ESTO
  public FindOperatorName(entity) {
    this.destinationOperator = this.minTic.SearchOperator(entity);
  }

  //ENVIAMOS UN DOCUMENTO A LA DIRECCION QUE NOS DEVOLVIO EL MIN TIC
  public SendDocument(entity) {
    console.log(entity);
    //HALLAMOS EL NOMBRE DEL OPERADOR
    this.FindOperatorName(entity);

    //ENVIAMOS EL DOC
    if (this.destinationOperator != undefined) {
      this.documentsAdded.forEach((x) => (x.actualHolder = entity));
      this.crud.SendDoc(this.documentsAdded, this.destinationOperator);
      this.navCtrl.navigateBack('/documents');
    } else {
      this.successMessage = '...Confirmando direccion, clickea de nuevo para enviar';
    }
  }
}
