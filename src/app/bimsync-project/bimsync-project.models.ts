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