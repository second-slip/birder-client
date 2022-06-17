import { AuthenticationFailureReason } from "./authentication-failure-reason";

export interface IAuthenticationResult {
    authenticationToken: string;
    failureReason: AuthenticationFailureReason;
}
