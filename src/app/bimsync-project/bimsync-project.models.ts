export interface IProject {
  createdAt: Date;
  description: string;
  id: string;
  name: string;
  updatedAt: Date;
}

export interface IMember {
  role: string;
  user: IbimsyncUser;
  visibility: string;
}

export interface IbimsyncUser {
  createdAt: string;
  id: string;
  name: string;
  username: string;
}