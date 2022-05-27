import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { ReadCategoryModel } from '../models/category/read-category';
const url: string = environment.url_back;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private readonly _httpClient: HttpClient) {}

  getAll(): Observable<ReadCategoryModel[]> {
    return this._httpClient.get<ReadCategoryModel[]>(`${url}/category`);
  }
}
