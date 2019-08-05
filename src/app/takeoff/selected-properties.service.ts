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
  private SelectedProperties: Property[] = new Array();
  SelectedPropertiesChange: BehaviorSubject<Property[]>;

  get selectedProperties(): Property[] { return this.SelectedPropertiesChange.value; }

  constructor() {
    this.ValueProperties = new IPropertiesList();
    this.FilterProperties = new IPropertiesList();
    this.SelectedPropertiesChange = new BehaviorSubject<Property[]>([]);

    this.ValueProperties.propertiesListChange.subscribe(valueProperties => {
      console.log('ValueProperties changed');
      this.UpdateSelectedProperties(valueProperties);
    });
    this.FilterProperties.propertiesListChange.subscribe(filterProperties => {
      console.log('FilterProperties changed');
      this.UpdateSelectedProperties(filterProperties);
    });
    this.SelectedPropertiesChange.subscribe(selectedProperties => {
      console.log('SelectedPropertiesChange changed');
    });
  }

  private UpdateSelectedProperties(list: Property[]): void {

    // Add new properties to the common list
    list.forEach(property => {
      const index = this.SelectedProperties.indexOf(property, 0);
      if (index === -1) {
        this.SelectedProperties.push(property);
      }
    });

    // Remove properties from the common list
    this.SelectedProperties.forEach(property => {
      const index = list.indexOf(property, 0);
      if (index === -1) {
        const index2 = this.SelectedProperties.indexOf(property, 0);
        if (index2 > -1) {
          this.SelectedProperties.splice(index, 1);
        }
      }
    });

    // Publish the list of currently selected properties
    this.SelectedPropertiesChange.next(this.SelectedProperties);
  }

  /** Add an item to the list of selected properties */
  insertItem(property: Property) {
    const index = this.SelectedProperties.indexOf(property, 0);
    if (index === -1) {
      this.SelectedProperties.push(property);
    }
    this.SelectedPropertiesChange.next(this.SelectedProperties);
  }

  removeItem(property: Property) {

    const index = this.SelectedProperties.indexOf(property, 0);
    if (index > -1) {
      this.SelectedProperties.splice(index, 1);
    }
    this.SelectedPropertiesChange.next(this.SelectedProperties);
  }

  removeItemAtIndex(index: number) {
    if (index > -1 && index < this.SelectedProperties.length) {
      this.SelectedProperties.splice(index, 1);
    }
    this.SelectedPropertiesChange.next(this.SelectedProperties);
  }
}

