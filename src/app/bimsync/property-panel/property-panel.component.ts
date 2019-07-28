import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/bimsync.model';
import { PropertyPanelService } from './property-panel.service';
import { IPanelData } from './property-panel.model';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.scss']
})
export class PropertyPanelComponent implements OnInit {

  data: IPanelData;

  constructor(private propertyPanelService: PropertyPanelService) {

    propertyPanelService.productsList.subscribe(products => {

      if (products) {
        this.data = new IPanelData(products);
        console.log(this.data);
      } else {
        this.data = null;
      }
    });
  }

  ngOnInit() {
  }

}
