import { ReadCategoryModel } from '../category/read-category';

export interface ReadProductModel {
  readonly ProductID: number;
  readonly Category: ReadCategoryModel;
  readonly Codigo: string;
  readonly Descripcion: string;
  readonly Imagen: string;
  readonly PrecioCompra: number;
  readonly PrecioSinIva: number;
  readonly PrecioVenta: number;
  readonly Ventas: number;
  readonly IvaProducto: string;
  readonly Fecha: Date;
}
