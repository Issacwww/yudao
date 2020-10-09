import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get (key: string ) {
    return JSON.parse(sessionStorage.getItem(key));
  }
    
  set (key: string, value: any ) {
      sessionStorage.setItem(key, JSON.stringify(value));
  }

  setMap(key:string, value: Map<any, any>) {
    sessionStorage.setItem(key, JSON.stringify(Array.from(value.entries())));
  }

  getMap(key:string){
    return new Map(JSON.parse(sessionStorage.getItem(key)));
  }

  clear(){
    sessionStorage.clear();
  }
}
