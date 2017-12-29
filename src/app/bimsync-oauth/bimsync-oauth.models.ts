export interface IUser {
    id: number;
    name: string;
    bimsync_id: string;
    powerBiSecret: string;
    accessToken: string;
    tokenType: string;
    tokenExpireIn: number;
    refreshToken: string;
    refreshDate?: any;
}

export interface IbimsyncUser {
    createdAt: Date;
    id: string;
    name: string;
    username: string;
}

export interface IAccessToken {
    access_token: Date;
    refresh_token: string;
    token_type: string;
    expires_in: string;
}
