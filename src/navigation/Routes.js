/**
 ** Name: Routes
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Routes.js
 **/
/** AUTH */
import SignInScreen from '~/screens/authentication/signIn';
import ForgotPasswordScreen from '~/screens/authentication/forgotPassword';
/** DASHBOARD */
import Dashboard from '~/screens/dashboard';
/** ACCOUNT */
import Account from '~/screens/account';
import HelpAndInfo from '~/screens/helpAndInfo';
import ContactUs from '~/screens/contactUs';
import Settings from '~/screens/settings';
/** APPROVED */
import Approved from '~/screens/approved';
import ListRequest from '~/screens/approved/listAssets';
import ListRequestHandling from '~/screens/approved/listAssetsHandling';
import ApprovedAssets from '~/screens/approved/assets';
import ApprovedAssetsDamage from '~/screens/approved/assetsDamage';
import ApprovedAssetsLost from '~/screens/approved/assetsLost';
import AddRequestAsset from '~/screens/approved/addAsset/Request';
import AddRequestLostDamage from '~/screens/approved/addLostDamage/Request';
/** PROJECT MANAGEMENT */
import ProjectManagement from '~/screens/projectManagement';
import ProjectDetail from '~/screens/projectManagement/detail/Project';
import TaskDetail from '~/screens/projectManagement/detail/Task';

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
    HELP_AND_INFO: {
      name: 'HelpAndInfo',
      path: HelpAndInfo,
    },
    CONTACT_US: {
      name: 'ContactUs',
      path: ContactUs,
    },
    SETTINGS: {
      name: 'Settings',
      path: Settings,
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
        },
      },
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
    PROJECT_MANAGEMENT: {
      name: 'ProjectManagement',
      path: ProjectManagement,
    },
    PROJECT_DETAIL: {
      name: 'ProjectDetail',
      path: ProjectDetail,
    },
    TASK_DETAIL: {
      name: 'TaskDetail',
      path: TaskDetail,
    },
  },
};

export default Routes;
