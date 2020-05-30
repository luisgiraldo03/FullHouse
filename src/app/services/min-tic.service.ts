import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class MinTicService {
  Operator: string = 'null'; //VARIABLE PARA SABER CUAL ES EL OPERADOR DESTINO
  searching: boolean = false; //PARA SABER SI ESTAMOS BUSCANDO O NO UN OPERADOR, YA QUE LA FUNCION TARDA UNOS MILISEGUNDOS Y NO PUEDE SER PROMISE NI AWAIT
  allOperators: any = [];
  constructor(private crud: CrudService) {
    //recibimos un arreglo con todos los operadores y las entidades que tienen ( sus usuarios )
    this.crud.QueryOperator().forEach((data) => {
      //los pasamos a un arreglo local
      this.allOperators = data.map((e) => {
        return {
          users: e.payload.doc.data()['Users'],
          name: e.payload.doc.data()['name']
        };
      });
    });
  }

  //BUSCAMOS EL OPERADOR QUE CONCUERDA CON LA ENTIDAD QUE ENVIAMOS
  public SearchOperator(entidad: string) {
    if (this.searching == false) {
      //si nos envian un correo, cambiamos el valor para que sea solo el comienzo del correo ( cedula )
      if (entidad.includes('@') && entidad.includes('.')) {
        entidad = entidad.substring(0, entidad.indexOf('@'));
      }

      //estamos buscando...
      this.searching = true;

      //buscamos que operador tiene la entidad que buscamos
      var tempAllOperators = this.allOperators.find((d) => {
        for (var i = 0; i < d.users.length; i++) {
          if (entidad.toUpperCase().split('').join('') == d.users[i].toUpperCase().split('').join('')) return this;
        }
      });

      //la asignamos como la que necesitamos
      try {
        this.Operator = tempAllOperators['name'];
      } catch (e) {
        console.log('No se encontro el operador' + e);
      }

      //si aun no la hemos encontrado, volvamos a preguntar en 100 milisegundos.
      //no volveremos a buscar ya que serarching esta en true.
      if (this.Operator == 'null' || this.Operator == undefined) {
        setTimeout(this.SearchOperator, 100);
      } else {
        //retornamos el valor ya encontrado
        this.searching = false;
        return this.Operator;
      }
    }
  }
}
