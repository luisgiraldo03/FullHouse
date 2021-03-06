import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/models/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public menus: Menu[] = [
    {
      icon: 'body',
      name: 'Inicio',
      redirectTo: '/home'
    },
    {
      icon: 'document-text',
      name: 'Documentos',
      redirectTo: '/documents'
    },
    {
      icon: 'arrow-forward',
      name: 'Solicitudes',
      redirectTo: '/requests'
    },
    {
      icon: 'star-outline',
      name: 'Premium',
      redirectTo: '/premium'
    },
    {
      icon: 'desktop-outline',
      name: 'Operadores',
      redirectTo: '/operators'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
