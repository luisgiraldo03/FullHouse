import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class MinTicService {
  Operator: string = 'null'; //VARIABLE PARA SABER CUAL ES EL OPERADOR DESTINO
  searching: boolean = false; //PARA SABER SI ESTAMOS BUSCANDO O NO UN OPERADOR, YA QUE LA FUNCION TARDA UNOS MILISEGUNDOS Y NO PUEDE SER PROMISE NI AWAIT
  constructor(private crud: CrudService) {}

  //BUSCAMOS EL OPERADOR QUE CONCUERDA CON LA ENTIDAD QUE ENVIAMOS
  public SearchOperator(entidad: string) {
    if (this.searching == false) {
      //si nos envian un correo, cambiamos el valor para que sea solo el comienzo del correo ( cedula )
      if (entidad.includes('@') && entidad.includes('.')) {
        entidad = entidad.substring(0, entidad.indexOf('@'));
      }

      this.searching = true;
      var allOperators = [];

      //recibimos un arreglo con todos los operadores y las entidades que tienen ( sus usuarios )
      this.crud.QueryOperator().forEach((data) => {
        //los pasamos a un arreglo local
        allOperators = data.map((e) => {
          return {
            users: e.payload.doc.data()['Users'],
            name: e.payload.doc.data()['name']
          };
        });

        //buscamos que operador tiene la entidad que buscamos
        allOperators = allOperators.find((d) => {
          for (var i = 0; i < d.users.length; i++) {
            if (entidad == d.users[i]) return this;
          }
        });

        //la asignamos como la que necesitamos
        this.Operator = allOperators['name'];
      });
    }

    //si aun no la hemos encontrado, volvamos a preguntar en 100 milisegundos.
    //no volveremos a buscar ya que serarching esta en true.
    if (this.Operator == 'null') {
      setTimeout(this.SearchOperator, 100);
    } else {
      //retornamos el valor ya encontrado
      return this.Operator;
    }
  }
}
