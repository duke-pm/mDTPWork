/**
 ** Name: Routes
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Routes.js
 **/
import SignInScreen from '~/screens/authentication/signIn';
import ForgotPasswordScreen from '~/screens/authentication/forgotPassword';
import Dashboard from '~/screens/dashboard';
import Account from '~/screens/account';
import Approved from '~/screens/approved';
import AddRequestAsset from '~/screens/approved/add/Request';

const Routes = {
  AUTHENTICATION: {
    SIGN_IN: {
      name: 'SignIn',
      path: SignInScreen,
    },
    FORGOT_PASSWORD: {
      name: 'ForgotPassword',
      path: ForgotPasswordScreen,
    },
  },
  ROOT_TAB: {
    name: 'RootTab',
  },
  ROOT_STACK: {
    name: 'RootStack',
  },
  MAIN: {
    DASHBOARD: {
      name: 'Dashboard',
      path: Dashboard,
    },
    ACCOUNT: {
      name: 'Account',
      path: Account,
    },
    APPROVED: {
      name: 'Approved',
      path: Approved,
    },
    ADD_APPROVED: {
      name: 'AddRequestAsset',
      path: AddRequestAsset,
    },
  },
}

export default Routes;
