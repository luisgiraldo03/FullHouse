import { Operator } from './operator';
import { Document } from './document';
import { Request } from './request';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  fingerPrint?: any;
  documents?: Document[];
  operators?: Operator[];
  requests?: Request[];
  suscriptionType: string;
}
