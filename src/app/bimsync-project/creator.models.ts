export interface ICreatedProject {
  projectName: string;
  projectDescription?: string;
  users?: ICreatedMember[];
  models?: ICreatedModel[];
  boards?: ICreatedBoard[];
  folders?: ICreatedFolder[];
}

export interface ICreatedBoard {
  name: string;
  statuses?: ICreatedStatus[];
  types?: ICreatedType[];
}

export interface ICreatedType {
  name: string;
  color: string;
}

export interface ICreatedStatus {
  name: string;
  color: string;
  type: string;
}

export interface ICreatedModel {
  name: string;
}

export interface ICreatedMember {
  id: string;
  role: string;
}

export interface ICreatedFolder {
  name: string;
  folders: ICreatedFolder[];
}
