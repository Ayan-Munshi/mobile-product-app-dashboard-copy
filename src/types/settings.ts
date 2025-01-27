export type OthersInputFormValuesType = {
  isAcceptingPatients: boolean;
  toVerifyPatient: boolean;
  toShowInsurances: boolean;
  useBlockScheduling: boolean;
  autoSyncAppointment: boolean;
  blockScheduleType: { id: string; label: string };
};

export type AddEditReferrerPayloadType = {
  referrerName: string;
  sourceType: { id: string; label: string };
};

export type getReferrerDetails = {
  id: number;
  name: string;
  source_type: string;
  is_active?: boolean;
};

type FormCustomization = {
  brand_color: string;
  button_color_1: string;
  button_color_2: string;
};

export type PracticeSettingsDetailsDataType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  logo: string;
  to_send_text: boolean;
  send_text_time: string;
  to_verify_patient: boolean;
  display_address: string;
  description: string;
  form_customization: FormCustomization;
  use_form_url: boolean;
  form_url: string;
  to_redirect: boolean;
  redirection_url: string;
  server_tz: string;
  redirection_delay: number;
  is_accepting_patients: boolean;
  insurances: string[];
  is_server_live: boolean;
  to_show_insurances: boolean;
  confirmed_status_id: string;
  confirmed_status_name: string;
  cancelled_status_id: string;
  cancelled_status_name: string;
  use_block_scheduling: boolean;
  block_schedule_type: string;
};
