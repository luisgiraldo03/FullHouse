import { Component, OnInit } from '@angular/core';
import { Request } from '../../models/request';
import { CrudService } from 'src/app/services/crud.service';
import { User } from 'src/app/models/user';
import { MinTicService } from 'src/app/services/min-tic.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss']
})
export class RequestsPage implements OnInit {
  requests: Request[];
  // public requests: Request[] = [
  //   {
  //     id: 1,
  //     origin: 'MinTic',
  //     type: 'Solicitud de documento',
  //     documentRequest: 'Cédula de ciudadanía',
  //     date: '20/12/2020'
  //   },
  //   {
  //     id: 2,
  //     origin: 'Universidad EAFIT',
  //     type: 'Solicitud de documento',
  //     documentRequest: 'Certificado de estudio',
  //     date: '20/12/2020'
  //   }
  // ];

  user: User;
  destinationOperator: string;

  constructor(private crud: CrudService, private minTic: MinTicService, private navCtrl: NavController) {
    //CREAMOS EL SINGLETON Y LE PONEMOS UN OBSERVABLE PARA QUE SE ACTUALIZE CON LA DB SIEMPRE
    this.user = User.GetInstance();
    this.crud.SuscribeUser();
    this.requests = this.user.requests;
  }

  Accept(request) {
    console.log(request.documentRequest);
    var docs = this.user.documents;
    var docToSend = [];
    this.destinationOperator = this.minTic.SearchOperator(request.origin);
    docs.forEach((doc) => {
      if (doc.name == request.documentRequest) {
        if (doc.type.includes(request.type)) {
          docToSend.push(doc);
          return;
        } else {
          docToSend.push(doc);
        }
      }
    });
    console.log(docToSend);
    if (docToSend.length >= 1) this.SendDocument(request.origin, docToSend);
  }

  //ENVIAMOS UN DOCUMENTO A LA DIRECCION QUE NOS DEVOLVIO EL MIN TIC
  public SendDocument(entity, doc) {
    //HALLAMOS EL NOMBRE DEL OPERADOR EL SERVICIO DE MIN TIC SE ENCARGARA DE ESTO
    this.destinationOperator = this.minTic.SearchOperator(entity);
    console.log(this.destinationOperator);
    //ENVIAMOS EL DOC
    if (this.destinationOperator != undefined) {
      doc.actualHolder = entity;
      console.log('sending..');
      this.crud.SendDoc(doc, this.destinationOperator);
      //ACA TOCA BORRAR EL REQUEST, NO LO HAREMOS HASTA NO IMPLEMENTAR EL ENVIO DE REQUEST
    } else {
      console.log('...Confirmando direccion, clickea de nuevo para enviar');
    }
  }

  ngOnInit() {}
}
