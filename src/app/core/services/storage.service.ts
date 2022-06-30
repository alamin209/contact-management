import { Injectable } from '@angular/core';

const storage = 'localStorage'; // sessionStorage

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  saveData = (key: string, data: any, json: boolean = false): void => {
    this.removeData(key);
    window[storage].setItem(key, json ? JSON.stringify(data) : data);
  };

  getData = (key: string): any => window[storage].getItem(key);

  removeData = (key: string): any => {
    window[storage].removeItem(key);
  };

  clear = () => {
    window[storage].clear();
  };
}
