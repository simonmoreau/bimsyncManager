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
