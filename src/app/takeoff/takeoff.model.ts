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
    groupingMode: GroupingMode;
    readonly path: string[];

    constructor(name: string, type: string, path: string[]) {
        this.name = name;
        this.type = type;
        this.enable = false;
        this.icon = this.GetIcon();
        this.path = path;
        this.groupingMode = new GroupingMode();
    }

    private GetIcon(): string {
        return this.type === 'string' ? 'text' : 'slider';
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
    Last
}

export class GroupingMode {

    isEnabled: boolean;
    mode: GroupingModeEnum;

    private _modeName: string;

    constructor() {
        this.mode = GroupingModeEnum.DontSummarize;
        this.isEnabled = true;
    }

    get modeName(): string {
        return this.GetGroupingModeDisplay();
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
            default: {
                return "Don't Summarize";
            }
         }
    }
}


