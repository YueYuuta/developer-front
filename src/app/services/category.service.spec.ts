// import { HttpClientModule } from '@angular/common/http';
// import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { ReadCategoryModel } from '../models/category/read-category';
import { CategoryService } from './category.service';

// import { CategoryService } from './category.service';

// describe('CategoryService', () => {
//   let service: CategoryService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({ imports: [HttpClientModule] });
//     service = TestBed.inject(CategoryService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });
describe('Probar servicio llamado CategoryService', () => {
  let service: CategoryService;
  let httpTesting: HttpTestingController; // HttpTestingController(sirve solo para hacer test) es el equivalente a HttpCLient

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], //HttpClientTestingModule(sirve solo para hacer test) es el equivalente a HttpClientModule
      providers: [CategoryService],
    }); // simular un modulo
    service = TestBed.inject(CategoryService); // TestBed.inject sirve para hacer instancias
    httpTesting = TestBed.inject(HttpTestingController); // TestBed.inject sirve para hacer instancias
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // verifica si la instancia fue creada exitosamente
  });

  it('Debe hacer una peticion GET cuando se llama a la funcion getAll', (done) => {
    const fecha = new Date();
    const dataMock: ReadCategoryModel[] = [
      { Categoria: 'embutidos', CategoryID: 1, Fecha: fecha.toString() },
      { Categoria: 'bebidas', CategoryID: 2, Fecha: fecha.toString() },
    ];
    const apiUrl = environment.url_back;

    service.getAll().subscribe((data) => {
      expect(data).toEqual(dataMock); // verifica si la data tiene la misma estructura de datos deseada
      done();
    });
    const req = httpTesting.expectOne(`${apiUrl}/category`); // simula llamada a la apo -- solo simula
    expect(req.request.method).toEqual('GET'); //verifica que el llamado a la api sea por el metodo get -- saldra error si es por post put delete o patch
    req.flush(dataMock); //envia los datos para simular la respuesta de la api
    httpTesting.verify(); // verifica que todos los pasos se crearon conrrectamente - no es necesario pero se lo pone por buenas practicas de programación
  });
});
