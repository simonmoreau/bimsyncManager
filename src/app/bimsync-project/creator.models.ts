export interface ICreator {
    projectName: string;
    projectDescription?: string;
    users?: IMember[];
    models?: IModel[];
    boards?: IBoard[];
  }
  
  export interface IBoard {
    name: string;
    statuses?: IStatus[];
    types?: IType[];
  }
  
  export interface IType {
    name: string;
    color: string;
  }
  
  export interface IStatus {
    name: string;
    color: string;
    type: string;
  }
  
  export interface IModel {
    name: string;
  }
  
  export interface IMember {
    id: string;
    role: string;
  }