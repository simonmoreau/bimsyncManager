import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/bimsync.model';
import { PropertyPanelService } from './property-panel.service';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.scss']
})
export class PropertyPanelComponent implements OnInit {

  products: Product[];

  constructor(private propertyPanelService: PropertyPanelService) {

    propertyPanelService.productsList.subscribe(data => {
      this.products = data;
      console.log(this.products);
    });
  }

  ngOnInit() {
  }

}
