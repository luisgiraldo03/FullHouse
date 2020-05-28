import { Operator } from './operator';
import { Document } from './document';
import { Request } from './request';

export class User {
  cedula: string;
  name: string;
  email: string;
  password?: string;
  fingerPrint?: any;
  documents?: Document[];
  operators?: Operator[];
  requests?: Request[];
  suscriptionType: string;
  bondedOperator: Operator;

  private static instance: User;
  //USUARIO BASE
  private constructor() {
    (this.cedula = ''), (this.name = ''), (this.password = ''), (this.fingerPrint = ''), (this.documents = null);
    this.operators = null;
    this.requests = null;
    this.suscriptionType = 'normal';
    this.bondedOperator;
  }

  //CREAMOS EL SINGLETON DEL USUARIO
  public static GetInstance(): User {
    return this.instance || (this.instance = new this());
  }

  //PARA MANTENER AL USUARIO SIEMPRE ACTUALIZADO CUANDO LE CONECTEMOS EL OBSERVABLE
  public UpdateVal?(data) {
    this.cedula = data.payload.data()['cedula'];
    this.name = data.payload.data()['name'];
    this.email = data.payload.data()['email'];
    this.password = data.payload.data()['password'];
    this.fingerPrint = data.payload.data()['fingerprint'];
    this.operators = data.payload.data()['operators'];
    this.requests = data.payload.data()['requests'];
    this.suscriptionType = data.payload.data()['suscriptionType'];
    this.bondedOperator = data.payload.data()['bondedOperator'];
  }

  //ACTUALIZAMOS LOS DOCUMENTOS DEL USUARIO SIEMPRE QUE CAMBIEN
  public UpdateDocs?(docs) {
    this.documents = [];
    this.documents = docs.map((e) => {
      return {
        id: e.payload.doc.data()['id'],
        type: e.payload.doc.data()['type'],
        procededEntity: e.payload.doc.data()['procededEntity'],
        date: e.payload.doc.data()['date'],
        user: e.payload.doc.data()['user'],
        name: e.payload.doc.data()['name'],
        certificated: e.payload.doc.data()['certificated']
      };
    });
  }
}
