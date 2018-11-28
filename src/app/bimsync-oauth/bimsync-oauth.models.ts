export interface IUser {
    id: number;
    Name: string;
    PowerBISecret: string;
    AccessToken: IAccessToken;
    RefreshDate?: Date;
    BCFToken: string;
}

export interface IbimsyncUser {
    createdAt: Date;
    id: string;
    name: string;
    username: string;
}

export interface IAccessToken {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
}
