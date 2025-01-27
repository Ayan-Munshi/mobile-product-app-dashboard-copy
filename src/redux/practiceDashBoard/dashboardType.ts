export type DashboardType = {
  persistPracticeDetails: PersistPracticeDetailsType;
  token: string;
  isAuth: boolean;
  userDetails: UserDetailsType;
};

export type PersistPracticeDetailsType = {
  id: string;
  name: string;
  logo: string;
  phone: string;
  city: string | null;
  state: string | null;
  use_block_scheduling: boolean | null;
};
export type UserDetailsType = {
  city: string;
  billing_name: string;
  country: string;
  email: string;
  street_address: string;
  state: string;
  zipcode: string;
  phone: string;
};
export type UserLoginPayloadType = {
  email: string;
  password: string;
};
export type userSignupPayloadType = {
  email: string;
  password: string;
  phone: number;
  billingname: string;
  streetaddress: string;
  practiceCountry: string;
  practiceState: { label: string; value: string };
  practiceZipCode: number;
  practiceCity: string;
};
