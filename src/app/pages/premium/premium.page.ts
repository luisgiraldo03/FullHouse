import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Operator } from '../../models/operator';

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
  constructor() {}

  ngOnInit() {}
}
