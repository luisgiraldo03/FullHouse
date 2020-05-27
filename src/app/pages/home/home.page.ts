import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Menu } from '../../models/menu';
import { CrudService } from 'src/app/services/crud.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  user: User;
  constructor(private menuCtrl: MenuController, private crud: CrudService) {
    //CREAMOS EL SINGLETON Y LE PONEMOS UN OBSERVABLE PARA QUE SE ACTUALIZE CON LA DB SIEMPRE
    this.user = User.GetInstance();
    this.crud.SuscribeUser();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
