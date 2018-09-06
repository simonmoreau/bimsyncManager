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
