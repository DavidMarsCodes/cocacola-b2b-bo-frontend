import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  get(key): object {
    return !!localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
  }
  set(key: string, value: object): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
  clean(): void {
    localStorage.clear();
  }
}
