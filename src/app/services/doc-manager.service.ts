import { Injectable } from '@angular/core';
import { MinTicService } from './min-tic.service';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class DocManagerService {
  constructor(private minTic: MinTicService, private crud: CrudService) {}

  //BUSCAMOS EL OPERADOR DESTINO Y ENVIAMOS EL DOC
  public SendDocument(entity, docs) {
    try {
      let destinationOperator = this.minTic.SearchOperator(entity);
      this.crud.SendDoc(docs, destinationOperator);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
