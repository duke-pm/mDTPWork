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

/** APPROVED */
import Approved from '~/screens/approved';

import ApprovedAssets from '~/screens/approved/assets';
import AddRequestAsset from '~/screens/approved/assets/add/Request';

import ApprovedLostDamaged from '~/screens/approved/lostDamaged';
import AddRequestLostDamage from '~/screens/approved/lostDamaged/add/Request';

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
    APPROVED_ASSETS: {
      name: 'ApprovedAssets',
      path: ApprovedAssets,
    },
    ADD_APPROVED_ASSETS: {
      name: 'AddRequestAsset',
      path: AddRequestAsset,
    },
    APPROVED_LOST_DAMAGED: {
      name: 'ApprovedLostDamaged',
      path: ApprovedLostDamaged,
    },
    ADD_APPROVED_LOST_DAMAGED: {
      name: 'AddRequestLostDamage',
      path: AddRequestLostDamage,
    },
  },
}

export default Routes;
