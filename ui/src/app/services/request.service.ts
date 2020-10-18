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

  getWithBody(path, data): Observable<any>{
    data['responseType'] = 'json';
    return this.http.get(this.baseAPI + path, data);
  }

  basePost(path, data): Observable<any>{
    data['responseType'] = 'json';
    return this.http.post(this.baseAPI + path, data);
  }

  basePut(path, data):Observable<any>{
    data['responseType'] = 'json';
    return this.http.put(this.baseAPI + path, data);
  }
  
  basePatch(path, data):Observable<any>{
    data['responseType'] = 'json';
    return this.http.patch(this.baseAPI + path, data);
  }

  baseDelete(path, id): Observable<any>{
    return this.http.delete(this.baseAPI + path + id);
  }
}
