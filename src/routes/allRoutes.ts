import Login from "@/pages/loginPage";
import PracticeDashboard from "../pages/dashboard";
import ReasonForVisit from "../pages/reasonForVisit";
import Settings from "@/pages/settings";
import Providers from "@/pages/providers";
import Appointments from "@/pages/appointments";
import Signup from "@/pages/signupPage";
import Practices from "@/pages/practices";
import AccountSettings from "@/pages/accountSettings";
import ForgotPassword from "@/pages/forgotPassword";
import ResetPassword from "@/pages/resetPassword/ResetPassword";
import Insurance from "@/pages/insurance";
import Template from "@/pages/template";
import Review from "@/pages/review";
import Schedules from "@/pages/schedules";

const ROUTES = [
  {
    path: "/signup",
    key: "Signup",
    component: Signup, //this is from the index component of signupPage folder.
    isPrivate: false,
    exact: true,
  },
  {
    path: "/login",
    key: "Login",
    component: Login, //this is from the index component of loginPage folder.
    isPrivate: false,
    exact: true,
  },
  {
    path: "/dashboard",
    key: "PracticeDashboard",
    component: PracticeDashboard, //this is from the Practice Dashboard.
    isPrivate: true,
    exact: true,
  },
  {
    path: "/reason-for-visit",
    key: "ReasonForVisit",
    component: ReasonForVisit, //this is from the Practice Dashboard.
    isPrivate: true,
    exact: true,
  },
  {
    path: "/providers",
    key: "providers",
    component: Providers, //this is from the Practice Dashboard.
    isPrivate: true,
    exact: true,
  },
  {
    path: "/settings",
    key: "Settings",
    component: Settings, //this is from the settings.
    isPrivate: true,
    exact: true,
  },
  {
    path: "/appointment-list",
    key: "Appointments",
    component: Appointments,
    isPrivate: true,
    exact: true,
  },
  {
    path: "/practices",
    key: "Practices",
    component: Practices,
    isPrivate: true,
    exact: true,
  },
  {
    path: "/account-settings",
    key: "Account Settings",
    component: AccountSettings,
    isPrivate: true,
    exact: true,
  },
  {
    path: "/forgot-password",
    key: "Forgot Password",
    component: ForgotPassword,
    isPrivate: false,
    exact: true,
  },
  {
    path: "/reset-password/:id",
    key: "Reset Password",
    component: ResetPassword,
    isPrivate: false,
    exact: true,
  },
  {
    path: "/insurance",
    key: "insurance",
    component: Insurance,
    isPrivate: true,
    exact: true,
  },
  {
    path: "/template",
    key: "template",
    component: Template,
    isPrivate: true,
    exact: true,
  },
  {
    path: "/review",
    key: "review",
    component: Review,
    isPrivate: true,
    exact: true,
  },
  {
    path: "/schedules",
    key: "schedules",
    component: Schedules,
    isPrivate: true,
    exact: true,
  },
];

export default ROUTES;
