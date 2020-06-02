import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentModule } from './components/component.module';

//BASE DE DATOS
import { firebaseConfig } from '../environments/firebaseConfig';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

//LOCAL STORAGE
import { IonicStorageModule } from '@ionic/storage';

//AUTENTICACIÓN FINGER-PRINT
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { LoginPageModule } from './pages/login/login.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig), //INICIALIZAMOS LA BASE DE DATOS CON NUESTRA CONFIG
    AngularFirestoreModule,
    LoginPageModule
  ],
  providers: [StatusBar, SplashScreen,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, FingerprintAIO],
  bootstrap: [AppComponent]
})
export class AppModule {}
