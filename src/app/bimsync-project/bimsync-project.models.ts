export interface IProject {
  createdAt: Date;
  description: string;
  id: string;
  name: string;
  updatedAt: Date;
}

export interface IMember {
  role: string;
  user: IUser;
  visibility: string;
}

export interface IUser {
  createdAt: string;
  id: string;
  name: string;
  username: string;
}