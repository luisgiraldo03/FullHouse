import { Component, OnInit } from '@angular/core';
import { Operator } from '../../models/operator';
import { CrudService } from 'src/app/services/crud.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.page.html',
  styleUrls: ['./operators.page.scss']
})
export class OperatorsPage implements OnInit {
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

  user: User;

  constructor(private crud: CrudService) {
    //CREAMOS EL SINGLETON Y LE PONEMOS UN OBSERVABLE PARA QUE SE ACTUALIZE CON LA DB SIEMPRE
    this.user = User.GetInstance();
    this.crud.SuscribeUser();
  }

  ngOnInit() {}
}
