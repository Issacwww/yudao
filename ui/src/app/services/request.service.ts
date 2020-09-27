import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseAPI = 'http://localhost:8000/api/';
  constructor(public http: HttpClient) { }

  baseGet(path): Observable<any>{
    return this.http.get(this.baseAPI + path);
  }

  basePost(path, data): Observable<any>{
    data['responseType'] = 'json';
    console.log(data);
    return this.http.post(this.baseAPI + path, data);
  }

  basePatch(path, data):Observable<any>{
    data['responseType'] = 'json';
    console.log(data);
    console.log(path);
    return this.http.patch(this.baseAPI + path, data);
  }
}
