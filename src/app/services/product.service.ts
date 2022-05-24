import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
const url: string = environment.url_back;
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly _httpClient: HttpClient) {}
  getAll() {
    return this._httpClient.get(`${url}/product`);
  }
}
