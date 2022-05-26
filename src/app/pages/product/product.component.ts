import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productForm!: FormGroup;
  modalRef?: BsModalRef;
  products: any = [];
  desde: number = 0;
  hasta: number = 5;
  totalItems: number = 0;

  constructor(
    private readonly _productService: ProductService,
    private modalService: BsModalService,
    private readonly fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      descripcion: [null],
      pvp: [null],
    });
  }

  ngOnInit(): void {
    this.getAll();
    console.log('hola');
  }

  openModal(template: TemplateRef<any>, product: any) {
    this.productForm.get('descripcion')?.setValue(product.Descripcion);
    this.productForm.get('pvp')?.setValue(product.PrecioVenta);
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
  save() {}
}
