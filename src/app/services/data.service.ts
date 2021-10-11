import { Injectable } from '@angular/core';
import { Asset } from '@app/models/asset';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private storage: Storage;
  static SHARED_ASSET: string = "sharedAsset";

  constructor() {
    this.storage = window.localStorage;
  }

  getSharedAsset():Asset {
    if (this.storage) {
      return JSON.parse(this.storage.getItem(DataService.SHARED_ASSET));
    }
    return null;
  }

  setSharedAsset(asset: Asset): boolean  {
    if (this.storage) {
      this.storage.setItem(DataService.SHARED_ASSET, JSON.stringify(asset));
      return true;
    }
    return false;
  }

  get(key: string) {
    if (this.storage) {
      return this.storage.getItem(key);
    }
    return null;
  }

  set(key: string, value: string): boolean {
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  remove(): boolean {
    if (this.storage) {
      this.storage.removeItem(DataService.SHARED_ASSET);
      return true;
    }
    return false;
  }

  clear(): boolean {
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }

}
