import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  constructor() { }

  private filterByName(input: any[], name: string){
      return input.filter(item => item.name.includes(name));
  }

  private filterByNumber(input: any[], fieldName:string, number:string){
      return input.filter(item => item[fieldName].includes(number));
  }

  processQuery(input: any[], fieldName:string, query:string){
      if(query === null || query === ''){
          return input;
      }
      if(isNaN(parseInt(query))){
          return this.filterByName(input, query);
      }
      return this.filterByNumber(input, fieldName, query);
  }
}
