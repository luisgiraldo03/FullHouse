import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'; //BASE DE DATOS
import { Storage } from '@ionic/storage'; //LOCAL STORAGE
import { User } from '../models/user';
import * as firebase from 'firebase/app'; //IMPORTAMOS ESTO PARA MODIFICAR ARREGLOS EN FIRESTORE, ACA TRAEMOS TODO FIREBASE, ( CORREGIR PARA OPTIMIZAR)

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  collectionName = 'Usuarios';

  constructor(private fireStore: AngularFirestore, private storage: Storage) {}

  //------------------------CRUD DE NUESTRO OPERADOR --------------------------

  //CREAMOS UN USUARIO
  CreateUser(id: string, user) {
    //PONEMOS LA REFERENCIA DE QUE TENEMOS EL USUARIO EN LA BASE DE DATOS DEL MIN TIC
    var FullHouse = this.fireStore.collection('Operadores').doc('FullHouse');
    FullHouse.update({
      Users: firebase.firestore.FieldValue.arrayUnion(id)
    });

    //CREAMOS EL USUARIO EN NUESTRA BASE DE DATOS LOCAL
    return this.fireStore.collection(this.collectionName).doc(id).set(user);
  }

  //LEEMOS LA INFORMACION Y NOS SUSCRIBIMOS A ESTA, OBSERVANDO CAMBIOS CON SNAPSHOTCHANGES
  //PARA ACTUALIZAR EN TIEMPO REAL
  ReadUser(userID: string) {
    return this.fireStore.collection(this.collectionName).doc(userID).snapshotChanges();
  }

  //LEEMOS LOS DOCUMENTOS DEL USUARIO, SE HACE POR APARETE POR QUE VAN EN UN DOC SEPARADO EN FIRESTORE
  ReadDocs(userID: string) {
    return this.fireStore.collection(this.collectionName).doc(userID).collection('documents').snapshotChanges();
  }

  //LEEMOS LAS SOLICITUDES DEL USUARIO, SE HACE POR APARTE POR QUE VAN EN UN DOC SEPARADO EN FIRESTORE
  ReadRequests(userID: string) {
    return this.fireStore.collection(this.collectionName).doc(userID).collection('requests').snapshotChanges();
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

    this.ReadRequests(cedula).subscribe((docs) => {
      user.UpdateRequests(docs);
    });
  }

  //ENVIAMOS UN DOCUMENTO A LA COLECCION DE DOCUMENTOS DE UN OPERADOR
  SendDoc(doc, address, email?) {
    if (address != 'FullHouse') {
      doc.forEach((element) => {
        element.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        element = { ...element };
        console.log(element);
        this.fireStore
          .collection('Operadores')
          .doc(address)
          .collection('documents')
          .doc(element['id'] + '')
          .set(element);
      });
    } else {
      var _email = email.substring(0, email.indexOf('@'));
      doc.forEach((element) => {
        element.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        element = { ...element };
        this.fireStore
          .collection('Usuarios')
          .doc(_email)
          .collection('documents')
          .doc(element['id'] + '')
          .set(element);
      });
    }
  }

  //NOS SUSCRIBIMOS A UN OPERADOR
  Suscribe(operator, targetEntity, userID, data) {
    //LE ENVIAMOS LOS DATOS DEL USUARIO AL OPERADOR
    var OperatorDB = this.fireStore.collection('Operadores').doc(operator).collection('Premium').doc(targetEntity);

    OperatorDB.update({
      Users: firebase.firestore.FieldValue.arrayUnion(userID)
    });

    //NOS INSCRIBIMOS EN EL OPERADOR EN LA DB DE FULLHOUSE
    this.fireStore
      .collection(this.collectionName)
      .doc(userID)
      .update({
        operators: firebase.firestore.FieldValue.arrayUnion(data)
      });
  }

  //BORRAMOS LA SUSCRIPCION A UN OPERADOR
  UnSuscribe(operator, targetEntity, userID, data) {
    //LE ENVIAMOS LOS DATOS DEL USUARIO AL OPERADOR
    var OperatorDB = this.fireStore.collection('Operadores').doc(operator).collection('Premium').doc(targetEntity);

    OperatorDB.update({
      Users: firebase.firestore.FieldValue.arrayRemove(userID)
    });

    //NOS INSCRIBIMOS EN EL OPERADOR EN LA DB DE FULLHOUSE
    this.fireStore
      .collection(this.collectionName)
      .doc(userID)
      .update({
        operators: firebase.firestore.FieldValue.arrayRemove(data)
      });
  }

  //------------------------CRUD DE LOS AGENTES EXTERNOS ( MIN TIC Y OTROS OPERADORES )--------------------------

  //TOMAMOS TODOS LOS OPERADORES QUE HAY
  QueryOperator() {
    return this.fireStore.collection('Operadores').snapshotChanges();
  }

  //NOS SUSCRIBIMOS A UNOS DOCUMENTOS DADO UNA ENTIDAD
  GetOperatorDocs(operator, entity) {
    return this.fireStore
      .collection('Operadores')
      .doc(operator)
      .collection('documents', (ref) => {
        return ref.where('actualHolder', '==', entity);
      })
      .snapshotChanges();
  }

  //NOS SUSCRIBIMOS A UNOS USUARIOS PREMIUM
  GetOperatorPremium(operator, entity) {
    return this.fireStore.collection('Operadores').doc(operator).collection('Premium').doc(entity).snapshotChanges();
  }

  //ENVIAMOS SOLICITUDES PARA PEDIR DOCUMENTOS A LOS USUARIOS EN CUALQUIER OPERADOR
  SendRequests(requests, address, email?) {
    if (address != 'FullHouse') {
      requests.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      requests = { ...requests };
      this.fireStore
        .collection('Operadores')
        .doc(address)
        .collection('requests')
        .doc(requests['id'] + '')
        .set(requests);
    } else {
      var _email = email.substring(0, email.indexOf('@'));
      requests.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      requests = { ...requests };
      this.fireStore
        .collection('Usuarios')
        .doc(_email)
        .collection('requests')
        .doc(requests['id'] + '')
        .set(requests);
    }
  }
  docData: any;
  premiumDocRequestEnded: boolean = false;
  PremiumDocRequest(requests, address, email, thisOperator, thisEntity) {
    if (!this.premiumDocRequestEnded) {
      this.premiumDocRequestEnded = true;
      var _email = email.substring(0, email.indexOf('@'));
      requests.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      this.fireStore
        .collection('Usuarios')
        .doc(_email)
        .collection('documents', (ref) => {
          return ref.where('name', '==', requests.documentRequest);
        })
        .snapshotChanges()
        .subscribe((data) => {
          this.docData = data.map((x) => {
            return {
              actualHolder: x.payload.doc.data()['actualHolder'],
              certificated: x.payload.doc.data()['certificated'],
              date: x.payload.doc.data()['date'],
              id: x.payload.doc.data()['id'],
              name: x.payload.doc.data()['name'],
              premium: x.payload.doc.data()['premium'],
              procededEntity: x.payload.doc.data()['procededEntity'],
              type: x.payload.doc.data()['type'],
              user: x.payload.doc.data()['user']
            };
          });
        });
    }

    if (this.docData != undefined) {
      this.docData.actualHolder = thisEntity;
      this.fireStore
        .collection('Operadores')
        .doc(thisOperator)
        .collection('documents')
        .doc(this.docData['0'].id + '')
        .set(this.docData['0']);
    }
  }
}
