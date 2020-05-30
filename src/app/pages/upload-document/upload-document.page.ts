import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Document } from '../../models/document';
import { User } from '../../models/user';
import { CrudService } from '../../services/crud.service';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.page.html',
  styleUrls: ['./upload-document.page.scss']
})
export class UploadDocumentPage implements OnInit {
  //FORM
  documentForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  newDocument: Document;
  user: User;
  docType = ['Certificado', 'Extracto bancario', 'Documento', 'Identificacion'];

  constructor(private formBuilder: FormBuilder, private navCtrl: NavController, private crud: CrudService) {
    //CREAMOS EL SINGLETON Y LE PONEMOS UN OBSERVABLE PARA QUE SE ACTUALIZE CON LA DB SIEMPRE
    this.user = User.GetInstance();
    this.crud.SuscribeUser();
  }

  ngOnInit() {
    // EL FORM SE USARA PARA VALIDAR CON COLORES MIENTRAS EL USUARIO ESCRIBE
    this.documentForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      entity: new FormControl('', Validators.compose([Validators.required])),
      _type: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  // MENSAJES DE ERROR EN CASO DE QUE SE PONGA MAL LOS DATOS
  validationMessage = {
    name: [{ type: 'required', message: 'El nombre es requerido' }],
    entity: [{ type: 'required', message: 'La entidad es requerida' }],
    _type: [{ type: 'required', message: 'El tipo es requerido' }]
  };

  //MONTAMOS EL DOCUMENTO A LA BASE DE DATOS
  async uploadDocument(values) {
    this.newDocument = {
      id: this.user.documents != null ? this.user.documents.length + 1 : 1, //SI HAY DOCUMENTOS, QUE EL ID, EL ULTIMO +1, SI NO, SERA EL #1
      type: values._type,
      procededEntity: values.entity,
      date: '20/12/2020',
      user: this.user.name,
      name: values.name,
      certificated: false,
      actualHolder: 'Full House'
    };
    this.newDocument = { ...this.newDocument };
    this.successMessage = 'Cargando documento...';
    await this.crud.UploadDocument(this.user.cedula, this.newDocument);
    this.successMessage = 'Documento subido';
    this.navCtrl.navigateBack('/documents');
  }
}