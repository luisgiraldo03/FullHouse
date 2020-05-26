import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendDocumentsPage } from './send-documents.page';

const routes: Routes = [
  {
    path: '',
    component: SendDocumentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendDocumentsPageRoutingModule {}
