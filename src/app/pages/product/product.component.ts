import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  products: any = [];
  constructor(private readonly _productService: ProductService) {}

  ngOnInit(): void {
    this.getAll();
  }
  getAll(): void {
    this._productService.getAll().subscribe((products: any) => {
      console.log('esto es lo que devuelve el back', products);
      this.products = products;
    });
  }
}
