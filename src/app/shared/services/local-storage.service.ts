import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { DailyRecord } from 'src/app/pages/home/home.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {
    localforage.config({
      name: 'runner',
    });
  }

  setItem<T>(key: keyof LocalStorageItems, value: T): Promise<T> {
    return localforage.setItem(key, value);
  }

  getItem<T>(key: keyof LocalStorageItems): Promise<T> {
    return localforage.getItem(key);
  }

  removeItem(key: keyof LocalStorageItems): Promise<void> {
    return localforage.removeItem(key);
  }

  clear(): Promise<void> {
    return localforage.clear();
  }
}

export interface LocalStorageItems {
  records: DailyRecord[];
}
