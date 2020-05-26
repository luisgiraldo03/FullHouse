import { Component, OnInit } from '@angular/core';
import { Request } from '../../models/request';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {

  public requests: Request[] = [
    {
      id: 1,
      origin:'MinTic',
      type:'Solicitud de documento',
      documentRequest: 'Cédula de ciudadanía',
      date:'20/12/2020'
    },
    {
      id: 2,
      origin:'Universidad EAFIT',
      type:'Solicitud de documento',
      documentRequest: 'Certificado de estudio',
      date:'20/12/2020'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
