/**
 ** Name: All routes of app
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
import MyAccount from '~/screens/account/myAccount';
import ChangePassword from '~/screens/account/changePassword';
import HelpAndInfo from '~/screens/account/helpAndInfo';
import ContactUs from '~/screens/account/contactUs';
import Settings from '~/screens/account/settings';
/** APPROVED */
import Approved from '~/screens/approvedManagement';
import ListRequest from '~/screens/approvedManagement/listAssets';
import ListRequestHandling from '~/screens/approvedManagement/listAssetsHandling';
import ApprovedAssets from '~/screens/approvedManagement/assets';
import ApprovedAssetsDamage from '~/screens/approvedManagement/assetsDamage';
import ApprovedAssetsLost from '~/screens/approvedManagement/assetsLost';
import AddRequestAsset from '~/screens/approvedManagement/addAsset/Request';
import AddRequestLostDamage from '~/screens/approvedManagement/addLostDamage/Request';
/** PROJECT MANAGEMENT */
import ProjectManagement from '~/screens/projectManagement';
import Project from '~/screens/projectManagement/project';
import ProjectOverview from '~/screens/projectManagement/overview';
import ProjectDetail from '~/screens/projectManagement/detail/Project';
import ProjectFilter from '~/screens/projectManagement/components/FilterProject';
import ProjectOverviewFilter from '~/screens/projectManagement/components/FilterOverview';
import TaskDetail from '~/screens/projectManagement/detail/Task';
import TaskActivities from '~/screens/projectManagement/components/Activities';
import TaskWatchers from '~/screens/projectManagement/components/Watchers';
/** SALE VISIT */
import SalesVisit from '~/screens/salesVisit';
/** BOOKING */
import BookingManagement from '~/screens/bookingManagement';
import Bookings from '~/screens/bookingManagement/bookings';
import MyBookings from '~/screens/bookingManagement/myBookings';
import AddBooking from '~/screens/bookingManagement/addBooking';

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
    MY_ACCOUNT: {
      name: 'MyAccount',
      path: MyAccount,
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
    PROJECT: {
      name: 'Project',
      path: Project,
    },
    PROJECT_OVERVIEW: {
      name: 'ProjectOverview',
      path: ProjectOverview,
    },
    PROJECT_FILTER: {
      name: 'ProjectFilter',
      path: ProjectFilter,
    },
    PROJECT_OVERVIEW_FILTER: {
      name: 'ProjectOverviewFilter',
      path: ProjectOverviewFilter,
    },
    PROJECT_DETAIL: {
      name: 'ProjectDetail',
      path: ProjectDetail,
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

    // Booking screens
    BOOKING_MANAGEMENT: {
      name: 'BookingManagement',
      path: BookingManagement,
    },
    BOOKINGS: {
      name: 'Bookings',
      path: Bookings,
    },
    MY_BOOKINGS: {
      name: 'MyBookings',
      path: MyBookings,
    },
    ADD_BOOKING: {
      name: 'AddBooking',
      path: AddBooking,
    },
  },
};

export default Routes;
