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