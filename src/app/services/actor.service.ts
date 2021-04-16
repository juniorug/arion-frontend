import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  private baseUrl = 'http://localhost:8080/api/actors';

  constructor(private http: HttpClient) { }

  createActor(Actor: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, Actor);
  }

  getActorList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  updateActor(id: number, payload: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }
  
  getActor(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  deleteActor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

}

