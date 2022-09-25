import { IManageLocation } from "../_account/account-manage-location/i-manage-location.dto";
import { IManagePassword } from "../_account/account-manage-password/i-manage-password.dto";
import { IManageProfile } from "../_account/account-manage-profile/i-manage-profile.dto";
import { IAccountRegistration } from "../_account/account-registration/i-account-registration";
import { IUserEmail } from "../_account/i-user-email.dto";
import { IUsername } from "../_account/i-username.dto";
import { IResetPassword } from "../_account/reset-password/i-reset-password.dto";

export const email = 'test@email.net';
export const username = 'testusername';
export const oldPassword = 'fotkmm7smJJ';
export const password = 'yJwbgyieB4';
export const confirmPassword = 'yJwbgyieB4';
export const newPassword = 'kdNf4rhfrbvbnfv';
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

// Manage account objects

export const manageProfileModel = <IManageProfile>{
  username: username,
  emailConfirmationRequired: true, //???
  email: email
}

export const changePasswordModel = <IManagePassword>{
  oldPassword: oldPassword,
  newPassword: password,
  confirmPassword: confirmPassword
}

// export const latitude = 1.000;
// export const longitude = -1.000;
export const newLatitude = 2.44;
export const newLongitude = -2.73;
export const locationModel = <IManageLocation>{
  defaultLocationLatitude: newLatitude,
  defaultLocationLongitude: newLongitude
}

export const newAccountLocationMapMarker = ({
  position: {
    lat: newLatitude,
    lng: newLongitude
  },
  options: { draggable: true },
});