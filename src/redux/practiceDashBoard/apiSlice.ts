import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../apis/axiosBaseQuery";
import { UserLoginPayloadType, userSignupPayloadType } from "./dashboardType";
import { getFingerprint } from "@thumbmarkjs/thumbmarkjs";
import { RootState } from "../store";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let cachedFingerprint: string | null = null;
async function getFingerprintAsync(): Promise<string> {
  if (cachedFingerprint) {
    return cachedFingerprint;
  }

  const result = await getFingerprint(true);
  if (result && result.data) {
    delete result.data.screen;
  }

  cachedFingerprint = result.hash;
  return cachedFingerprint;
}

// Function to fetch client IP address
async function fetchClientIpAddress(): Promise<string | null> {
  try {
    const response = await fetch("https://api.ipify.org?format=json"); // Replace with your IP-fetching service if needed
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching client IP address:", error);
    return null;
  }
}

export const apiSlice = createApi({
  reducerPath: "appointmentApi",
  baseQuery: async (args, api, extraOptions) => {
    const fingerprint = await getFingerprintAsync();
    //Fetch client IP address asynchronously
    const clientIpAddress = await fetchClientIpAddress();
    return axiosBaseQuery({
      baseUrl: API_BASE_URL,
      prepareHeaders: (headers: any, { getState }) => {
        if (API_BASE_URL?.includes("8023-150-242-150-227")) {
          const token = (getState() as RootState).persisted.practice.token;
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }

        headers["X-Fingerprint"] = fingerprint;
        if (clientIpAddress) {
          headers["X-Client-IP"] = clientIpAddress;
        }
        headers["Content-Type"] = "application/json";
        return headers;
      },
    })(args, api, extraOptions);
  },

  tagTypes: [
    "ReasonForVisit",
    "SingleReasonForVisitDetails",
    "Provider",
    "SingleProvidersDetails",
    "Practice",
    "SinglePracticeDetails",
    "UserDetails",
    "AppointmentList",
    "SingleAppointmentDetails",
    "appointmentPmsConfirmedStatus",
    "getUserDetails",
    "template",
    "referrer",
  ], // Define tag types

  endpoints: (builder) => ({
    userLogin: builder.mutation<any, UserLoginPayloadType>({
      query: (data) => {
        return {
          url: "auth/login",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        { type: "Practice", id: "LIST" },
        { type: "getUserDetails", id: "USER" },
      ],
    }),

    forgotPassword: builder.mutation<any, { email: string }>({
      query: (data) => {
        return {
          url: "user/forgot-password",
          method: "POST",
          body: data,
        };
      },
    }),

    //Reset Password
    resetPassword: builder.mutation<
      any,
      { confirmPassword: string; link: string }
    >({
      query: (data) => {
        const finalData = {
          password: data?.confirmPassword,
          link: data?.link,
        };
        return {
          url: "user/reset-forgot-password",
          method: "POST",
          body: finalData,
        };
      },
    }),

    // Verify Reset Link
    vfyResetLink: builder.query<any, { id: string }>({
      query: (data) => {
        return {
          url: `user/verify-reset-link/${data?.id}`,
        };
      },
    }),

    // Sign up
    userSignup: builder.mutation<any, userSignupPayloadType>({
      query: (data) => {
        const finalData = {
          email: data?.email,
          password: data?.password,
          phone: data?.phone,
          billing_name: data?.billingname,
          street_address: data?.streetaddress,
          country: "USA",
          state: data?.practiceState?.label,
          city: data?.practiceCity,
          zipcode: data?.practiceZipCode,
        };
        return {
          url: "/auth/register",
          method: "POST",
          body: finalData,
        };
      },
    }),

    // Get reason for visit list
    getReasonForVisitList: builder.query({
      query: (data: any) => {
        const finalParams = {
          practice_id: data?.practiceId,
        };
        return {
          url: `reason-for-visit`,
          params: finalParams,
        };
      },
      providesTags: [{ type: "ReasonForVisit", id: "LIST" }],
    }),

    // Get single reason for visit
    getSingleReasonDetails: builder.query({
      query: (data: { practiceId: string; id: string }) => {
        return {
          url: `reason-for-visit/${data.id}`, // Using data.id directly in the URL
          params: { practice_id: data.practiceId }, // Including params directly
        };
      },
      providesTags: [{ type: "SingleReasonForVisitDetails", id: "LIST" }],
      keepUnusedDataFor: 0, // Immediately remove cached data
    }),

    // Add reason for visit
    createReason: builder.mutation({
      query: (data: any) => {
        const finalData = {
          practice_id: data?.practiceId,
          name: data?.reasonName,
          for_new_patients: data?.patientStatus?.includes("newPatient"),
          for_returning_patients: data?.patientStatus?.includes("returning"),
          operatories: data?.operatories,
          providers: data?.providers,
          app_duration: data?.duration || null,
          appointment_type_id: data?.appointmentType?.id
            ? data?.appointmentType?.id
            : null,
          blockout_types: data?.blockoutType || [],
          description: data?.description,
          min_age_limit: data?.patientAge?.minAge || null,
          max_age_limit: data?.patientAge?.maxAge || null,
          auto_sync: data?.autoSync?.length ? true : false,
          to_show_providers: data?.toShowProvider,
        };

        return {
          url: "reason-for-visit",
          method: "POST",
          body: finalData,
        };
      },
      invalidatesTags: [
        { type: "ReasonForVisit", id: "LIST" },
        { type: "SingleReasonForVisitDetails", id: "LIST" }, // Invalidate SingleReasonForVisitDetails cache
        { type: "Provider", id: "LIST" },
      ],
    }),

    // Update Reason for visit
    updateReason: builder.mutation({
      query: (data: any) => {
        const finalData = {
          practice_id: data?.practiceId,
          name: data?.reasonName,
          for_new_patients: data?.patientStatus?.includes("newPatient"),
          for_returning_patients: data?.patientStatus?.includes("returning"),
          operatories: data?.operatories,
          providers: data?.providers,
          app_duration: data?.duration || null,
          appointment_type_id: data?.appointmentType?.id
            ? data?.appointmentType?.id
            : null,
          blockout_types: data?.blockoutType
            ? data?.blockoutType?.filter((blockout: string) => blockout !== "")
            : [],
          description: data?.description,
          min_age_limit: data?.patientAge?.minAge || null,
          max_age_limit: data?.patientAge?.maxAge || null,
          auto_sync: data?.autoSync?.length ? true : false,
          is_active: data?.activeReason,
          to_show_providers: data?.toShowProvider,
          blockout_free: data?.blockoutType
            ? data?.blockoutType?.some((blockout: string) => blockout == "")
            : false,
        };
        return {
          url: `reason-for-visit/${data.id}`,
          method: "PUT",
          body: finalData,
        };
      },
      invalidatesTags: (data) => [
        { type: "SingleReasonForVisitDetails", id: data.id }, // Invalidate specific data
        { type: "ReasonForVisit", id: "LIST" },
        { type: "Provider", id: "LIST" },
      ],
    }),
    // Update Reason for visit status
    updateReasonStatus: builder.mutation({
      query: (data: any) => {
        const finalData = {
          practice_id: data?.practiceId,
          is_active: data?.activeReason,
        };
        return {
          url: `reason-for-visit/status/${data.id}`,
          method: "PUT",
          body: finalData,
        };
      },
      invalidatesTags: [{ type: "ReasonForVisit", id: "LIST" }],
    }),

    //reason for visit delete
    deleteReasonForVisit: builder.mutation<void, any>({
      query: (data) => ({
        url: `reason-for-visit/${data.reasonForVisitId}`, // Replace with your actual API endpoint and ID path
        method: "DELETE",
        params: { practice_id: data?.practiceId },
      }),
      invalidatesTags: [
        { type: "ReasonForVisit", id: "LIST" }, // Invalidate ReasonForVisit list cache
        { type: "SingleReasonForVisitDetails", id: "LIST" }, // Invalidate details cache
      ],
    }),

    //Get providers list
    getProviders: builder.query({
      query: (data) => {
        const finalParam = {
          practice_id: data?.practiceId,
        };
        return {
          url: "provider",
          params: finalParam,
        };
      },
      providesTags: [{ type: "Provider", id: "LIST" }],
    }),

    //Get single provider details
    getSingleProviderDetails: builder.query({
      query: (data) => {
        const finalParam = {
          practice_id: data?.practiceId,
        };
        return {
          url: `provider/${data?.providorId}`,
          params: finalParam,
        };
      },
      providesTags: [{ type: "SingleProvidersDetails", id: "LIST" }],
    }),

    //Update provider details
    updateProviderDetails: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data?.file || null);
        formData.append("practice_id", data?.practiceId || "");
        formData.append("display_name", data?.providerDisplayName || "");
        formData.append(
          "operatories",
          data?.operatories ? data?.operatories : ""
        );
        formData.append("bio", data?.bio || "");
        formData.append("gender", data?.gender || "");
        formData.append("id", data?.id || "");
        formData.append("role", data?.role?.id || "");
        formData.append("is_file_deleted", !data?.providerProfile ? "1" : "0");
        return {
          url: `provider/${data?.providorId}`,
          body: formData,
          method: "PUT",
        };
      },
      invalidatesTags: [
        { type: "Provider", id: "LIST" },
        { type: "SingleProvidersDetails", id: "LIST" },
      ],
    }),

    //Update provider blockout details
    updateProviderBlockoutDetails: builder.mutation({
      query: (data) => {
        const finalData = {
          practice_id: data?.practiceId,
          data: data?.providerBlockoutData,
          allow_schedule_overlap: data?.allowScheduleOverlap,
        };
        return {
          url: `provider/time-offs/${data?.providorId}`,
          body: finalData,
          method: "PUT",
        };
      },
      invalidatesTags: [
        { type: "Provider", id: "LIST" },
        { type: "SingleProvidersDetails", id: "LIST" },
      ],
    }),

    //Update provider Status
    updateProviderStatus: builder.mutation({
      query: (data) => {
        const finalData = {
          practice_id: data?.practiceId,
          provider_data: data?.providerData,
        };

        return {
          url: `provider/status`,
          body: finalData,
          method: "POST",
        };
      },
      invalidatesTags: [
        { type: "Provider", id: "LIST" },
        { type: "SingleProvidersDetails", id: "LIST" },
      ],
    }),

    // operatory list
    getOperetoriesList: builder.query({
      query: (data) => {
        const finalParam = {
          practice_id: data?.practiceId,
        };
        return {
          url: "operatory",
          params: finalParam,
        };
      },
    }),

    //Sync Data
    updatePracticeData: builder.mutation({
      query: (data) => {
        const finalData = {
          practice_id: data?.practiceId,
          module: data?.module,
        };
        return {
          url: "od/sync",
          body: finalData,
          method: "POST",
        };
      },
    }),
    //Get Appointment data
    getAppointmentTypeList: builder.query({
      query: (data) => {
        const finalParams = {
          practice_id: data?.practiceId,
        };
        return {
          url: "appointment/types",
          params: finalParams,
        };
      },
    }),

    // Get practice list
    getPracticeList: builder.query<void, void>({
      query: () => {
        return {
          url: `practice`,
        };
      },
      providesTags: [{ type: "Practice", id: "LIST" }],
    }),

    // Get setting general data
    getGeneralSettingData: builder.query({
      query: (data) => {
        return {
          url: `practice/${data?.practiceId}`,
        };
      },
      providesTags: [{ type: "SinglePracticeDetails", id: "LIST" }],
    }),
    // Add practice
    addPractice: builder.mutation({
      query: (data) => {
        const finalData = {
          name: data?.practiceName || null,
          street_address: data?.addressLine1 || null,
          city: data?.practiceCity || null,
          state: data?.practiceState?.label || null,
          country: data?.practiceCountry || null,
          zipcode: data?.practiceZipCode || null,
          email: data?.practiceEmail || null,
          phone: data?.practicePhone || null,
          customer_key: data?.odCustomerKey || null,
          description: data?.practiceDescription || null,
          // form_url: data?.formURL || null,
          server_tz: data?.servertimeZone?.value || null,
        };
        return {
          url: `practice`,
          body: finalData,
          method: "POST",
        };
      },
      invalidatesTags: [{ type: "Practice", id: "LIST" }],
      // keepUnusedDataFor: 0,
    }),
    //update setting general data
    updateGeneralSettingData: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("name", data.name);
        formData.append("practice_id", data?.practiceId);
        formData.append("phone", data?.phone || "");
        formData.append("display_address", data?.address || "");
        formData.append("description", data?.details || "");
        formData.append(
          "form_customization[brand_color]",
          data?.brandColor || "#000"
        );
        formData.append(
          "form_customization[button_color_1]",
          data?.colorPrimary || "#000"
        );
        formData.append(
          "form_customization[button_color_2]",
          data?.colorSecondary || "#000"
        );
        formData.append("is_file_deleted", !data?.logo ? "1" : "0");
        return {
          url: `practice/appearance/${data?.practiceId}`,
          body: formData,
          method: "PUT",
        };
      },
      invalidatesTags: [{ type: "SinglePracticeDetails", id: "LIST" }],
    }),

    //update Others data
    updateOthersSettingData: builder.mutation({
      query: (data) => {
        const formData = {
          is_accepting_patients: data?.isAcceptingPatients,
          to_verify_patient: data?.toVerifyPatient,
          to_show_insurances: data?.toShowInsurances,
          auto_sync_appointment: data?.autoSyncAppointment,
          use_block_scheduling: data?.useBlockScheduling,
          block_schedule_type: data?.blockScheduleType?.id,
        };
        return {
          url: `practice/others/${data?.practiceId}`,
          body: formData,
          method: "PUT",
        };
      },
      invalidatesTags: [
        { type: "SinglePracticeDetails", id: "LIST" },
        { type: "Practice", id: "LIST" },
      ],
    }),

    // Verify customer key
    verifyCustomerKey: builder.query({
      query: (odCustomerKey) => {
        return {
          url: `od/verify-key`,
          params: { customer_key: odCustomerKey },
        };
      },
      keepUnusedDataFor: 3600,
    }),

    // Get Appointment List
    getAppointmentList: builder.query({
      query: (data) => {
        const finalParam = {
          practice_id: data?.practiceId,
          ...(data?.isAccepted
            ? { is_accepted: data?.isAccepted }
            : {
                search: data?.searchValue,
                provider_id: data?.provider?.value,
                rfv_id: data?.reason?.value,
                sch_start_date: data?.scheduledStartDate,
                sch_end_date: data?.scheduledEndDate,
                apt_start_date: data?.apptTimeStartDate,
                apt_end_date: data?.apptTimeEndDate,
                offset: data?.offset,
                limit: data?.limit,
                apt_status: data?.status?.value,
                sort_by:
                  data?.sortBy === "dateSchedule"
                    ? "date_scheduled"
                    : data?.sortBy === "apptTime"
                    ? "apt_date"
                    : "",
                sort_by_value: data?.sortByValue || "",
                is_new_patient: data?.isNewPatient?.value || null,
                booked_through_us:
                  data?.bookedThroughUs === null ? null : data?.bookedThroughUs,
              }),
        };

        return {
          url: `appointment`,
          params: finalParam,
        };
      },
      providesTags: [{ type: "AppointmentList", id: "LIST" }],
    }),

    // Get Single Appointment Details
    getSingleAppointmentDetails: builder.query({
      query: (data) => {
        const finalParam = {
          practice_id: data?.practiceId,
        };
        return {
          url: `appointment/${data?.appointmentId}`,
          params: finalParam,
        };
      },
      providesTags: [{ type: "SingleAppointmentDetails", id: "Single" }],
    }),

    //Sync Appointment and patient
    syncAppointmentAndPatient: builder.mutation({
      query: (data) => {
        const formData = {
          practice_id: data?.practiceId,
        };
        return {
          url: `appointment/sync`,
          body: formData,
          method: "POST",
        };
      },
      invalidatesTags: [{ type: "AppointmentList", id: "LIST" }],
    }),

    //Update Appointment Status
    updateAptStatus: builder.mutation({
      query: (data) => {
        const formData = {
          practice_id: data?.practiceId,
          status: data?.status,
        };
        return {
          url: `appointment/status/${data?.aptId}`,
          body: formData,
          method: "PUT",
        };
      },
      invalidatesTags: [{ type: "AppointmentList", id: "LIST" }],
    }),

    // //Delete Appointment
    // deleteApt: builder.mutation({
    //   query: (data) => {
    //     const formData = {
    //       practice_id: data?.practiceId,
    //     };
    //     return {
    //       url: `appointment/declined/${data?.aptId}`,
    //       body: formData,
    //       method: "DELETE",
    //     };
    //   },
    //   invalidatesTags: [{ type: "AppointmentList", id: "LIST" }],
    // }),

    // unique form url check
    uniqueFormCheck: builder.query<void, any>({
      query: (data) => ({
        url: `form/check-url-unique`,
        method: "GET",
        params: { url: data?.url },
      }),
    }),

    // Get slots reason-for-visit wise
    getAppointmentSlotsList: builder.query({
      query: (data: any) => {
        const finalParams = {
          practice_id: data?.practiceId,
          reason_for_visit_id: data?.reasonForVisitId,
          start_date: data?.startDate,
          end_date: data?.endDate,
        };
        return {
          url: `appointment/slots`,
          params: finalParams,
        };
      },
      // providesTags: [{ type: "ReasonForVisit", id: "LIST" }],
    }),

    // create new patient
    createNewPatient: builder.mutation({
      query: (data: any) => {
        const finalParams = {
          practice_id: data?.practiceId,
          first_name: data?.firstName,
          last_name: data?.lastName,
          email: data?.email,
          dob: data?.dob,
          wireless_phone: data?.phone,
        };
        return {
          url: `patient`,
          method: "POST",
          body: finalParams,
        };
      },
      transformResponse: (response: any) => {
        return response?.result;
      },
    }),

    // Get patient details
    getpatientDetails: builder.query({
      query: (data: any) => {
        const finalParams = {
          practice_id: data?.practiceId,
          first_name: data?.firstName,
          last_name: data?.lastName,
          dob: data?.dob,
        };
        return {
          url: `patient/check`,
          params: finalParams,
        };
      },
    }),

    //get user details
    getUserDetails: builder.query({
      query: () => {
        return {
          url: "user",
        };
      },
      providesTags: [{ type: "getUserDetails", id: "USER" }],
    }),

    //update user settings data
    updateUserSettingData: builder.mutation({
      query: (data) => {
        const finalData = {
          email: data?.email,
          phone: data?.phone,
          billing_name: data.name,
          street_address: data.streetAddress,
          country: data.country,
          state: data.state,
          city: data.city,
          zipcode: data.zipCode,
        };

        return {
          url: `user`,
          body: finalData,
          method: "PUT",
        };
      },
      invalidatesTags: [{ type: "getUserDetails", id: "USER" }],
    }),

    // Sync appointment
    appointmentDelete: builder.mutation({
      query: (data: any) => {
        const finalParams = {
          practice_id: data?.practiceId || "",
        };

        return {
          url: `appointment/${data?.appointmentId}`,
          params: finalParams,
          method: "Delete",
        };
      },
      invalidatesTags: [{ type: "AppointmentList", id: "LIST" }],
    }),
    // practice scheduling link put
    updateSchedulingLink: builder.mutation<void, any>({
      query: (data) => ({
        url: `practice/scheduling-link/${data?.id}`, // Replace with your actual API endpoint and ID path
        method: "PUT",
        body: { form_url: data?.formUrl, use_form_url: data?.useCustomLink },
      }),
      invalidatesTags: [{ type: "SinglePracticeDetails", id: "LIST" }],
    }),

    // conversion tracking link put
    updateConversionTracking: builder.mutation<void, any>({
      query: (data) => ({
        url: `practice/conversion-tracking/${data?.id}`, // Replace with your actual API endpoint and ID path
        method: "PUT",
        body: {
          to_redirect: data?.conversionTracking,
          redirection_url: data?.redirectionurl,
          redirection_delay: data?.redirectiondelay,
        },
      }),
      invalidatesTags: [{ type: "SinglePracticeDetails", id: "LIST" }],
    }),

    // Get Patient Status Data
    getPatientStatusData: builder.query<void, any>({
      query: (data) => {
        const finalParam = {
          practice_id: data?.practiceId,
          start_date: data?.startDate,
          end_date: data?.endDate,
          booked_through_us:
            data?.bookedThroughUs === null ? null : data?.bookedThroughUs,
        };
        return {
          url: `analytics/patients`,
          method: "GET",
          params: finalParam,
        };
      },
    }),
    // Get Appointment status data
    getAppointmentStatusData: builder.query<void, any>({
      query: (data) => {
        const finalParam = {
          practice_id: data?.practiceId,
          start_date: data?.startDate,
          end_date: data?.endDate,
          booked_through_us:
            data?.bookedThroughUs === null ? null : data?.bookedThroughUs,
        };
        return {
          url: `analytics/appointments`,
          method: "GET",
          params: finalParam,
        };
      },
    }),
    // Sync appointment
    syncAppointment: builder.mutation({
      query: (data: any) => {
        const finalData = {
          practice_id: data?.practiceId || "",
          pms_pat_num: data?.pmsPatNum || null,
          is_new_patient: data?.isNewPatient || "",
          pms_op_num: data?.pmsOpNum || "",
          pms_prov_num: data?.pmsProvNum || "",
          apt_date: data?.aptDate || null,
          start_time: data?.startTime || null,
        };
        return {
          url: `appointment/${data?.appointmentId}`,
          body: finalData,
          method: "PUT",
        };
      },
      invalidatesTags: [
        { type: "AppointmentList", id: "LIST" },
        { type: "SingleAppointmentDetails", id: "Single" },
      ],
    }),
    // Sync appointment
    authLogout: builder.mutation({
      query: () => {
        return {
          url: `auth/logout`,
          method: "POST",
        };
      },
      invalidatesTags: [{ type: "Practice", id: "LIST" }],
    }),

    //appointment PMS Confirmation Status
    aptPMSCnfStatus: builder.mutation({
      query: (data) => {
        const finalData = {
          practice_id: data?.practiceId,
          apt_status_arr: data?.aptConfirmationStausIds || [],
        };
        return {
          url: `appointment/confirmed-status`,
          method: "PUT",
          body: finalData,
        };
      },
      invalidatesTags: (data) => [
        { type: "appointmentPmsConfirmedStatus", id: data?.practiceId },
        { type: "AppointmentList", id: "LIST" },
      ],
    }),

    //Practice Confirmation
    practiceConfirmation: builder.mutation({
      query: (data) => {
        const finalData = {
          send_text_time: data?.confirmationTime,
          cancelled_status_id: data?.cancelStatus?.id || "",
          confirmed_status_id: data?.confirmStatus?.id || "",
          to_send_text:
            data?.confirmationText === "Send confirm prompt"
              ? true
              : false || false,
        };
        return {
          url: `practice/confirmation/${data?.practiceId}`,
          method: "PUT",
          body: finalData,
        };
      },
      invalidatesTags: [{ type: "SinglePracticeDetails", id: "LIST" }],
    }),

    //Appointment PMS Confirmation Status
    appointmentPmsConfirmationStatus: builder.query({
      query: (data) => {
        return {
          url: `appointment/pms-confirm-status`,
          params: { practice_id: data?.practiceId },
        };
      },
    }),

    //Appointment PMS Confirmed Status
    appointmentPmsConfirmedStatus: builder.query({
      query: (data) => {
        return {
          url: `appointment/pms-confirm-status`,
          params: { practice_id: data?.practiceId, is_confirmed: "1" },
        };
      },
      providesTags: (data) => [
        { type: "appointmentPmsConfirmedStatus", id: data?.practiceId },
      ],
    }),
    //Blockout Type
    getBlockoutTypeList: builder.query({
      query: (data) => {
        return {
          url: `definition/blockout-type`,
          params: { practice_id: data?.practiceId },
        };
      },
    }),
    //Reset user password
    resetUserPassword: builder.mutation({
      query: (data) => {
        const finalData = {
          current_password: data?.currentPassword,
          new_password: data?.newPassword,
        };
        return {
          url: `user/update-password`,
          body: finalData,
          method: "PUT",
        };
      },
    }),

    //update Insurance information
    updateInsuranceInformation: builder.mutation({
      query: (data) => {
        const formData = {
          insurances: data?.selectedInsurance,
        };
        return {
          url: `practice/others/${data?.practiceId}`,
          body: formData,
          method: "PUT",
        };
      },
    }),

    // get template list
    getTemplateList: builder.query({
      query: (data) => {
        const finalParams = {
          practice_id: data?.practiceId,
        };
        return {
          url: `template`,
          params: finalParams,
        };
      },
    }),

    // get email and text template
    getEmailndTextTemplate: builder.query({
      query: (data) => {
        const finalParams = {
          practice_id: data?.practiceId,
        };
        return {
          url: `template/${data?.templateName}`,
          params: finalParams,
        };
      },
      providesTags: [{ type: "template", id: "single" }],
    }),

    //update Text Template
    updateTextTemplate: builder.mutation({
      query: (data) => {
        const formData = {
          practice_id: data?.practiceId,
          template_name: data?.templateName,
          body: data?.textBody,
        };
        return {
          url: `template/text`,
          body: formData,
          method: "PUT",
        };
      },
      invalidatesTags: [{ type: "template", id: "single" }],
    }),

    //update Email Template
    updateEmailTemplate: builder.mutation({
      query: (data) => {
        const formData = {
          practice_id: data?.practiceId,
          template_name: data?.templateName,
          subject: data?.emailSubject,
          body: data?.emailBody,
        };
        return {
          url: `template/email`,
          body: formData,
          method: "PUT",
        };
      },
      invalidatesTags: [{ type: "template", id: "single" }],
    }),

    // get referrer list
    getReferrerList: builder.query({
      query: (data) => {
        const finalParam = {
          practice_id: data?.practiceId,
        };
        return {
          url: `referrer`,
          params: finalParam,
        };
      },
      providesTags: [{ type: "referrer", id: "list" }],
    }),

    //Add referrer
    addReferrer: builder.mutation({
      query: (data) => {
        const finalData = {
          practice_id: data?.practiceId,
          name: data?.referrerName,
          source_type: data?.sourceType,
        };

        return {
          url: `referrer`,
          method: "POST",
          body: finalData,
        };
      },
      invalidatesTags: [{ type: "referrer", id: "list" }],
    }),

    //Update referrer
    updateReferrer: builder.mutation({
      query: (data) => {
        const finalData = {
          practice_id: data?.practiceId,
          name: data?.referrerName,
          source_type: data?.sourceType,
        };

        return {
          url: `referrer/${data?.referrerId}`,
          method: "PUT",
          body: finalData,
        };
      },
      invalidatesTags: [{ type: "referrer", id: "list" }],
    }),

    //Delete referrer
    deleteReferrer: builder.mutation({
      query: (data) => {
        return {
          url: `referrer/${data?.referrerId}`,
          method: "DELETE",
          params: { practice_id: data?.practiceId },
        };
      },
      invalidatesTags: [{ type: "referrer", id: "list" }],
    }),

    // schedule list
    getScheduleList: builder.query({
      query: (data) => ({
        url: "/schedule",
        method: "GET",
        params: {
          practice_id: data.practice_id, //'1700230c-394b-4a8a-8aa5-55c03f849ef7'
          date: data.date,
        },
      }),
    }),
  }),
});

export const {
  useCreateReasonMutation,
  useGetOperetoriesListQuery,
  useGetProvidersQuery,
  useUpdateProviderStatusMutation,
  useUserLoginMutation,
  useVfyResetLinkQuery,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useUserSignupMutation,
  useGetSingleProviderDetailsQuery,
  useUpdateProviderDetailsMutation,
  useUpdatePracticeDataMutation,
  useGetAppointmentTypeListQuery,
  useGetGeneralSettingDataQuery,
  useUpdateOthersSettingDataMutation,
  useUpdateGeneralSettingDataMutation,
  useUpdateReasonMutation,
  useUpdateReasonStatusMutation,
  useGetReasonForVisitListQuery,
  useLazyGetSingleReasonDetailsQuery,
  useGetSingleReasonDetailsQuery,
  useLazyVerifyCustomerKeyQuery, // lazy is given by RTK
  useAddPracticeMutation,
  useGetPracticeListQuery,
  useGetAppointmentListQuery,
  useLazyGetAppointmentListQuery,
  useSyncAppointmentAndPatientMutation,
  useGetSingleAppointmentDetailsQuery,
  useUpdateAptStatusMutation,
  useDeleteReasonForVisitMutation,
  useUniqueFormCheckQuery,
  useCreateNewPatientMutation,
  useGetAppointmentSlotsListQuery,
  useGetpatientDetailsQuery,
  useUpdateSchedulingLinkMutation,
  useUpdateConversionTrackingMutation,
  useLazyGetpatientDetailsQuery,
  useGetUserDetailsQuery,
  useUpdateUserSettingDataMutation,
  useSyncAppointmentMutation,
  useAppointmentDeleteMutation,
  useGetPatientStatusDataQuery,
  useGetAppointmentStatusDataQuery,
  useAuthLogoutMutation,
  useAppointmentPmsConfirmationStatusQuery,
  useAptPMSCnfStatusMutation,
  usePracticeConfirmationMutation,
  useAppointmentPmsConfirmedStatusQuery,
  useResetUserPasswordMutation,
  useUpdateInsuranceInformationMutation,
  useGetBlockoutTypeListQuery,
  useUpdateProviderBlockoutDetailsMutation,
  useGetTemplateListQuery,
  useGetEmailndTextTemplateQuery,
  useUpdateEmailTemplateMutation,
  useUpdateTextTemplateMutation,
  useGetReferrerListQuery,
  useAddReferrerMutation,
  useUpdateReferrerMutation,
  useDeleteReferrerMutation,
  useGetScheduleListQuery
} = apiSlice;
