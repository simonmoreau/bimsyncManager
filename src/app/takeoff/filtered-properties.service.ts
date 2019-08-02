import { Injectable } from '@angular/core';
import { IPropertiesListService, Property } from './selected-properties.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilteredPropertiesService extends IPropertiesListService  {

  constructor() {
    super();
    this.propertiesListChange = new BehaviorSubject<Property[]>([]);
  }
}
