import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IProduct } from '../takeoff/takeoff.model';
import { TakeoffService } from '../takeoff/takeoff.services';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.scss'],
  providers: [TakeoffService]
})
export class PropertyPanelComponent implements OnInit, OnChanges {

  @Input() productId: number;
  @Input() projectId: string;
  selectedProduct: IProduct;

  constructor(private _takeoffService: TakeoffService) { }

  ngOnInit() {

  }

ngOnChanges() {
  if (this.productId !== null) {
    this._takeoffService
    .getProduct(this.projectId, this.productId)
    .subscribe(product => {
      this.selectedProduct = product;
      console.log(product);
    });
  }

}

}
