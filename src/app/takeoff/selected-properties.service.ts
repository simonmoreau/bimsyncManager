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
  // private SelectedProperties: Property[] = new Array<Property>();
  // SelectedPropertiesChange: BehaviorSubject<Property[]>;
  updateSelectedProperties: boolean = true;

  // get selectedProperties(): Property[] { return this.SelectedPropertiesChange.value; }

  constructor() {
    this.ValueProperties = new IPropertiesList();
    this.FilterProperties = new IPropertiesList();
    // this.SelectedPropertiesChange = new BehaviorSubject<Property[]>([]);

    // this.ValueProperties.propertiesListChange.subscribe(valueProperties => {
    //   console.log('ValueProperties changed');
    //   if (this.updateSelectedProperties) {
    //     this.UpdateSelectedProperties();
    //   }
    // });
    this.FilterProperties.propertiesListChange.subscribe(filterProperties => {
      // console.log('FilterProperties changed');
      // if (this.updateSelectedProperties) {
      //   this.UpdateSelectedProperties();
      // }
    });
    // this.SelectedPropertiesChange.subscribe(selectedProperties => {
    //   console.log('SelectedPropertiesChange changed');
    //   console.log(selectedProperties);
    //   this.UpdateValueList();
    // });
  }

  // /** Sync the SelectedProperties with the content of the Value and Filtered list */
  // private UpdateSelectedProperties(): void {

  //   // Empty the SelectedProperties
  //   this.SelectedProperties = new Array<Property>();

  //   // this.UpdateCommonList(this.FilterProperties.data);
  //   this.UpdateCommonList(this.ValueProperties.data);

  //   // Publish the list of currently selected properties
  //   this.SelectedPropertiesChange.next(this.SelectedProperties);
  // }

  // private UpdateCommonList(sourceList: Property[]) {
  //   sourceList.forEach(property => {
  //     const index = this.SelectedProperties.indexOf(property, 0);
  //     if (index === -1) {
  //       this.SelectedProperties.push(property);
  //     }
  //   });
  // }

  // /** Sync the Value list with the content of the SelectedProperties */
  // private UpdateValueList() {
  //   // Pause the update
  //   this.updateSelectedProperties = false;

  //   // List the properties that must be present in the ValueList
  //   this.ValueProperties.ClearList();
  //   this.selectedProperties.forEach((property: Property) => {
  //     // const indexInFilteredList = this.FilterProperties.data.indexOf(property, 0);
  //     const indexInValueList = this.ValueProperties.data.indexOf(property, 0);
  //     // If the property is not in the Value list, add it
  //     if (indexInValueList === -1) {
  //       this.ValueProperties.insertItem(property);
  //     }
  //   });

  //   // Restart the update when the Values have been updated
  //   this.updateSelectedProperties = true;
  // }

  // /** Add an item to the list of selected properties */
  // insertItem(property: Property) {
  //   const index = this.SelectedProperties.indexOf(property, 0);
  //   if (index === -1) {
  //     this.SelectedProperties.push(property);
  //   }
  //   this.SelectedPropertiesChange.next(this.SelectedProperties);
  // }

  // removeItem(property: Property) {

  //   const index = this.SelectedProperties.indexOf(property, 0);
  //   if (index > -1) {
  //     this.SelectedProperties.splice(index, 1);
  //   }
  //   this.SelectedPropertiesChange.next(this.SelectedProperties);
  // }

  // removeItemAtIndex(index: number) {
  //   if (index > -1 && index < this.SelectedProperties.length) {
  //     this.SelectedProperties.splice(index, 1);
  //   }
  //   this.SelectedPropertiesChange.next(this.SelectedProperties);
  // }
}

