import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperatorsPageRoutingModule } from './operators-routing.module';

import { OperatorsPage } from './operators.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperatorsPageRoutingModule
  ],
  declarations: [OperatorsPage]
})
export class OperatorsPageModule {}
