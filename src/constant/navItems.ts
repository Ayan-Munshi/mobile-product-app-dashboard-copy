import homeOutline from "@iconify/icons-basil/home-outline"; // Home icon
import settingsLinear from "@iconify/icons-solar/settings-linear"; // Settings icon

const isDev = import.meta.env.DEV;

export const navItems = [
  {
    label: "Home",
    path: "/dashboard",
    icon: homeOutline,
    width: "27px",
    weight: "",
  },
  {
    label: "Reason",
    path: "/reason-for-visit",
    icon: "hugeicons:analytics-01",
    width: "26px",
    weight: "",
  },
  {
    label: "Providers",
    path: "/providers",
    icon: "healthicons:doctor-outline",
    width: "29px",
    weight: "",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: settingsLinear,
    width: "26px",
    weight: "",
  },
  {
    label: "Appointment",
    path: "/appointment-list",
    icon: "fluent:form-28-regular",
    width: "26px",
    weight: "",
  },
  {
    label: "Practices",
    path: "/practices",
    icon: "healthicons:ambulatory-clinic-outline",
    width: "29px",
    weight: "700",
  },
  {
    label: "Insurance",
    path: "/insurance",
    icon: "streamline:insurance-hand",
    width: "29px",
    weight: "400",
  },
  {
    label: "Template",
    path: "/template",
    icon: "fluent:mail-template-20-regular",
    width: "29px",
    weight: "400",
  },
  {
    label: "Schedules",
    path: "/schedules",
    icon: "uim:schedule",
    width: "29px",
    weight: "400",
  },

  ...(isDev?[{
    label: "Review",
    path: "/review",
    icon: "material-symbols-light:reviews-outline",
    width: "29px",
    weight: "400",
  }]:[]),
];
