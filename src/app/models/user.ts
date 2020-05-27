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
}
