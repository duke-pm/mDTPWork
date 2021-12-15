/**
 ** Name: All routes of app
 ** Author: Jerry
 ** CreateAt: 2021
 ** Description: Description of Routes.js
 **/
/** INTRO */
import IntroPage from '~/pages/intro';
/** AUTH */
import LoginPage from '~/pages/authentication/login';
import SignUpPage from '~/pages/authentication/signup';
import ForgotPasswordPage from '~/pages/authentication/forgot_password';
import ResetPasswordPage from '~/pages/authentication/reset_password';
/** TAB */
import DashboardPage from '~/pages/dashboard';
import AccountPage from '~/pages/account';
/** ACCOUNT FLOW */
import UpdatePasswordPage from '~/pages/account/changePassword';

const Routes = {
  INTRO: {
    name: 'Intro',
    path: IntroPage,
  },
  LOGIN_IN: {
    name: 'Login',
    path: LoginPage,
  },
  SIGN_UP: {
    name: 'SignUp',
    path: SignUpPage,
  },
  FORGOT_PASSWORD: {
    name: 'ForgotPassword',
    path: ForgotPasswordPage,
  },
  RESET_PASSWORD: {
    name: 'ChangePassword',
    path: ResetPasswordPage,
  },
  TAB: {
    name: 'TabMain',
    DASHBOARD: {
      name: 'Dashboard',
      path: DashboardPage,
    },
    ACCOUNT: {
      name: 'Account',
      path: AccountPage,
    },
  },
  CHANGE_PASSWORD: {
    name: 'UpdatePassword',
    path: UpdatePasswordPage,
  },
};

export default Routes;
