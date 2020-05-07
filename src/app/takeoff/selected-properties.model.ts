import { BehaviorSubject, from } from 'rxjs';
import { PropertyTreeComponent } from './property-tree/property-tree.component';
import { EventEmitter } from '@angular/core';
import { Property, Quantity, Value } from '../shared/models/bimsync.model';
import { StringifyOptions } from 'querystring';
import { GroupingMode, GroupingModeEnum } from '../shared/models/quantities.model';



export class DisplayedQuantityProperty {

    DisplayedQuantityPropertyChange: BehaviorSubject<DisplayedQuantityProperty>;

    constructor() {
        this.id = this.GenerateId();
        this.DisplayedQuantityPropertyChange = new BehaviorSubject<DisplayedQuantityProperty>(this);
    }

    id: string;
    name: string;
    path: string;
    unit: string;
    type: string;
    availableGroupingModes: GroupingMode[];

    upDisabled: boolean;
    downDisabled: boolean;
    toTopDisabled: boolean;
    toBottomDisabled: boolean;

    private _groupingMode: GroupingMode;
    get groupingMode(): GroupingMode {
        return this._groupingMode;
    }
    set groupingMode(groupingMode: GroupingMode) {
        this._groupingMode = groupingMode;
        this.SetGroupingMode(groupingMode);
        this.DisplayedQuantityPropertyChange.next(this);
    }

    private SetGroupingMode(groupingMode: GroupingMode) {
        const index = this.availableGroupingModes.indexOf(groupingMode, 0);
        if (index > -1) {
            this.availableGroupingModes.forEach(gM => { gM.isEnabled = false; });
            this.availableGroupingModes[index].isEnabled = true;
        }
    }

    private GenerateId() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    public GetDisplayedName() {
        let displayedName = this.name;
        if (this.unit != null) displayedName = displayedName + ' (' + this.unit + ')';
        return displayedName;
    }

    public LoadProperty(bimsyncProperty: Property, propertySetKey: string, propertyKey: string) {
        this.name = propertyKey;
        if (bimsyncProperty.nominalValue != null) {
            this.path = 'propertySets.' + propertySetKey + '.properties.' + propertyKey + '.nominalValue.value';
            this.unit = bimsyncProperty.nominalValue.unit;
            this.type = bimsyncProperty.nominalValue.type;
        }

        if (bimsyncProperty.propertyReference != null) {
            this.path = 'propertySets.' + propertySetKey + '.properties.' + propertyKey + '.propertyReference.value';
            this.unit = bimsyncProperty.propertyReference.unit;
            this.type = bimsyncProperty.propertyReference.type;
        }

        this.availableGroupingModes = this.GetAvailableGroupingModes();
        this.groupingMode = this.availableGroupingModes[0];
    }

    public LoadQuantity(bimsyncQuantity: Quantity, quantitySetKey: string, quantityKey: string) {
        this.name = quantityKey;
        this.path = 'quantitySets.' + quantitySetKey + '.quantities.' + quantityKey + '.value.value';
        this.unit = bimsyncQuantity.value.unit;
        this.type = bimsyncQuantity.value.type;

        this.availableGroupingModes = this.GetAvailableGroupingModes();
        this.groupingMode = this.availableGroupingModes[0];
    }

    public LoadAttribute(name: string, path: string) {
        this.name = name;
        this.path = path;
        this.unit = null;
        this.type = 'string';

        this.availableGroupingModes = this.GetAvailableGroupingModes();
        this.groupingMode = this.availableGroupingModes[0];
    }

    private GetAvailableGroupingModes(): GroupingMode[] {
        let modes = [
            new GroupingMode(GroupingModeEnum.DontSummarize),
            new GroupingMode(GroupingModeEnum.Count),
            new GroupingMode(GroupingModeEnum.CountDistinct),
            new GroupingMode(GroupingModeEnum.First),
            new GroupingMode(GroupingModeEnum.Last),
        ]

        const numberModes = [
            new GroupingMode(GroupingModeEnum.DontSummarize),
            new GroupingMode(GroupingModeEnum.Sum),
            new GroupingMode(GroupingModeEnum.Average),
            new GroupingMode(GroupingModeEnum.Minimun),
            new GroupingMode(GroupingModeEnum.Maximun),
            new GroupingMode(GroupingModeEnum.CountDistinct),
            new GroupingMode(GroupingModeEnum.Count),
            new GroupingMode(GroupingModeEnum.StandardDeviation),
            new GroupingMode(GroupingModeEnum.Variance),
            new GroupingMode(GroupingModeEnum.Median)
        ]

        if (this.type === 'number' || this.type === 'integer') {
            modes = numberModes;
        }

        modes[0].isEnabled = true;
        return modes;
    }
}

export class IPropertiesList {

    private propertiesList: DisplayedQuantityProperty[];
    propertiesListChange: BehaviorSubject<DisplayedQuantityProperty[]>;

    get data(): DisplayedQuantityProperty[] { return this.propertiesListChange.value; }
    get lenght(): number { return this.propertiesList.length; }

    constructor() {
        this.propertiesList = new Array<DisplayedQuantityProperty>();
        this.propertiesListChange = new BehaviorSubject<DisplayedQuantityProperty[]>([]);
    }

    // Create observer object when one of the property of the list changes
    onPropertyChange = {
        next: (property => {
            this.propertiesListChange.next(this.propertiesList);
            console.log('something changed in ' + property.name);
        }),
        error: err => console.log(err),
        complete: () => console.log('Observer got a complete notification'),
    };

    /** Add an item to the list of selected properties */
    InsertItem(property: DisplayedQuantityProperty, notify?: boolean) {
        const index = this.propertiesList.indexOf(property, 0);
        if (index === -1) {
            this.propertiesList.push(property);
            this.UpdatePropertiesAvailableMovements();
            property.DisplayedQuantityPropertyChange.subscribe(this.onPropertyChange);
        }
        if (notify == null || notify === true) {
            this.propertiesListChange.next(this.propertiesList);
        }
    }

    ClearList(notify?: boolean) {
        this.propertiesList = new Array<DisplayedQuantityProperty>();
        this.UpdatePropertiesAvailableMovements();
        if (notify == null || notify === true) {
            this.propertiesListChange.next(this.propertiesList);
        }
    }

    RemoveItem(property: DisplayedQuantityProperty, notify?: boolean) {

        const index = this.propertiesList.indexOf(property, 0);
        if (index > -1) {
            this.propertiesList.splice(index, 1);
            this.UpdatePropertiesAvailableMovements();
        }
        if (notify == null || notify === true) {
            this.propertiesListChange.next(this.propertiesList);
        }
    }

    RemoveItemAtIndex(index: number) {
        if (index > -1 && index < this.propertiesList.length) {
            this.propertiesList.splice(index, 1);
            this.UpdatePropertiesAvailableMovements();
        }
        this.propertiesListChange.next(this.propertiesList);
    }

    ChangePropertyRank(previousIndex: number, newIndex: number) {

        const property = this.propertiesList[previousIndex];
        this.propertiesList.splice(previousIndex, 1);
        this.propertiesList.splice(newIndex, 0, property);
        this.UpdatePropertiesAvailableMovements();
        this.propertiesListChange.next(this.propertiesList);
    }

    findIndex(property: DisplayedQuantityProperty): number {
        const index: number = this.propertiesList.findIndex(prop => prop.id === property.id);
        return index;
    }

    private UpdatePropertiesAvailableMovements() {

        if (this.propertiesList.length > 0) {
            const lastIndex = this.propertiesList.length - 1;

            if (lastIndex === 0) {
                this.propertiesList[0].upDisabled = true;
                this.propertiesList[0].downDisabled = true;
                this.propertiesList[0].toTopDisabled = true;
                this.propertiesList[0].toBottomDisabled = true;
            }
            else {
                this.propertiesList.forEach(property => {
                    property.upDisabled = false;
                    property.downDisabled = false;
                    property.toTopDisabled = false;
                    property.toBottomDisabled = false;
                });

                this.propertiesList[0].upDisabled = true;
                this.propertiesList[0].downDisabled = false;
                this.propertiesList[0].toTopDisabled = true;
                this.propertiesList[0].toBottomDisabled = false;

                this.propertiesList[lastIndex].upDisabled = false;
                this.propertiesList[lastIndex].downDisabled = true;
                this.propertiesList[lastIndex].toTopDisabled = false;
                this.propertiesList[lastIndex].toBottomDisabled = true;
            }
        }

    }
}
