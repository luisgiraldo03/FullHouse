import { Component, OnInit } from '@angular/core';
import { Operator } from 'src/app/models/operator';
import { Document } from '../../models/document';

@Component({
  selector: 'app-send-documents',
  templateUrl: './send-documents.page.html',
  styleUrls: ['./send-documents.page.scss'],
})
export class SendDocumentsPage implements OnInit {


  public documentsAdded: Document[] = [];
  public operators: Operator[] = [
    {
      id: 1,
      company: 'Mintic',
      name: 'MinCarpeta',
      bondingDate: '03/06/2020'
    },
    {
      id: 1,
      company: 'Gobernación',
      name: 'govCarpeta',
      bondingDate: '03/06/2020'
    }
  ];

  public documents: Document[] = [
    {
      id: 1,
      date: '20/12/2020',
      name: 'Cédula de ciudadanía',
      procededEntity: 'Registraduría',
      type: 'Documento',
      user: 'Luis Giraldo'
    },
    {
      id: 2,
      date: '20/12/2020',
      name: 'Registro civil',
      procededEntity: 'Registraduría',
      type: 'Documento',
      user: 'Luis Giraldo'
    },
    {
      id: 3,
      date: '20/12/2020',
      name: 'Certificado de estudio',
      procededEntity: 'Universiad EAFIT',
      type: 'Documento',
      user: 'Luis Giraldo'
    },
    {
      id: 4,
      date: '20/12/2020',
      name: 'Hoja de vida',
      procededEntity: 'Empresa de desarrollo',
      type: 'Documento',
      user: 'Luis Giraldo'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  public addDocument(id: number, name: string) {
    var name = this.documents.find(el => el.id === id).name;
    this.documentsAdded.push({
      id: id,
      name: name
    });

    var el = this.documents.findIndex(_el => _el.id === id);
    if (el > -1) {
      this.documents.splice(el, 1);
    }
    console.log(this.documentsAdded);
  }

  public leaveDocument(id: number){
    var name = this.documentsAdded.find(el => el.id === id).name;
    this.documents.push({
      id: id,
      name: name
    });

    var el = this.documentsAdded.findIndex(_el => _el.id === id);
    if (el > -1) {
      this.documentsAdded.splice(el, 1);
    }
  }
  

}
