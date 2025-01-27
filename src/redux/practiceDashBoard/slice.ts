import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  DashboardType,
  PersistPracticeDetailsType,
  UserDetailsType,
} from "./dashboardType";

export const practiceSlice = createSlice({
  name: "appointment",
  initialState: initialState as DashboardType,
  reducers: {
    persistPracticeDetails: (
      state: DashboardType,
      { payload }: { payload: PersistPracticeDetailsType }
    ) => {
      state.persistPracticeDetails = { ...payload };
    },
    persistToken: (state: DashboardType, { payload }: { payload: string }) => {
      state.token = payload;
    },
    persistUserDetails: (
      state: DashboardType,
      { payload }: { payload: UserDetailsType }
    ) => {
      state.userDetails = { ...payload };
    },
    resetUserDetails: (state: DashboardType) => {
      state.userDetails = {
        billing_name: "",
        city: "",
        country: "",
        email: "",
        phone: "",
        state: "",
        street_address: "",
        zipcode: "",
      };
    },
    resetToken: (state: DashboardType) => {
      state.isAuth = false;
      (state.persistPracticeDetails = {
        id: "",
        name: "",
        logo: "",
        phone: "",
        city: null,
        state: null,
        use_block_scheduling: null,
      }),
        (state.userDetails = {
          billing_name: "",
          city: "",
          country: "",
          email: "",
          phone: "",
          state: "",
          street_address: "",
          zipcode: "",
        });
      state.token = "";
    },
    resetAuth: (state: DashboardType) => {
      state.isAuth = false;
      (state.persistPracticeDetails = {
        id: "",
        name: "",
        logo: "",
        phone: "",
        city: null,
        state: null,
        use_block_scheduling: null,
      }),
        (state.userDetails = {
          billing_name: "",
          city: "",
          country: "",
          email: "",
          phone: "",
          state: "",
          street_address: "",
          zipcode: "",
        });
      state.token = "";
    },
    persistAuth: (state: DashboardType, { payload }: { payload: boolean }) => {
      state.isAuth = payload;
    },
  },
});

export const {
  persistPracticeDetails,
  persistToken,
  resetToken,
  persistUserDetails,
  persistAuth,
  resetAuth,
  resetUserDetails,
} = practiceSlice.actions;
