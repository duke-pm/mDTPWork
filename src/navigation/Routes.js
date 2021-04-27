/**
 ** Name: Routes
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Routes.js
 **/
import SignInScreen from '~/screens/authentication/signIn';
import Dashboard from '~/screens/dashboard';
import Approved from '~/screens/approved';
import AddRequestAsset from '~/screens/approved/add/Request';

const Routes = {
  AUTHENTICATION: {
    SIGN_IN: {
      name: 'SignIn',
      path: SignInScreen,
    }
  },
  ROOT_STACK: {
    name: 'RootStack',
  },
  MAIN: {
    DASHBOARD: {
      name: 'Dashboard',
      path: Dashboard,
    },
    APPROVED: {
      name: 'Approved',
      path: Approved,
    },
    ADD_APPROVED: {
      name: 'AddRequestAsset',
      path: AddRequestAsset,
    }
  },
}

export default Routes;
