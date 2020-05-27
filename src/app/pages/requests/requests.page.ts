import { Component, OnInit } from '@angular/core';
import { Request } from '../../models/request';
import { CrudService } from 'src/app/services/crud.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss']
})
export class RequestsPage implements OnInit {
  public requests: Request[] = [
    {
      id: 1,
      origin: 'MinTic',
      type: 'Solicitud de documento',
      documentRequest: 'Cédula de ciudadanía',
      date: '20/12/2020'
    },
    {
      id: 2,
      origin: 'Universidad EAFIT',
      type: 'Solicitud de documento',
      documentRequest: 'Certificado de estudio',
      date: '20/12/2020'
    }
  ];

  user: User;

  constructor(private crud: CrudService) {
    //CREAMOS EL SINGLETON Y LE PONEMOS UN OBSERVABLE PARA QUE SE ACTUALIZE CON LA DB SIEMPRE
    this.user = User.GetInstance();
    this.crud.SuscribeUser();
  }

  ngOnInit() {}
}
