import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Property } from './selected-properties.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedPropertiesService {

  propertiesListChange = new BehaviorSubject<Property[]>([]);
  private propertiesList: Property[];

  get data(): Property[] { return this.propertiesListChange.value; }

  constructor() {
    this.propertiesList = new Array();
  }

  /** Add an item to the list of selected properties */
  insertItem(property: Property) {
    // if (parent.children) {
    //   parent.children.push({ name: Name } as Property);
    //   this.dataChange.next(this.data);
    // }
    this.propertiesList.push(property);
    this.propertiesListChange.next(this.propertiesList);
  }

  removeItem(property: Property) {

    const index = this.propertiesList.indexOf(property, 0);
    if (index > -1) {
      this.propertiesList.splice(index, 1);
    }
    this.propertiesListChange.next(this.propertiesList);
  }

  updateItem(property: Property, Name: string) {
    property.name = Name;
    this.propertiesListChange.next(this.propertiesList);
  }
}
