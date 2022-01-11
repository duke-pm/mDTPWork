/**
 ** Name: All routes of app
 ** Author: Jerry
 ** CreateAt: 2021
 ** Description: Description of Routes.js
 **/
/** INTRO */
import IntroPage from "~/pages/intro";
/** AUTH */
import LoginPage from "~/pages/authentication/login";
import SignUpPage from "~/pages/authentication/signup";
import ForgotPasswordPage from "~/pages/authentication/forgot_password";
import ResetPasswordPage from "~/pages/authentication/reset_password";
/** TAB */
import DashboardPage from "~/pages/dashboard";
import AccountPage from "~/pages/account";
/** ACCOUNT FLOW */
import MyAccountPage from "~/pages/account/myAccount";
import UpdatePasswordPage from "~/pages/account/changePassword";
import HelpAndInfoPage from "~/pages/account/helpAndInfo";
import ContactUsPage from "~/pages/account/contactUs";
import SettingsPage from "~/pages/account/settings";
import AppearancePage from "~/pages/account/appearance";
import LanguagesPage from "~/pages/account/languages";
/** APPROVED */
import ApprovedPage from "~/pages/approved";
import ListRequestPage from "~/pages/approved/listAssets";
import AddRequestAssetPage from "~/pages/approved/addAsset/Request";
import AddRequestLostDamagePage from "~/pages/approved/addLostDamage/Request";
import ListRequestHandlingPage from "~/pages/approved/listAssetsHandling"
/** PROJECT */
import ProjectPage from "~/pages/project";
import ProjectOverviewPage from "~/pages/project/overview";
import ProjectsPage from "~/pages/project/project";
import TasksPage from "~/pages/project/detail/Project";
import TaskDetailPage from "~/pages/project/detail/Task";
/** BOOKING */
import BookingPage from "~/pages/booking";
import BookingsPage from "~/pages/booking/bookings";
import AddBookingPage from "~/pages/booking/add";
import MyBookingsPage from "~/pages/booking/myBookings";

const Routes = {
  INTRO: {
    name: "Intro",
    path: IntroPage,
  },
  LOGIN_IN: {
    name: "Login",
    path: LoginPage,
  },
  SIGN_UP: {
    name: "SignUp",
    path: SignUpPage,
  },
  FORGOT_PASSWORD: {
    name: "ForgotPassword",
    path: ForgotPasswordPage,
  },
  RESET_PASSWORD: {
    name: "ChangePassword",
    path: ResetPasswordPage,
  },
  TAB: {
    name: "TabMain",
    DASHBOARD: {
      name: "Dashboard",
      path: DashboardPage,
    },
    ACCOUNT: {
      name: "Account",
      path: AccountPage,
    },
  },
  /** Account flow */
  MY_ACCOUNT: {
    name: "MyAccount",
    path: MyAccountPage,
  },
  CHANGE_PASSWORD: {
    name: "UpdatePassword",
    path: UpdatePasswordPage,
  },
  HELP_AND_INFO: {
    name: "HelpAndInfo",
    path: HelpAndInfoPage,
  },
  CONTACT_US: {
    name: "ContactUs",
    path: ContactUsPage,
  },
  SETTINGS: {
    name: "Settings",
    path: SettingsPage,
  },
  APPEARANCE: {
    name: "Appearance",
    path: AppearancePage,
  },
  LANGUAGES: {
    name: "Languages",
    path: LanguagesPage,
  },
  /** Approved flow */
  APPROVED: {
    name: "Approved",
    path: ApprovedPage,
  },
  LIST_REQUEST_ASSETS: {
    name: "ListApprovedAssets",
    path: ListRequestPage,
  },
  ADD_APPROVED_ASSETS: {
    name: "AddRequestAsset",
    path: AddRequestAssetPage,
  },
  ADD_APPROVED_LOST_DAMAGED: {
    name: "AddRequestLostDamage",
    path: AddRequestLostDamagePage,
  },
  LIST_REQUEST_HANDLING: {
    name: "ListApprovedAssetsHandling",
    path: ListRequestHandlingPage,
  },
  /** Project flow */
  PROJECT: {
    name: "ProjectManagement",
    path: ProjectPage,
  },
  PROJECT_OVERVIEW: {
    name: "ProjectOverview",
    path: ProjectOverviewPage,
  },
  PROJECTS: {
    name: "Project",
    path: ProjectsPage,
  },
  TASKS: {
    name: "ProjectDetail",
    path: TasksPage,
  },
  TASK_DETAILS: {
    name: "TaskDetail",
    path: TaskDetailPage,
  },
  /** Booking flow */
  BOOKING: {
    name: "BookingManagement",
    path: BookingPage,
  },
  BOOKINGS: {
    name: "Bookings",
    path: BookingsPage,
  },
  MY_BOOKINGS: {
    name: "MyBookings",
    path: MyBookingsPage,
  },
  ADD_BOOKING: {
    name: "AddBooking",
    path: AddBookingPage,
  },
};

export default Routes;
