export type AppointmentFilterType = {
  searchValue: string;
  scheduledStartDate: string | null;
  scheduledEndDate: string | null;
  apptTimeStartDate: string | null;
  apptTimeEndDate: string | null;
  provider: {
    value: string;
    label: string;
  };
  reason: {
    value: string;
    label: string;
  };
  status: {
    value: string;
    label: string;
  };
  isNewPatient: {
    value: string | null;
    label: string;
  };
  aptBookingStatus: {
    value: string | null;
    label: string;
  };
};

export type AppointmentListType = {
  id: string;
  pms_apt_status: string;
  pms_apt_num: number;
  booked_through_us: boolean;
  app_status: string;
  pms_confirmed_str: string | null;
  temp_details: any | null;
  start_time: string;
  is_new_patient: boolean;
  date_scheduled: string;
  apt_date: string | null;
  pat_first_name: string;
  pat_last_name: string;
  reason_for_visit: string | null;
  profile_pic: string | null;
  prov_first_name: string;
  prov_last_name: string;
  is_synced: boolean;
  is_confirmed: boolean;
  is_deleted: number;
};

export type AppointmentDataType = {
  schedule: string;
  newReturning: string;
  provider: string;
  patient: {
    firstName: string;
    lastName: string;
    profilePic?: string | undefined;
  };
  reason: string;
  aptTime: {
    time: string;
    date: string | null;
  };
  status: string;
  id: string;
};

export type OnSubmitDataType = {
  providerDetails: {
    pms_prov_num: null | string;
    provider_id: string;
    provider_display_name: string;
  };
  bookingSlotDetails: {
    slotStart: string;
    provNum: string | number;
    opNum: string | number;
  };
};

export type AppointmentDeleteResponseType = {
  success: boolean;
  message: string;
  status_code: number;
};

export type AppointmentDeleteErrorType = {
  error: {
    status: number;
    message: string;
  };
};

// export type Appointment = {
//   id: string;
//   name: string;
//   date: string;
//   status: string;
//   provider: string;
// };

export type FilterStateType = {
  searchValue: string;
  scheduledStartDate: string | null;
  scheduledEndDate: string | null;
  apptTimeStartDate: string | null;
  apptTimeEndDate: string | null;
  provider: { value: string; label: string };
  reason: { value: string; label: string };
  status: { value: string; label: string };
  isNewPatient: { value: string | null; label: string };
};

export type AppointmentDetailsType = {
  app_status: string;
  apt_date: string;
  date_scheduled: string;
  id: string;
  is_new_patient: boolean;
  is_synced?: boolean;
  is_confirmed?: boolean;
  is_deleted?: number;
  message: string;
  op_abbr: string;
  pat_dob: string;
  pat_email: string;
  referrer_name: string;
  pat_first_name: string;
  pat_last_name: string;
  pat_wireless_phone: string;
  pms_apt_num: number;
  pms_apt_status: string;
  pms_confirmed_str: string;
  prov_first_name: string;
  prov_last_name: string;
  prov_profile_pic: string | null;
  reason_for_visit: string | null;
  rfv_id: string | null;
  pat_profile_pic: string | null;
  start_time: string;
  temp_details: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
  } | null;
};

export type SyncAppointmentDataType = {
  practiceId: string | number;
  pmsPatNum: string | undefined;
  isNewPatient: boolean;
  pmsOpNum: string | undefined;
  pmsProvNum: string | undefined;
  aptDate: string | null;
  startTime: string | null;
  appointmentId: string | undefined;
};

export type appointmentTableHeadersType = {
  patient: string;
  newReturning: string;
  provider: string;
  schedule: string;
  reason: string;
  aptTime: string;
  status: string;
  label: string;
};

export type ReasonForVisitItemType = {
  id: string;
  name: string;
  pms_first_name: string;
  pms_last_name: string;
};

export type FormDataType = {
  providerDetails?: {
    provider_display_name?: string;
    pms_prov_num?: number;
    profile_pic?: string;
    provider_id?: string;
  };
  bookingSlotDetails?: {
    slotStart?: string;
  };
  [key: string]: any;
};

// export type AppointmentTableHeadersValueType = {
//   schedule: string;
//   newReturning: string;
//   provider: string;
//   date: string;
//   time: string;
//   // patient: {
//   firstName: string;
//   lastName: string;
//   profilePic: string | undefined;
//   // };
//   reason: string;
//   aptTime: string | { time: string; date: string | null };
//   status: string;
//   id: string;
//   value: string;
//   label: string; // Ensure 'label' is here
// };
