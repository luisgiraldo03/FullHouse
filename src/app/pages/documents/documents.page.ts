import { Component, OnInit } from '@angular/core';
import { Document } from '../../models/document';
import { CrudService } from 'src/app/services/crud.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss']
})
export class DocumentsPage implements OnInit {
  documents: Document[];
  // public documents: Document[] = [
  //   {
  //     id: 1,
  //     date: '20/12/2020',
  //     name: 'Cédula de ciudadanía',
  //     procededEntity: 'Registraduría',
  //     type: 'Documento',
  //     user: 'Luis Giraldo',
  //     certificated: true
  //   },
  //   {
  //     id: 2,
  //     date: '20/12/2020',
  //     name: 'Registro civil',
  //     procededEntity: 'Registraduría',
  //     type: 'Documento',
  //     user: 'Luis Giraldo',
  //     certificated: true
  //   },
  //   {
  //     id: 3,
  //     date: '20/12/2020',
  //     name: 'Certificado de estudio',
  //     procededEntity: 'Universiad EAFIT',
  //     type: 'Documento',
  //     user: 'Luis Giraldo',
  //     certificated: true
  //   },
  //   {
  //     id: 4,
  //     date: '20/12/2020',
  //     name: 'Hoja de vida',
  //     procededEntity: 'Empresa de desarrollo',
  //     type: 'Documento',
  //     user: 'Luis Giraldo',
  //     certificated: false
  //   }
  // ];

  user: User;

  constructor(private crud: CrudService) {
    //CREAMOS EL SINGLETON Y LE PONEMOS UN OBSERVABLE PARA QUE SE ACTUALIZE CON LA DB SIEMPRE
    this.user = User.GetInstance();
    this.crud.SuscribeUser(); //OBSERVABLE
    this.documents = this.user.documents;
  }

  ngOnInit() {}
}
