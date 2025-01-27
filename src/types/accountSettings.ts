export type AccountSettingsInputTypes = {
  name: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
};

export type PasswordChangeTypes = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type comparedObjectType = {
  city: string;
  country: string;
  email: string;
  name: string;
  phone: string;
  state: string;
  streetAddress: string;
  zipCode: string;
};
