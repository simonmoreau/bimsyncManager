import { throwError } from "rxjs";

export interface ITypeSummary {
    typeName: string;
    typeQuantity: number;
}

export interface IProduct {
    revisionId: string;
    objectId: number;
    ifcType: string;
    attributes: any;
    type?: IProduct;
    propertySets: any;
    quantitySets: any;
    materials: any[];
}

export interface IPropertySet {
    revisionId: string;
    objectId: number;
    ifcType: string;
    attributes: any;
    properties: any;
}

export interface IQuantitySet {
    revisionId: string;
    objectId: number;
    ifcType: string;
    attributes: any;
    quantities: any;
}

export interface IAttribute {
    type: string;
    ifcType: string;
    value: string;
}

export interface NominalValue {
    type: string;
    ifcType: string;
    value: string;
    unit: string;
}

export interface IProperty {
    ifcType: string;
    nominalValue: NominalValue;
}

export interface Value {
    type: string;
    ifcType: string;
    value: number;
    unit: string;
}

export interface IQuantity {
    description: string;
    ifcType: string;
    value: Value;
}

export class DisplayProperty {
    readonly name: string;
    readonly type: string;
    enable: boolean;
    readonly icon: string;
    readonly availableGroupingModes: GroupingMode[];
    readonly path: string[];
    readonly unit: string;
    readonly guid: string;
    columnGuid: string;
    isFirst: boolean;
    isLast: boolean;

    private _groupingMode: GroupingMode;

    constructor(name: string, type: string, unit: string, path: string[]) {
        this.name = name;
        this.type = type;
        this.unit = unit;
        this.enable = false;
        this.icon = this.GetIcon();
        this.path = path;
        this._groupingMode = new GroupingMode();
        this.availableGroupingModes = this.GetAvailableGroupingModes();
        this.guid = Guid.newGuid();
        this.columnGuid = Guid.newGuid();
    }

    get groupingMode(): GroupingMode {
        return this._groupingMode;
    }

    get displayName(): string {
        const displayUnit = this.unit ? ' (' + this.unit + ')' : '';
        return this._groupingMode.modeText + this.name + displayUnit;
    }

    set groupingMode(groupingMode: GroupingMode) {
        this._groupingMode = groupingMode;
        this.SetGroupingMode(groupingMode);
    }

    private GetIcon(): string {
        return this.type === 'number' ? 'slider' : 'text';
    }

    private GetAvailableGroupingModes(): GroupingMode[] {
        let modes = [
            new GroupingMode(GroupingModeEnum.DontSummarize),
            new GroupingMode(GroupingModeEnum.Count),
            new GroupingMode(GroupingModeEnum.CountDistinct),
            new GroupingMode(GroupingModeEnum.First),
            new GroupingMode(GroupingModeEnum.Last),
        ]

        let numberModes = [
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

        if (this.type === 'number') {
            modes = numberModes;
        }

        modes[0].isEnabled = true;
        return modes;
    }

    private SetGroupingMode(groupingMode: GroupingMode) {
        let index = this.availableGroupingModes.indexOf(groupingMode, 0);
        if (index > -1) {
            this.availableGroupingModes.forEach(gM => { gM.isEnabled = false; });
            this.availableGroupingModes[index].isEnabled = true;
        }
    }
}

export interface IDisplayPropertySet {
    name: string;
    properties: DisplayProperty[];
}

export enum GroupingModeEnum {
    DontSummarize,
    Count,
    CountDistinct,
    First,
    Last,
    Sum,
    Average,
    Minimun,
    Maximun,
    StandardDeviation,
    Variance,
    Median
}

export enum SortEnum {
    Up,
    Down,
    ToTop,
    ToBottom
}

export class GroupingMode {

    isEnabled: boolean;
    mode: GroupingModeEnum;

    private _modeName: string;

    constructor(groupingModeEnum?: GroupingModeEnum) {
        this.mode = groupingModeEnum || GroupingModeEnum.DontSummarize;
        this.isEnabled = false;
    }

    get modeName(): string {
        return this.GetGroupingModeDisplay();
    }

    get modeText(): string {
        return this.GetGroupingModeText();
    }

    private GetGroupingModeDisplay(): string {
        switch (this.mode) {
            case GroupingModeEnum.DontSummarize: {
                return "Don't Summarize";
            }
            case GroupingModeEnum.Count: {
                return "Count";
            }
            case GroupingModeEnum.CountDistinct: {
                return "Count (Distinct)";
            }
            case GroupingModeEnum.First: {
                return "First";
            }
            case GroupingModeEnum.Last: {
                return "Last";
            }
            case GroupingModeEnum.Sum: {
                return "Sum";
            }
            case GroupingModeEnum.Average: {
                return "Average";
            }
            case GroupingModeEnum.Minimun: {
                return "Minimun";
            }
            case GroupingModeEnum.Maximun: {
                return "Maximun";
            }
            case GroupingModeEnum.StandardDeviation: {
                return "Standard Deviation";
            }
            case GroupingModeEnum.Variance: {
                return "Variance";
            }
            case GroupingModeEnum.Median: {
                return "Median";
            }
            default: {
                return "Don't Summarize";
            }
        }
    }

    private GetGroupingModeText(): string {
        switch (this.mode) {
            case GroupingModeEnum.DontSummarize: {
                return "";
            }
            case GroupingModeEnum.Count: {
                return "Count of ";
            }
            case GroupingModeEnum.CountDistinct: {
                return "Count of ";
            }
            case GroupingModeEnum.First: {
                return "First ";
            }
            case GroupingModeEnum.Last: {
                return "Last ";
            }
            case GroupingModeEnum.Sum: {
                return "Sum of ";
            }
            case GroupingModeEnum.Average: {
                return "Average of ";
            }
            case GroupingModeEnum.Minimun: {
                return "Min of ";
            }
            case GroupingModeEnum.Maximun: {
                return "Max of ";
            }
            case GroupingModeEnum.StandardDeviation: {
                return "Standard deviation of ";
            }
            case GroupingModeEnum.Variance: {
                return "Variance of ";
            }
            case GroupingModeEnum.Median: {
                return "Median of ";
            }
            default: {
                return "";
            }
        }
    }
}

export class Guid {
    static newGuid() {

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}

export class ValueTree {
    readonly value: any;
    readonly property: DisplayProperty;
    readonly selectedProperties: DisplayProperty[];
    readonly products: IProduct[];
    readonly columnNumber: number;
    readonly tree: ValueTree[];

    constructor(value: any, columnNumber: number, selectedProperties: DisplayProperty[], products: IProduct[]) {
        this.value = value;
        this.property = selectedProperties[columnNumber];
        this.columnNumber = columnNumber;
        this.selectedProperties = selectedProperties;
        this.products = products;
        this.tree = this.GetValueTree();
    }

    private GetValueTree(): ValueTree[] {

        let nextColumntreeItems: ValueTree[] = [];

        if (this.columnNumber + 1 < this.selectedProperties.length) {
            // Get the array of values for the next column
            let nextColumnArray: any[] = Products.GetGroupedList(
                this.selectedProperties[this.columnNumber + 1],
                this.products
            );

            // Create a tree item for each value of the next column
            nextColumnArray.forEach(value => {
                let filteredProducts = Products.GetFilteredProducts(
                    this.products,
                    this.selectedProperties[this.columnNumber + 1].path,
                    value
                );

                nextColumntreeItems.push(new ValueTree(
                    value,
                    this.columnNumber + 1,
                    this.selectedProperties,
                    filteredProducts
                ));
            });
        }

        return nextColumntreeItems;
    }

    get rows(): any {
        let rows: any[] = [];

        if (this.tree.length !== 0) {
            this.tree.forEach(treeItem => {
                treeItem.rows.forEach(row => {
                    row[this.property.columnGuid] = this.value;
                    rows.push(row);
                });
            });
        } else {
            let row: any = {};
            row[this.property.columnGuid] = this.value;
            rows.push(row);
        }

        return rows;
    }
}

export class Products {
    static GetGroupedList(selectedProperty: DisplayProperty, products: IProduct[]): any[] {

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        function average(data) {
            const sum = data.reduce((a, b) => a + b, 0);
            return sum / data.length;
        }

        function variance(array) {
            const avg = average(array);
            const squareDiffs = array.map((value) => (value - avg) * (value - avg));
            return average(squareDiffs);
        }

        let allPropertyValuesList = products.map(product => {
            return this.GetPropertyValueFromPath(selectedProperty.path, product);
        });

        switch (selectedProperty.groupingMode.mode) {
            case GroupingModeEnum.DontSummarize: {
                return allPropertyValuesList.filter(onlyUnique);
            }
            case GroupingModeEnum.Count: {
                return [allPropertyValuesList.length];
            }
            case GroupingModeEnum.CountDistinct: {
                return [allPropertyValuesList.filter(onlyUnique).length];
            }
            case GroupingModeEnum.First: {
                return [allPropertyValuesList.filter(onlyUnique).sort()[0]];
            }
            case GroupingModeEnum.Last: {
                let filteredValues = allPropertyValuesList.filter(onlyUnique).sort();
                return [filteredValues[filteredValues.length - 1]];
            }
            case GroupingModeEnum.Sum: {
                return [allPropertyValuesList.reduce((a, b) => a + b, 0)];
            }
            case GroupingModeEnum.Average: {
                return [average(allPropertyValuesList)];
            }
            case GroupingModeEnum.Minimun: {
                return [allPropertyValuesList.filter(onlyUnique).sort()[0]];
            }
            case GroupingModeEnum.Maximun: {
                let filteredValues = allPropertyValuesList.filter(onlyUnique).sort();
                return [filteredValues[filteredValues.length - 1]];
            }
            case GroupingModeEnum.StandardDeviation: {
                return [Math.sqrt(variance(allPropertyValuesList))];
            }
            case GroupingModeEnum.Variance: {
                return [variance(allPropertyValuesList)];
            }
            case GroupingModeEnum.Median: {
                const arr = allPropertyValuesList.sort((a, b) => a - b);
                let median = 0;
                if (arr.length % 2 === 1) {
                    median = arr[(arr.length + 1) / 2 - 1];
                } else {
                    median = (1 * arr[arr.length / 2 - 1] + 1 * arr[arr.length / 2]) / 2;
                }
                return [median]
            }
            default: {
                return allPropertyValuesList.filter(onlyUnique);
            }
        }
    }

    static GetFilteredProducts(products: IProduct[], path: string[], value: any): IProduct[] {
        return products.filter(product =>
            this.GetPropertyValueFromPath(path, product) === value
        );
    }

    static GetPropertyValueFromPath(path: string[], object: any): any {
        return path.reduce((acc, currValue) => (acc && acc[currValue]) ? acc[currValue] : null
            , object)
    }
}


