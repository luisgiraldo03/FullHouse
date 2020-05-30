import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'documents',
    loadChildren: () => import('./pages/documents/documents.module').then((m) => m.DocumentsPageModule)
  },
  {
    path: 'requests',
    loadChildren: () => import('./pages/requests/requests.module').then((m) => m.RequestsPageModule)
  },
  {
    path: 'operators',
    loadChildren: () => import('./pages/operators/operators.module').then((m) => m.OperatorsPageModule)
  },
  {
    path: 'send-documents',
    loadChildren: () => import('./pages/send-documents/send-documents.module').then((m) => m.SendDocumentsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then((m) => m.RegisterPageModule)
  },
  {
    path: 'upload-document',
    loadChildren: () => import('./pages/upload-document/upload-document.module').then((m) => m.UploadDocumentPageModule)
  },
  {
    path: 'premium',
    loadChildren: () => import('./pages/premium/premium.module').then( m => m.PremiumPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
