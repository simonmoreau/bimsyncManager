import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Property, IPropertiesList } from './selected-properties.model';
import { inherits } from 'util';
import { PropertyTreeComponent } from './property-tree/property-tree.component';

@Injectable({
  providedIn: 'root'
})
export class SelectedPropertiesService  {

  selectedProperties: IPropertiesList;
  filteredProperties: IPropertiesList;

  constructor() {
    this.selectedProperties = new IPropertiesList();
    this.filteredProperties = new IPropertiesList();
  }
}
