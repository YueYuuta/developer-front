export interface CreateProductModel {
  Category: number;
  Codigo: string;
  Descripcion: string;
  PrecioCompra: number;
  PrecioVenta: number;
  IvaProducto: string;
  PrecioSinIva?: number;
  Imagen?: string;
}
