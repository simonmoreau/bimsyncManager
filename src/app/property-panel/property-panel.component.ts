import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IDisplayPropertySet, Products } from "../takeoff/takeoff.model";
import { BimsyncProjectService } from '../bimsync-project/bimsync-project.services';
import { IProduct } from '../bimsync-project/bimsync-project.models';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.scss'],
  providers: [BimsyncProjectService]
})
export class PropertyPanelComponent implements OnInit, OnChanges {

  @Input() productId: number;
  @Input() projectId: string;
  selectedProduct: IProduct;
  displayedPropertySets: IDisplayPropertySet[]

  constructor(private _bimsyncService: BimsyncProjectService) { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.productId !== null) {
      this._bimsyncService
        .getProduct(this.projectId, this.productId)
        .subscribe(product => {
          this.selectedProduct = product;

          this.displayedPropertySets = Products.GetProductProperties(product);
          console.log(this.displayedPropertySets);
        });
    }
  }

}
