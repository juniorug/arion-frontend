import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private baseUrl = 'http://localhost:8080/api/assets';

  constructor(private http: HttpClient) { }

  getAsset(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createAsset(Asset: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, Asset);
  }

  updateAsset(id: string, payload: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  deleteAsset(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getAssetList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
