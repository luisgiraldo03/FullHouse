import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'; //BASE DE DATOS
import { Storage } from '@ionic/storage'; //LOCAL STORAGE
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  collectionName = 'Usuarios';

  constructor(private fireStore: AngularFirestore, private storage: Storage) {}

  //CREAMOS UN USUARIO
  CreateUser(id: string, user) {
    return this.fireStore.collection(this.collectionName).doc(id).set(user);
  }

  //LEEMOS LA INFORMACION Y NOS SUSCRIBIMOS A ESTA, OBSERVANDO CAMBIOS CON SNAPSHOTCHANGES
  //PARA ACTUALIZAR EN TIEMPO REAL
  ReadUser(id: string) {
    return this.fireStore.collection(this.collectionName).doc(id).snapshotChanges();
  }

  //ACTUALIZAMOS EL USUARIO
  UpdateUser(userID, user) {
    this.fireStore.doc(this.collectionName + '/' + userID).update(user);
  }

  //BORRAMOS EL USUARIO
  DeleteUser(userID) {
    this.fireStore.doc(this.collectionName + '/' + userID).delete();
  }

  //NOS SUSCRIBIMOS AL DOCUMENTO #CEDULA DEL USUARIO Y LE ACTUALIZAMOS CUALQUIER CAMBIO
  async SuscribeUser() {
    var user = User.GetInstance();
    var cedula = await this.storage.get('UserCedula');
    this.ReadUser(cedula).subscribe((data) => {
      user.UpdateVal(data);
    });
  }
}
