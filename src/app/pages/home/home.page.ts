import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Menu } from '../../models/menu';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private menuCtrl: MenuController) {}

  toggleMenu(){
    this.menuCtrl.toggle();
  }

}
