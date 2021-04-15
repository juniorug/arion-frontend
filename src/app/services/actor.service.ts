import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  private baseUrl = 'http://localhost:8080/api/actors';

  constructor(private http: HttpClient) { }

  getActor(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createActor(Actor: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, Actor);
  }

  updateActor(id: number, payload: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  deleteActor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getActorList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}

