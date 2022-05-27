import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
const url: string = environment.url_back;
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly _httpClient: HttpClient) {}
  getAll(desde: number, hasta: number): Observable<any> {
    return this._httpClient.get<any>(`${url}/product/${desde}/${hasta}`);
  }
}
