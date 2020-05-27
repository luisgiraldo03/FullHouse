import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'; //BASE DE DATOS
import { Storage } from '@ionic/storage'; //LOCAL STORAGE

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

  UpdateUser(userID, user) {
    this.fireStore.doc(this.collectionName + '/' + userID).update(user);
  }

  DeleteUser(userID) {
    this.fireStore.doc(this.collectionName + '/' + userID).delete();
  }
}
