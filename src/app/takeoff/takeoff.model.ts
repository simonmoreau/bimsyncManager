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
    readonly availableGroupingModes: GroupingMode[];
    readonly path: string[];

    private _groupingMode: GroupingMode;

    constructor(name: string, type: string, path: string[]) {
        this.name = name;
        this.type = type;
        this.enable = false;
        this.icon = this.GetIcon();
        this.path = path;
        this._groupingMode = new GroupingMode();
        this.availableGroupingModes = this.GetAvailableGroupingModes();
    }

    get groupingMode(): GroupingMode {
        return this._groupingMode;
    }

    get displayName(): string {
        return this._groupingMode.modeText + this.name;
    }

    set groupingMode(groupingMode: GroupingMode) {
        this._groupingMode = groupingMode;
        this.SetGroupingMode(groupingMode);
    }

    private GetIcon(): string {
        return this.type === 'string' ? 'text' : 'slider';
    }

    private GetAvailableGroupingModes(): GroupingMode[] {
        let modes = [
            new GroupingMode(GroupingModeEnum.DontSummarize),
            new GroupingMode(GroupingModeEnum.Count),
            new GroupingMode(GroupingModeEnum.CountDistinct),
            new GroupingMode(GroupingModeEnum.First),
            new GroupingMode(GroupingModeEnum.Last),
        ]

        modes[0].isEnabled = true;
        return modes;
    }

    private SetGroupingMode(groupingMode: GroupingMode) {
        let index = this.availableGroupingModes.indexOf(groupingMode, 0);
        if (index > -1) {
            this.availableGroupingModes.forEach(gM => {gM.isEnabled = false; });
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
    Last
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
            default: {
                return "";
            }
         }
    }
}


