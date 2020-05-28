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

  //------------------------CRUD DE NUESTRO OPERADOR --------------------------

  //CREAMOS UN USUARIO
  CreateUser(id: string, user) {
    return this.fireStore.collection(this.collectionName).doc(id).set(user);
  }

  //LEEMOS LA INFORMACION Y NOS SUSCRIBIMOS A ESTA, OBSERVANDO CAMBIOS CON SNAPSHOTCHANGES
  //PARA ACTUALIZAR EN TIEMPO REAL
  ReadUser(userID: string) {
    return this.fireStore.collection(this.collectionName).doc(userID).snapshotChanges();
  }

  ReadDocs(userID: string) {
    return this.fireStore.collection(this.collectionName).doc(userID).collection('documents').snapshotChanges();
  }

  //ACTUALIZAMOS EL USUARIO
  UpdateUser(userID, user) {
    this.fireStore.doc(this.collectionName + '/' + userID).update(user);
  }

  UploadDocument(userID: string, document) {
    return this.fireStore
      .collection(this.collectionName + '/' + userID + '/' + 'documents')
      .doc(document.id + '')
      .set(document);
  }

  //BORRAMOS EL USUARIO
  DeleteUser(userID) {
    this.fireStore.doc(this.collectionName + '/' + userID).delete();
  }

  //NOS SUSCRIBIMOS AL DOCUMENTO #CEDULA DEL USUARIO Y LE ACTUALIZAMOS CUALQUIER CAMBIO EN EL USUARIO O EN SUS DOCUMENTOS
  async SuscribeUser() {
    var user = User.GetInstance();
    var cedula = await this.storage.get('UserCedula');
    this.ReadUser(cedula).subscribe((data) => {
      user.UpdateVal(data);
    });

    this.ReadDocs(cedula).subscribe((docs) => {
      user.UpdateDocs(docs);
    });
  }

  //ENVIAMOS UN DOCUMENTO A LA COLECCION DE DOCUMENTOS DE UN OPERADOR
  SendDoc(doc, address) {
    console.log(doc);
    doc.forEach((element) => {
      element.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      element = { ...element };
      this.fireStore
        .collection('Operadores')
        .doc(address)
        .collection('documents')
        .doc(element['id'] + '')
        .set(element);
    });
  }

  //------------------------CRUD DE LOS AGENTES EXTERNOS ( MIN TIC Y OTROS OPERADORES )--------------------------

  //TOMAMOS TODOS LOS OPERADORES QUE HAY
  QueryOperator() {
    return this.fireStore.collection('Operadores').snapshotChanges();
  }
}
