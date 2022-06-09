import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ReadCategoryModel } from 'src/app/models/category/read-category';

import { ReadProductModel } from 'src/app/models/product/read-product';

import { ProductService } from 'src/app/services/product.service';
import { ModalDinamicComponent } from './components/modal-dinamic/modal-dinamic.component';
import { ModalEliminarComponent } from './components/modal-eliminar/modal-eliminar.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class ProductComponent implements OnInit {
  categories: ReadCategoryModel[] = [];
  products: ReadProductModel[] = [];
  desde: number = 0;
  hasta: number = 5;
  totalItems: number = 1000;
  currentPage = 1;
  termino: string = '';

  constructor(
    private readonly _productService: ProductService,
    private readonly modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  openModal(title: string, readProductModel?: ReadProductModel): void {
    const create_edit = this.modalService.show(ModalDinamicComponent, {
      initialState: { title, readProductModel },
      backdrop: 'static',
    });
    create_edit.onHidden?.subscribe((data: any) => {
      if (!data.id) {
        this.getAll();
      }
    });
  }
  delete(ProductID: number): void {
    const eliminar = this.modalService.show(ModalEliminarComponent, {
      initialState: { ProductID },
      backdrop: 'static',
    });
    eliminar.onHidden?.subscribe((data: any) => {
      console.log(data);
      if (!data.id) {
        this.getAll();
      }
    });
  }
  getAll(): void {
    this._productService
      .getAll(this.desde, this.hasta, this.termino)
      .subscribe((products: any) => {
        this.products = products[0];
        this.totalItems = products[1];
      });
  }

  escucharEvento(numero: number) {
    this.pageChanged(numero);
  }

  pageChanged(page: any): void {
    const item = page.page - 1;
    this.desde = this.hasta * item;
    this.obtenerPaginado(this.desde, this.hasta);
  }
  obtenerPaginado(desde: number, hasta: number): void {
    this.desde = desde;
    this.hasta = hasta;
    this.getAll();
  }

  onSearchKeyUp(termino: string): void {
    this.currentPage = 1;

    this.desde = 0;
    this.termino = termino;
    this.getAll();
  }
}
