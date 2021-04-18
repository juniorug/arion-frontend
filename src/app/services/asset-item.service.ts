import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetItemService {

  private baseUrl = 'http://localhost:8080/api/asset-items';

  constructor(private http: HttpClient) { }

  createAssetItem(AssetItem: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, AssetItem);
  }

  getAssetItemList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  updateAssetItem(id: string, payload: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  getAssetItem(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  deleteAssetItem(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  moveAssetItem(id: string, AssetItem: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/${id}`, AssetItem);
  }
  
  trackAssetItem(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/track/${id}`);
  }

}
