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

  clear(){
    sessionStorage.clear();
  }
}
