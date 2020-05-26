import { Component, OnInit } from '@angular/core';
import { Operator } from '../../models/operator';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.page.html',
  styleUrls: ['./operators.page.scss'],
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

  constructor() { }

  ngOnInit() {
  }

}
