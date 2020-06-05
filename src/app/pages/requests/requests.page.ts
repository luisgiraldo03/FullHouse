import { Component, OnInit } from '@angular/core';
import { Request } from '../../models/request';
import { CrudService } from 'src/app/services/crud.service';
import { User } from 'src/app/models/user';
import { MinTicService } from 'src/app/services/min-tic.service';
import { NavController } from '@ionic/angular';
import { DocManagerService } from 'src/app/services/doc-manager.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss']
})
export class RequestsPage implements OnInit {
  requests: Request[];
  user: User;
  destinationOperator: string;

  constructor(
    private crud: CrudService,
    private minTic: MinTicService,
    private navCtrl: NavController,
    private docSendManager: DocManagerService
  ) {
    //CREAMOS EL SINGLETON Y LE PONEMOS UN OBSERVABLE PARA QUE SE ACTUALIZE CON LA DB SIEMPRE
    this.user = User.GetInstance();
    this.crud.SuscribeUser();
    this.requests = this.user.requests;
  }

  //ENVIAMOS EL DOCUMENTO CORRESPONDIENTE AL OPERADOR Y BORRAMOS EL REQUEST
  Accept(request) {
    var docs = this.user.documents;
    var docToSend = [];
    this.destinationOperator = this.minTic.SearchOperator(request.origin);
    docs.forEach((doc) => {
      if (doc.name.toUpperCase().split('').join('') == request.documentRequest.toUpperCase().split('').join('')) {
        if (doc.type.includes(request.type)) {
          docToSend.push(doc);
          return;
        } else {
          docToSend.push(doc);
        }
      }
    });
    if (docToSend.length >= 1) {
      docToSend.forEach((x) => (x.actualHolder = request.origin));
      if (this.docSendManager.SendDocument(request.origin, docToSend)) {
        this.crud.RejectRequest(request, this.user.email);
        this.navCtrl.navigateBack('/home');
      } else {
        console.log('problemas en docManagerSender');
      }
    }
  }

  //BORRAMOS LA REQUEST QUE NO QUEREMOS
  Reject(request) {
    this.crud.RejectRequest(request, this.user.email);
    this.navCtrl.navigateBack('/home');
  }

  ngOnInit() {}
}
