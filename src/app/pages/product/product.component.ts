import {
  Component,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { ReadCategoryModel } from 'src/app/models/category/read-category';
import { CreateProductModel } from 'src/app/models/product/create-product';
import { ReadProductModel } from 'src/app/models/product/read-product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { ModalDinamicComponent } from './components/modal-dinamic/modal-dinamic.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class ProductComponent implements OnInit {
  categories: ReadCategoryModel[] = [];
  limite = 15;
  products: ReadProductModel[] = [];
  desde: number = 0;
  hasta: number = 5;
  totalItems: number = 1000;

  currentPage = 1;

  constructor(
    private readonly _productService: ProductService,
    private readonly modalService: BsModalService,
    private readonly _categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // this.initAllProductAndCategory();
    // this.getCategories();
    this.getAll();
  }

  openModal(title: string, readProductModel?: ReadProductModel): void {
    const create_edit = this.modalService.show(ModalDinamicComponent, {
      initialState: { title, readProductModel },
      backdrop: 'static',
    });
    create_edit.onHidden?.subscribe((data) =>
      console.log('esta es la data', data)
    );
  }
  getAll(): void {
    this._productService
      .getAll(this.desde, this.hasta)
      .subscribe((products: any) => {
        console.log('esto es lo que devuelve el back', products[1]);
        this.products = products[0];
        this.totalItems = products[1];
      });
  }

  escucharEvento(numero: number) {
    console.log(numero, 'este es el numero del evento del paginado');
    this.pageChanged(numero);
  }

  pageChanged(page: any): void {
    console.log(page, 'este es el page');
    const item = page.page - 1;
    this.desde = this.hasta * item;
    console.log(item, 'este es el item');
    console.log(this.desde, 'este es el nuevo desde');
    this.obtenerPaginado(this.desde, this.hasta);
  }
  obtenerPaginado(
    desde: number,
    hasta: number,
    termino?: string,
    numero?: number
  ): void {
    this.desde = desde;
    this.hasta = hasta;
    this.getAll();
  }

  /*
  OPCION 2 DEPENDE DE LA COMPLEJIDAD DEL NEGOCIO Y CARGA DE DATOS, MEJORA DE PREFORMACE 
  */

  getCategories() {
    setTimeout(() => {
      this._categoryService.getAll().subscribe((categories) => {
        this.categories = categories;
      });
    }, 6000);
  }

  initAllProductAndCategory() {
    forkJoin([
      this._categoryService.getAll(),
      this._productService.getAll(this.desde, this.hasta),
    ]).subscribe((data) =>
      console.log('esta es la informacion de las dos observables', data)
    );
  }
}
