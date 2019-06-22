import { IUser } from './bimsync.model';

export interface IAccessToken {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
}

export interface IUser {
    id: number;
    Name: string;
    PowerBISecret: string;
    AccessToken: IAccessToken;
    RefreshDate?: Date;
    BCFToken: string;
}

