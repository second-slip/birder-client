import { IAuthUser } from "../_auth/i-auth-user.dto";


export const originalLatitude = 1.23;
export const originalLongitude = -1.11;


export const userModel = <IAuthUser>{
    userName: 'vilas',
    avatar: '',
    defaultLocationLatitude: originalLatitude,
    defaultLocationLongitude: originalLongitude
}