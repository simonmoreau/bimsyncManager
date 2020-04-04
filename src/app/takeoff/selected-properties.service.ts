import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Property, IPropertiesList } from './selected-properties.model';
import { inherits } from 'util';
import { PropertyTreeComponent } from './property-tree/property-tree.component';
import { Product } from '../shared/models/bimsync.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedPropertiesService {

  Products: Product[];
  ValueProperties: IPropertiesList;
  FilterProperties: IPropertiesList;

  constructor() {
    this.ValueProperties = new IPropertiesList();
    this.FilterProperties = new IPropertiesList();
  }
}

