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

import ListRequest from '~/screens/approved/listAssets';
import ListRequestHandling from '~/screens/approved/listAssetsHandling';

import ApprovedAssets from '~/screens/approved/assets';
import ApprovedAssetsDamage from '~/screens/approved/assetsDamage';
import ApprovedAssetsLost from '~/screens/approved/assetsLost';
import AddRequestAsset from '~/screens/approved/addAsset/Request';
import AddRequestLostDamage from '~/screens/approved/addLostDamage/Request';

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
      childrens: {
        LIST_REQUEST_ASSETS: {
          name: 'ListApprovedAssets',
          path: ListRequest,
        },
        LIST_REQUEST_HANDLING: {
          name: 'ListApprovedAssetsHandling',
          path: ListRequestHandling,
        }
      }
    },
    APPROVED_ASSETS: {
      name: 'ApprovedAssets',
      path: ApprovedAssets,
    },
    APPROVED_ASSETS_DAMAGE: {
      name: 'ApprovedAssetsDamage',
      path: ApprovedAssetsDamage,
    },
    APPROVED_ASSETS_LOST: {
      name: 'ApprovedAssetsLost',
      path: ApprovedAssetsLost,
    },
    ADD_APPROVED_ASSETS: {
      name: 'AddRequestAsset',
      path: AddRequestAsset,
    },
    ADD_APPROVED_LOST_DAMAGED: {
      name: 'AddRequestLostDamage',
      path: AddRequestLostDamage,
    },
  },
}

export default Routes;
