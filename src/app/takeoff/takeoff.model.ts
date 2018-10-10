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


export interface IDisplayProperty {
    name: string;
    enable: boolean;
    path: string[];
}

export interface IDisplayPropertySet {
    name: string;
    properties: IDisplayProperty[];
}

export interface IGroupedProperty {
    name: string;
}

export enum PropertyType {
    PropertySet,
    QuantitySet,
}


