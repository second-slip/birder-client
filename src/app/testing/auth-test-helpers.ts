import { AuthenticationFailureReason } from "../_auth/authentication-failure-reason";
import { IAuthUser } from "../_auth/i-auth-user.dto";
import { IAuthenticationResult } from "../_auth/i-authentication-result.dto";
import { Ilogin } from "../_auth/login/ilogin.dto";


export const originalLatitude = 1.23;
export const originalLongitude = -1.11;
export const avatar = 'https://www.website.com'


export const userModel = <IAuthUser>{
    userName: 'vilas',
    avatar: avatar,
    defaultLocationLatitude: originalLatitude,
    defaultLocationLongitude: originalLongitude
}

export const authSuccessResult = <IAuthenticationResult>{
    authenticationToken: 'sdneukfhbuor3fnmjkusx84hnf',
    failureReason: AuthenticationFailureReason.None
}

export const authFailResult = <IAuthenticationResult>{
    authenticationToken: '',
    failureReason: AuthenticationFailureReason.EmailConfirmationRequired
}

export const username = 'testuser@test.com';
export const password = 'mkeof&Tgh1p';
export const rememberMe = false;


export const loginModel = <Ilogin> {
    password: password,
    rememberMe: rememberMe,
    userName: username
}