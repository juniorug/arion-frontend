import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetItemService {

  private baseUrl = 'http://localhost:8080/api/asset-items';

  constructor(private http: HttpClient) { }

  getAssetItem(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createAssetItem(AssetItem: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, AssetItem);
  }

  updateAssetItem(id: number, payload: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  deleteAssetItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getAssetItemList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
