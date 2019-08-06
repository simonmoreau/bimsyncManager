import { Component, OnInit, Input } from '@angular/core';
import { Product, IProject } from 'src/app/shared/models/bimsync.model';
import { PropertyPanelService } from './property-panel.service';
import { IPanelData } from './property-panel.model';
import { BimsyncService } from '../bimsync.service';
import { RetreivedElementsService } from 'src/app/shared/services/retreived-elements.service';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.scss']
})
export class PropertyPanelComponent implements OnInit {

  data: IPanelData;
  loading: boolean;

  constructor(
    private propertyPanelService: PropertyPanelService,
    private bimsyncService: BimsyncService,
    private headerService: RetreivedElementsService) {

    propertyPanelService.productsIdList.subscribe(productsIds => {
      this.loading = true;
      const project = this.headerService.project.value as IProject;
      if (productsIds.length === 1 && project != null) {
        const projectId: string = project.id;
        this.bimsyncService.queryProductsById(projectId, productsIds).subscribe(products => {
          this.data = new IPanelData(products);
          this.loading = false;
        });
      } else {
        this.data = null;
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    this.data = null;
    this.loading = false;
  }

}
