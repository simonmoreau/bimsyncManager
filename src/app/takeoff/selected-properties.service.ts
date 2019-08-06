import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Property, IPropertiesList } from './selected-properties.model';
import { inherits } from 'util';
import { PropertyTreeComponent } from './property-tree/property-tree.component';

@Injectable({
  providedIn: 'root'
})
export class SelectedPropertiesService {

  ValueProperties: IPropertiesList;
  FilterProperties: IPropertiesList;

  constructor() {
    this.ValueProperties = new IPropertiesList();
    this.FilterProperties = new IPropertiesList();
  }
}

