import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReadCategoryModel } from 'src/app/models/category/read-category';
import { CreateProductModel } from 'src/app/models/product/create-product';
import { ReadProductModel } from 'src/app/models/product/read-product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
// export enum tipoCampoEnum {
//   PrecioVenta = 'PrecioVenta',
//   PrecioCompra = 'PrecioCompra',
// }

@Component({
  selector: 'app-modal-dinamic',
  templateUrl: './modal-dinamic.component.html',
  styleUrls: ['./modal-dinamic.component.scss'],
})
export class ModalDinamicComponent implements OnInit {
  title!: string;
  readProductModel!: ReadProductModel;
  productForm!: FormGroup;
  categories: ReadCategoryModel[] = [];
  // tipoEnum = tipoCampoEnum;

  constructor(
    private modalService: BsModalService,
    private readonly fb: FormBuilder,
    public modalRef: BsModalRef,
    private readonly _categoryService: CategoryService,
    private readonly _productService: ProductService,
    private readonly _notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.formDinamic();
    this.getCategories();
  }
  private formDinamic() {
    if (this.readProductModel) {
      this.initUpdateForm();
    } else {
      this.initCreateForm();
    }
  }
  saveDinamic() {
    if (this.readProductModel) {
      this.update();
    } else {
      this.create();
    }
  }
  private iva(iva: string): boolean {
    let salida = true;
    if (iva === 'N') {
      salida = false;
    }
    return salida;
  }

  private initCreateForm() {
    this.productForm = this.fb.group({
      Descripcion: [null, [Validators.required, Validators.minLength(4)]],
      PrecioVenta: [null, [Validators.required]],
      Category: ['', [Validators.required]],
      Codigo: [null, [Validators.required]],
      PrecioCompra: [null, [Validators.required]],
      IvaProducto: [true],
      PrecioSinIva: [{ value: null, disabled: true }],
      Ganancia: [{ value: null, disabled: true }],
    });
  }

  private initUpdateForm() {
    this.productForm = this.fb.group({
      Descripcion: [
        this.readProductModel.Descripcion,
        [Validators.required, Validators.minLength(4)],
      ],
      PrecioVenta: [this.readProductModel.PrecioVenta, [Validators.required]],
      Category: [
        this.readProductModel.Category.CategoryID,
        [Validators.required],
      ],
      Codigo: [this.readProductModel.Codigo, [Validators.required]],
      PrecioCompra: [this.readProductModel.PrecioCompra, [Validators.required]],
      IvaProducto: [this.iva(this.readProductModel.IvaProducto)],
      PrecioSinIva: [
        { value: this.readProductModel.PrecioSinIva, disabled: true },
      ],
      Ganancia: [
        {
          value: this.porcentajeGanancia(
            this.readProductModel.PrecioCompra,
            this.readProductModel.PrecioVenta
          ),
          disabled: true,
        },
      ],
    });
  }
  private ganacia(precioCompra: number, precioVenta: number): number {
    return Number((precioVenta - precioCompra).toFixed(2));
  }
  private porcentajeGanancia(
    precioCompra: number,
    precioVenta: number
  ): number {
    const ganancia = this.ganacia(precioCompra, precioVenta);
    const porcentajeGanancia = (ganancia / precioCompra) * 100;
    return Number(porcentajeGanancia.toFixed(2));
  }
  private create() {
    if (this.productForm.valid) {
      let iva = 'N';
      const productSave: CreateProductModel = this.productForm.value;
      productSave.Category = Number(productSave.Category);
      const productForm = this.productForm.value;

      if (productForm.IvaProducto) {
        iva = 'S';
      }
      const prodctSave: CreateProductModel = {
        Category: productForm.Category,
        Codigo: productForm.Codigo,
        Descripcion: productForm.Descripcion,
        IvaProducto: iva,
        PrecioCompra: productForm.PrecioCompra,
        PrecioVenta: productForm.PrecioVenta,
      };

      console.log('respuesta de crear data', prodctSave);
      this._productService.create(prodctSave).subscribe(
        (data) => {
          const toast = this._notificationsService.success(
            'Correcto!',
            data.message,
            {
              timeOut: 5000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true,
            }
          );
          console.log('respuesta de crear data', data);
          this.productForm.reset();
          this.modalService.setDismissReason(data);
          this.modalRef.hide();
        },
        (err) => {
          console.log('respuesta de crear error', err);
          const toast = this._notificationsService.error(
            'Error!',
            err.error.message,
            {
              timeOut: 5000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true,
            }
          );
        }
      );
    }
  }

  private update() {
    if (this.productForm.valid) {
      let iva = 'N';
      const productSave: CreateProductModel = this.productForm.value;
      productSave.Category = Number(productSave.Category);
      const productForm = this.productForm.value;

      if (productForm.IvaProducto) {
        iva = 'S';
      }
      const prodctSave: CreateProductModel = {
        Category: productForm.Category,
        Codigo: productForm.Codigo,
        Descripcion: productForm.Descripcion,
        IvaProducto: iva,
        PrecioCompra: productForm.PrecioCompra,
        PrecioVenta: productForm.PrecioVenta,
      };

      this._productService
        .update(this.readProductModel.ProductID, prodctSave)
        .subscribe(
          (data) => {
            const toast = this._notificationsService.success(
              'Correcto!',
              data.message,
              {
                timeOut: 5000,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true,
              }
            );
            console.log('respuesta de crear data', data);
            this.productForm.reset();
            this.modalService.setDismissReason(data);
            this.modalRef.hide();
          },
          (err) => {
            console.log('respuesta de crear error', err);
            const toast = this._notificationsService.error(
              'Error!',
              err.error.message,
              {
                timeOut: 5000,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true,
              }
            );
          }
        );
    }
  }

  calculateGananciaPrecioSinIva() {
    let precioSinIva = this.oPrecioVenta?.value;
    if (this.oIvaProducto?.value === true) {
      precioSinIva = this.oPrecioVenta?.value / 1.12;
    }
    this.oPrecioSinIva?.setValue(precioSinIva.toFixed(2));

    const porcentajeGanancia = this.porcentajeGanancia(
      this.oPrecioCompra?.value,
      this.oPrecioVenta?.value
    );
    this.oGanancia?.setValue(porcentajeGanancia);
  }
  private validateMayor(): boolean {
    const precioCompra: number = this.oPrecioVenta?.value;
    const precioVenta: number = this.oPrecioVenta?.value;
    return precioVenta > precioCompra;
  }

  private validateNull(): boolean {
    const precioCompra: number = this.oPrecioVenta?.value;
    const precioVenta: number = this.oPrecioVenta?.value;
    return !precioVenta || !precioCompra;
  }

  getCategories() {
    this._categoryService.getAll().subscribe((categories) => {
      console.log(categories, 'estas son las categorias de producto');
      this.categories = categories;
    });
  }
  get oPrecioCompra(): AbstractControl | null {
    return this.productForm.get('PrecioCompra');
  }
  get oGanancia(): AbstractControl | null {
    return this.productForm.get('Ganancia');
  }

  get oPrecioVenta(): AbstractControl | null {
    return this.productForm.get('PrecioVenta');
  }

  get oIvaProducto(): AbstractControl | null {
    return this.productForm.get('IvaProducto');
  }

  get oPrecioSinIva(): AbstractControl | null {
    return this.productForm.get('PrecioSinIva');
  }

  esInvalido(input: AbstractControl): boolean {
    return (input.touched || input.dirty) && input.invalid;
  }
  esValido(input: AbstractControl): boolean {
    return (input.touched || input.dirty) && input.valid;
  }
  esRequerido(input: AbstractControl): boolean | void {
    if (input.touched || input.dirty) {
      return input.hasError('required');
    }
  }
}
