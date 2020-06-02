import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Operator } from '../../models/operator';
import { CrudService } from 'src/app/services/crud.service';
import { MinTicService } from 'src/app/services/min-tic.service';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss']
})
export class PremiumPage implements OnInit {
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

  //ENTIDADES DISPONIBLES
  entities = [{ name: 'UNE' }, { name: 'MinTic' }, { name: 'MIN' }, { name: 'EAFIT' }];

  //ENTIDAD SELECCIONADA
  selectedEntity = { name: '' };

  constructor(private crud: CrudService, private minTic: MinTicService) {}

  ngOnInit() {}

  //CAMBIOS EN EL SELECT DE ENTIDADES
  onChange($event) {
    console.log($event.target.value);
    this.selectedEntity.name = $event.target.value;
  }

  //NOS SUSCRIBIMOS, ENVIANDO LA INFO A LA DB TANTO DEL USUARIO, COMO DEL OPERADOR DE LA ENTIDAD
  // Suscribe(target) {
  //   var targetOperator = this.minTic.SearchOperator(target);
  //   this.crud;
  // }
}
