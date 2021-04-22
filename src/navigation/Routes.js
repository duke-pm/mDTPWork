/**
 ** Name: Routes
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Routes.js
 **/
import SignInScreen from '~/screens/authentication/signIn';
import Dashboard from '~/screens/dashboard';
import Approved from '~/screens/approved';
import AddApproved from '~/screens/approved/add';

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
      name: 'AddApproved',
      path: AddApproved,
    }
  },
}

export default Routes;
