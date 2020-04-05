import { BehaviorSubject, from } from 'rxjs';
import { PropertyTreeComponent } from './property-tree/property-tree.component';
import { EventEmitter } from '@angular/core';
import { Property, Quantity, Value } from '../shared/models/bimsync.model';
import { StringifyOptions } from 'querystring';



export class DisplayedQuantityProperty {

    constructor() {
        this.id = this.GenerateId();
    }

    id: string;
    name: string;
    path: string;
    unit: string;
    type: string;

    private GenerateId() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
      };

    public GetDisplayedName()
    {
        let displayedName = this.name;
        if (this.unit != null) displayedName = displayedName + ' (' + this.unit + ')';
        return displayedName;
    }

    public LoadProperty(bimsyncProperty: Property, propertySetKey : string, propertyKey : string) {
        this.name = propertyKey;
        if (bimsyncProperty.nominalValue != null)
        {
            this.path = 'propertySets.' + propertySetKey + '.properties.' + propertyKey + '.nominalValue.value';
            this.unit = bimsyncProperty.nominalValue.unit;
            this.type = bimsyncProperty.nominalValue.type;
        }

        if (bimsyncProperty.propertyReference != null)
        {
            this.path = 'propertySets.' + propertySetKey + '.properties.' + propertyKey + '.propertyReference.value';
            this.unit = bimsyncProperty.propertyReference.unit;
            this.type = bimsyncProperty.propertyReference.type;
        }
    }

    public LoadQuantity(bimsyncQuantity: Quantity, quantitySetKey : string, quantityKey : string) {
        this.name = quantityKey;
        this.path = 'quantitySets.' + quantitySetKey + '.quantities.' + quantityKey + '.value.value';
        this.unit = bimsyncQuantity.value.unit;
        this.type = bimsyncQuantity.value.type;
    }

    public LoadAttribute(name : string, path : string) {
        this.name = name;
        this.path = path;
        this.unit = null;
        this.type = 'string';
    }
}

export class IPropertiesList {

    private propertiesList: DisplayedQuantityProperty[];
    propertiesListChange: BehaviorSubject<DisplayedQuantityProperty[]>;

    get data(): DisplayedQuantityProperty[] { return this.propertiesListChange.value; }

    constructor() {
        this.propertiesList = new Array<DisplayedQuantityProperty>();
        this.propertiesListChange = new BehaviorSubject<DisplayedQuantityProperty[]>([]);
    }

    /** Add an item to the list of selected properties */
    insertItem(property: DisplayedQuantityProperty, notify?: boolean) {
        const index = this.propertiesList.indexOf(property, 0);
        if (index === -1) {
            this.propertiesList.push(property);
        }
        if (notify == null || notify === true) {
            this.propertiesListChange.next(this.propertiesList);
        }
    }

    ClearList(notify?: boolean) {
        this.propertiesList = new Array<DisplayedQuantityProperty>();
        if (notify == null || notify === true) {
            this.propertiesListChange.next(this.propertiesList);
        }
    }

    removeItem(property: DisplayedQuantityProperty, notify?: boolean) {

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
        const property: DisplayedQuantityProperty = this.propertiesList[previousIndex];
        this.propertiesList.splice(previousIndex, 1);
        this.propertiesList.splice(newIndex, 0, property);
        this.propertiesListChange.next(this.propertiesList);
    }
}
