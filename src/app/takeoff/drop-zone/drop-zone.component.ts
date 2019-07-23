import { Component, OnInit } from '@angular/core';
import { SelectedPropertiesService } from '../selected-properties.service';
import { Property } from '../selected-properties.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent implements OnInit {

  propertiesList: Property[];

  constructor( propertiesService: SelectedPropertiesService) {

    propertiesService.propertiesListChange.subscribe(data => {
      this.propertiesList = data;
    });
  }

  ngOnInit() {

  }

  public drop(event: CdkDragDrop<Property[]>) {
    console.log(event);
  }

}
