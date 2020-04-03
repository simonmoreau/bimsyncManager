export interface IProject {
    createdAt: Date;
    description: string;
    id: string;
    imageUrl: string;
    name: string;
    updatedAt: Date;
    owner: IUser;
    isStarred: boolean;
}

export interface IModel {
    id: string;
    name: string;
}

export interface IRevision {
    comment: string;
    createdAt: Date;
    id: string;
    model: IModel;
    user: IUser;
    version: string;
}

export interface ILibrary {
    id: string;
    name: string;
}

export interface ILibraryItem {
    id: string;
    name: string;
    parentId: string;
    document: any;
}

export interface IMember {
    role: string;
    user: IUser;
}

export interface IUser {
    avatarUrl: string;
    createdAt: string;
    id: string;
    name: string;
    username: string;
}

export interface IViewerToken {
    revisions: IRevision[];
    token: string;
    url: string;
}

export interface ITypeSummary {
    name: string;
    quantity: number;
}

class Entity {
    objectId: string;
    ifcType: string;
    attributes: ValueMap;
}

export class Value {
    ifcType: string;
    type: string;
    unit: string;
    value: any;
}

class ValueMap {
    [name: string]: Value;
}

export class Property {
    description: string;
    ifcType: string;
    nominalValue: Value;
    enumerationValues: Value[];
    listValues: Value[];
    lowerBoundValue: Value;
    upperBoundValue: Value;
    propertyReference: Value;
    properties: PropertyMap;
}

class PropertyMap {
    [name: string]: Property
}

class PropertySet extends Entity {
    revisionId: string;
    properties: PropertyMap;
}

class PropertySetMap {
    [name: string]: PropertySet;
}

export class Quantity {
    description: string;
    ifcType: string;
    value: Value;
}

class QuantityMap {
    [name: string]: Quantity
}

class QuantitySet extends Entity {
    revisionId: string;
    quantities: QuantityMap;
}

class QuantitySetMap {
    [name: string]: QuantitySet
}

class Type extends Entity {
    revisionId: string;
    propertySets: PropertySetMap;
    quantitySets: QuantitySetMap;
    materials: Entity[];
}

export class Product extends Entity {
    revisionId: string;
    propertySets: PropertySetMap;
    quantitySets: QuantitySetMap;
    materials: Entity[];
    type: Type;
}




