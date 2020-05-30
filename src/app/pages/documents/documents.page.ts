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
  user: User;

  constructor(private crud: CrudService) {
    //CREAMOS EL SINGLETON Y LE PONEMOS UN OBSERVABLE PARA QUE SE ACTUALIZE CON LA DB SIEMPRE
    this.user = User.GetInstance();
    this.crud.SuscribeUser(); //OBSERVABLE
    this.documents = this.user.documents;
  }

  ngOnInit() {}
}
