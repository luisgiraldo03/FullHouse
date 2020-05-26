import { Component, OnInit } from '@angular/core';
import { Document } from '../../models/document';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {

  public documents: Document[] = [
    {
      id:1,
      date:'20/12/2020',
      name: 'Cédula de ciudadanía',
      procededEntity: 'Registraduría',
      type:'Documento',
      user:'Luis Giraldo'
    },
    {
      id:2,
      date:'20/12/2020',
      name: 'Registro civil',
      procededEntity: 'Registraduría',
      type:'Documento',
      user:'Luis Giraldo'
    },
    {
      id:3,
      date:'20/12/2020',
      name: 'Certificado de estudio',
      procededEntity: 'Universiad EAFIT',
      type:'Documento',
      user:'Luis Giraldo'
    },
    {
      id:4,
      date:'20/12/2020',
      name: 'Hoja de vida',
      procededEntity: 'Empresa de desarrollo',
      type:'Documento',
      user:'Luis Giraldo'
    }
  ]; 

  constructor() { }

  ngOnInit() {
  }
}
