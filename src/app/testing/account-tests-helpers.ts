import { IManageLocation } from "../_account/account-manage-location/i-manage-location.dto";
import { IManagePassword } from "../_account/account-manage-password/i-manage-password.dto";
import { IAccountRegistration } from "../_account/account-registration/i-account-registration";
import { IUserEmail } from "../_account/i-user-email.dto";
import { IUsername } from "../_account/i-username.dto";
import { IResetPassword } from "../_account/reset-password/i-reset-password.dto";

export const email = 'test@email.net';
export const username = 'testusername';
export const password = 'yJwbgyieB4';
export const confirmPassword = 'yJwbgyieB4';
export const code = 'sdjhceirufhcnfhvr4guhjkj3widj'
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


export const changePasswordModel = <IManagePassword> {
    oldPassword: password,
    newPassword: 'kdNf4rhfrbvbnfv',
    confirmPassword: 'kdNf4rhfrbvbnfv'
}

export const latitude = 1.000;
export const longitude = -1.000;
export const locationModel = <IManageLocation> {
    defaultLocationLatitude: latitude,
    defaultLocationLongitude: longitude
}


export const account_validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 20 characters long' },
      { type: 'pattern', message: 'Your username must be alphanumeric (no special characters) and must not contain spaces' },
      { type: 'restrictedName', message: 'Username may not contain the name "birder"' },
      { type: 'usernameTaken', message: 'This username has been taken' } //,
      // { type: 'serverError', message: 'Unable to connect to the server.  Please try again.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' },
      { type: 'emailTaken', message: 'There is already an account with this email' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one number and one letter' }
      // { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'match', message: 'Passwords do not match' }
    ]
  };