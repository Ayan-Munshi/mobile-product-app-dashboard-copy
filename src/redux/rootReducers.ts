import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./practiceDashBoard/apiSlice";
import { practiceSlice } from "./practiceDashBoard/slice";

export const reducers=combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    practice:practiceSlice.reducer
})