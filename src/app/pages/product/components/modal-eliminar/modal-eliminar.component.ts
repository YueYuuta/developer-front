import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationsService } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-modal-eliminar',
  templateUrl: './modal-eliminar.component.html',
  styleUrls: ['./modal-eliminar.component.scss'],
})
export class ModalEliminarComponent implements OnInit {
  button = false;
  ProductID!: number;

  constructor(
    public modalRef: BsModalRef,
    private readonly _productService: ProductService,
    private modalService: BsModalService,
    private readonly _notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {}
  eliminar() {
    this.button = true;

    this._productService
      .delete(this.ProductID)

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
          // this.notifierService.notify('success', 'You are awesome! I mean it!');
          this.modalService.setDismissReason(data.data);
          this.modalRef.hide();
        },
        (err: any) => {
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
          console.log(err);
          this.button = false;
          this.modalRef.hide();
        }
      );
  }
}
