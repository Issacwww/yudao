import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { StorageService } from './storage.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsUserLoggedIn implements CanActivate {

  private token:any;
  constructor(private storage: StorageService, private router: Router) {
    this.token = this.storage.get('token');
  }

  canActivate(){
    if (this.token == null) {
        return this.router.parseUrl('/login');
      } else {
        return true;
      }
  }

}

@Injectable({
    providedIn: 'root'
})
export class IsSuperAdmin {
  
    private storeNumber:number;
    constructor(private storage: StorageService) {
      this.storeNumber = this.storage.get('store');
    }
  
    isSuperAdmin(){
        return this.storeNumber == 0;
    }
  
}
