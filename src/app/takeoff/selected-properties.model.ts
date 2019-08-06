import { BehaviorSubject } from 'rxjs';
import { PropertyTreeComponent } from './property-tree/property-tree.component';
import { EventEmitter } from '@angular/core';

export class Property {

    constructor(givenName: string) {
        this.name = givenName;
    }
    name: string;
}

export class IPropertiesList {

    private propertiesList: Property[];
    propertiesListChange: BehaviorSubject<Property[]>;

    get data(): Property[] { return this.propertiesListChange.value; }

    constructor() {
        this.propertiesList = new Array<Property>();
        this.propertiesListChange = new BehaviorSubject<Property[]>([]);
    }

    /** Add an item to the list of selected properties */
    insertItem(property: Property, notify?: boolean) {
        const index = this.propertiesList.indexOf(property, 0);
        if (index === -1) {
            this.propertiesList.push(property);
        }
        if (notify == null || notify === true) {
            this.propertiesListChange.next(this.propertiesList);
        }
        console.log('a local list changed');
    }

    ClearList(notify?: boolean) {
        this.propertiesList = new Array<Property>();
        if (notify == null || notify === true) {
            this.propertiesListChange.next(this.propertiesList);
        }
    }

    removeItem(property: Property, notify?: boolean) {

        const index = this.propertiesList.indexOf(property, 0);
        if (index > -1) {
            this.propertiesList.splice(index, 1);
        }
        if (notify == null || notify === true) {
            this.propertiesListChange.next(this.propertiesList);
        }
    }

    removeItemAtIndex(index: number) {
        if (index > -1 && index < this.propertiesList.length) {
            this.propertiesList.splice(index, 1);
        }
        this.propertiesListChange.next(this.propertiesList);
    }

    changePropertyRank(previousIndex: number, newIndex: number) {
        const property: Property = this.propertiesList[previousIndex];
        this.propertiesList.splice(previousIndex, 1);
        this.propertiesList.splice(newIndex, 0, property);
        this.propertiesListChange.next(this.propertiesList);
    }
}
