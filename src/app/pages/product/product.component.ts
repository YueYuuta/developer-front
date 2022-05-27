import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReadCategoryModel } from 'src/app/models/category/read-category';
import { CreateProductModel } from 'src/app/models/product/create-product';
import { ReadProductModel } from 'src/app/models/product/read-product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productForm!: FormGroup;
  modalRef?: BsModalRef;
  products: ReadProductModel[] = [];
  desde: number = 0;
  hasta: number = 5;
  totalItems: number = 0;
  categories: ReadCategoryModel[] = [];

  constructor(
    private readonly _productService: ProductService,
    private modalService: BsModalService,
    private readonly fb: FormBuilder,
    private readonly _categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      Descripcion: [null, [Validators.required, Validators.minLength(4)]],
      PrecioVenta: [null, [Validators.required]],
      Category: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAll();
    this.getCategories();
  }
  getCategories() {
    this._categoryService.getAll().subscribe((categories) => {
      console.log(categories, 'estas son las categorias de producto');
      this.categories = categories;
    });
  }

  openModal(template: TemplateRef<any>, product: any) {
    this.productForm.get('Descripcion')?.setValue(product.Descripcion);
    this.productForm.get('PrecioVenta')?.setValue(product.PrecioVenta);
    this.productForm.get('Category')?.setValue(product.Category.CategoryID);
    this.modalRef = this.modalService.show(template);
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
    const item = page - 1;
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
  save() {
    if (this.productForm.valid) {
      const productSave: CreateProductModel = this.productForm.value;
      productSave.Category = Number(productSave.Category);
      console.log('producto editado', productSave);
    }
  }
}
