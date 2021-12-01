import { AuthenticationFailureReason } from "./authentication-failure-reason";

export interface IauthenticationResult {
    authenticationToken: string;
    failureReason: AuthenticationFailureReason;
}