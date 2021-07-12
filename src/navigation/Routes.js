/**
 ** Name: Routes
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Routes.js
 **/
/** AUTH */
import SignInScreen from '~/screens/authentication/signIn';
import ForgotPasswordScreen from '~/screens/authentication/forgotPassword';
import ChangePasswordScreen from '~/screens/authentication/changePassword';
/** DASHBOARD */
import Dashboard from '~/screens/dashboard';
/** ACCOUNT */
import Account from '~/screens/account';
import ChangePassword from '~/screens/changePassword';
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
import ProjectFilter from '~/screens/projectManagement/components/FilterProject';
import TaskDetail from '~/screens/projectManagement/detail/Task';
import TaskActivities from '~/screens/projectManagement/components/Activities';
import TaskWatchers from '~/screens/projectManagement/components/Watchers';
/** PROJECT MANAGEMENT */
import SalesVisit from '~/screens/salesVisit';

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
    CHANGE_PASSWORD: {
      name: 'UpdatePassword',
      path: ChangePasswordScreen,
    },
  },
  ROOT_TAB: {
    name: 'RootTab',
  },
  MAIN: {
    // Common screens
    DASHBOARD: {
      name: 'Dashboard',
      path: Dashboard,
    },
    ACCOUNT: {
      name: 'Account',
      path: Account,
    },
    CHANGE_PASSWORD: {
      name: 'ChangePassword',
      path: ChangePassword,
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

    // Approved screens
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

    // Project management screens
    PROJECT_MANAGEMENT: {
      name: 'ProjectManagement',
      path: ProjectManagement,
    },
    PROJECT_DETAIL: {
      name: 'ProjectDetail',
      path: ProjectDetail,
    },
    PROJECT_FILTER: {
      name: 'ProjectFilter',
      path: ProjectFilter,
    },
    TASK_DETAIL: {
      name: 'TaskDetail',
      path: TaskDetail,
      childrens: {
        TASK_ACTIVITIES: {
          name: 'TaskActivities',
          path: TaskActivities,
        },
        TASK_WATCHERS: {
          name: 'TaskWatchers',
          path: TaskWatchers,
        },
      },
    },

    // Sales visit screens
    SALES_VISIT: {
      name: 'SalesVisit',
      path: SalesVisit,
    },
  },
};

export default Routes;
