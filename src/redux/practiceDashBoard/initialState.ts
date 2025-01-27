import { DashboardType } from "./dashboardType";

export const initialState: DashboardType = {
  persistPracticeDetails: {
    id: "",
    name: "",
    logo: "",
    phone: "",
    city: null,
    state: null,
    use_block_scheduling:null
  },
  userDetails: {
    billing_name: "",
    city: "",
    country: "",
    email: "",
    phone: "",
    state: "",
    street_address: "",
    zipcode: "",
  },
  token: "",
  isAuth: false
};
