import { resetAuth, resetToken } from "@/redux/practiceDashBoard/slice";
import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { AppDispatch } from "@/redux/store";

type AppProps = {
  baseUrl: string;
  prepareHeaders?: (headers: any, { getState }: { getState: Function }) => any;
};

const axiosBaseQuery =
  ({
    baseUrl,
    prepareHeaders,
  }: AppProps): BaseQueryFn<
    { url: string; method?: string; body?: any; params?: any },
    unknown,
    { status: number; message: string }
  > =>
  async (
    { url, method = "GET", body, params },
    { getState, dispatch }: { getState: Function; dispatch: AppDispatch }
  ) => {
    try {
      const headers = prepareHeaders ? prepareHeaders({}, { getState }) : {};
      if (body instanceof FormData) {
        delete headers["Content-Type"];
      }
      // Make the API request using axios
      const response = await axios({
        url: `${baseUrl}/${url}`,
        method,
        data: body,
        params,
        headers,
        withCredentials: true,
      });

      return { data: response.data };
    } catch (error: any) {
      if (error?.response?.data?.status_code === 401) {
        dispatch(resetToken());
        dispatch(resetAuth());
      }

      const errorData = error?.response?.data || { message: "Unknown error" };
      return {
        error: errorData,
      };
    }
  };

export default axiosBaseQuery;
