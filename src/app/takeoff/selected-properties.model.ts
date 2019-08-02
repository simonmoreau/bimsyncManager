import { BehaviorSubject } from 'rxjs';

export class Property {

    constructor(givenName: string) {
        this.name = givenName;
    }
    name: string;
}

export class IPropertiesListService {

    private propertiesList: Property[];
    propertiesListChange: BehaviorSubject<Property[]>;

    get data(): Property[] { return this.propertiesListChange.value; }

    constructor() {
        this.propertiesList = new Array();
    }

    /** Add an item to the list of selected properties */
    insertItem(property: Property) {
        const index = this.propertiesList.indexOf(property, 0);
        if (index === -1) {
            this.propertiesList.push(property);
        }
        this.propertiesListChange.next(this.propertiesList);
    }

    ClearList() {
        this.propertiesList = new Array();
        this.propertiesListChange.next(this.propertiesList);
    }

    removeItem(property: Property) {

        const index = this.propertiesList.indexOf(property, 0);
        if (index > -1) {
            this.propertiesList.splice(index, 1);
        }
        this.propertiesListChange.next(this.propertiesList);
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
