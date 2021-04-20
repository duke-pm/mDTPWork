/**
 ** Name: Routes
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Routes.js
 **/
import SignInScreen from '~/screens/authentication/signIn';
import Dashboard from '~/screens/dashboard';

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
    }
  },
}

export default Routes;
