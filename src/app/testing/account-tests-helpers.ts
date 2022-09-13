import { IAccountRegistration } from "../_account/account-registration/i-account-registration";
import { IUserEmail } from "../_account/i-user-email.dto";
import { IUsername } from "../_account/i-username.dto";
import { IResetPassword } from "../_account/reset-password/i-reset-password.dto";

export const email = 'test@email.net';
export const username = 'test-username';
export const password = 'password';
export const confirmPassword = 'confirmPassword';
const code = 'sdjhceirufhcnfhvr4guhjkj3widj'
export const emailModel = <IUserEmail>{ email: email };
export const usernameModel = <IUsername>{ username: username };
export const registerModel = <IAccountRegistration>{
    userName: username, email: email, password: password, confirmPassword: confirmPassword
};
export const resetPasswordModel = <IResetPassword>{
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    code: code
};