import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepService {

  private baseUrl = 'http://localhost:8080/api/steps';

  constructor(private http: HttpClient) { }

  getStep(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createStep(Step: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, Step);
  }

  updateStep(id: string, payload: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  deleteStep(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getStepList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
