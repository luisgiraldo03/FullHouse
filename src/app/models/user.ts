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
    this.documents = data.payload.data()['documents'];
    this.operators = data.payload.data()['operators'];
    this.requests = data.payload.data()['requests'];
    this.suscriptionType = data.payload.data()['suscriptionType'];
    this.bondedOperator = data.payload.data()['bondedOperator'];
  }
}
