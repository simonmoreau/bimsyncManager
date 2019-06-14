export interface IProject {
    createdAt: Date;
    description: string;
    id: string;
    name: string;
    updatedAt: Date;
}

export interface IModel {
    id: string;
    name: string;
    revisions: IRevision[];
    selectedRevision: IRevision;
    is3DSelected: boolean;
    is2DSelected: boolean;
}

export interface IRevision {
    comment: string;
    createdAt: Date;
    id: string;
    model: IModel;
    user: IbimsyncUser;
    version: string;
}

export interface ILibrary {
    id: string;
    name: string;
    type: string;
}

export interface ILibraryItem {
    id: string;
    name: string;
    parentId: string;
    document: any;
}

export interface IMember {
    role: string;
    user: IbimsyncUser;
    visibility: string;
}

export interface IBimsyncBoard {
    project_id: string;
    name: string;
    bimsync_project_name: string;
    bimsync_project_id: string;
}

export interface IExtensionType {
    name: string;
    color: string;
}

export interface IExtensionStatus {
    name: string;
    color: string;
    type: string;
}

export interface IbimsyncUser {
    createdAt: string;
    id: string;
    name: string;
    username: string;
}

export interface IViewerToken {
    token: string;
    url: string;
}

export interface IViewer2DToken {
    token: string;
    url: string;
    modelId: string;
}

export interface IViewerRequestBody {
    viewerToken: string;
    viewer2DToken: string;
}

export interface IRevisionId {
    model_id: string;
    revision_id: string;
}

export interface IViewerURL {
    url: string;
}

export interface ISharedRevisions {
    projectId: string;
    revisions3D: string[];
    revision2D: string;
}

export interface ISharingCode {
    id: string;
    RefreshDate: Date;
    UserId: string;
    Viewer2dToken: IViewerToken;
    Viewer3dToken: IViewerToken;
    SharedModels: ISharedModel[];
    SharedRevisions: ISharedRevisions;
    SpacesId: number[];
}

export interface IViewerToken {
    token: string;
    url: string;
}

export interface ISharedModel {
    id: string;
    name: string;
}

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

