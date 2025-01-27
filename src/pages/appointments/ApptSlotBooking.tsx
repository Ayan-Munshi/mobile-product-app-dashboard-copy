import { Input } from "@/components/ui/input";
import {
  useGetAppointmentSlotsListQuery,
  useGetSingleReasonDetailsQuery,
} from "@/redux/practiceDashBoard/apiSlice";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useSelector } from "react-redux";
import doctor_avatar from "../../assets/doctor_avatar.png";
import moment from "moment";
import { useEffect, useState } from "react";
import generateTimeSlots from "@/constant";
import { Calendar } from "./Calendar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Typography } from "@/components/custom/Typography";

type AppProps = {
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: () => any;
  setValue: UseFormSetValue<any>;
  appointmentDetails: any;
  date: Date | null | undefined;
  setDate: (data: Date | null | undefined) => void;
};

//*** Main return function

const ApptSlotBooking = ({
  control,
  watch,
  date,
  setDate,
  appointmentDetails,
}: AppProps) => {
  // State to store the current selected month showing on the calendar
  const [currentShowingMonth, setCurrentShowingMonth] = useState<Date>(
    new Date()
  );
  // State to store an array of available dates
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  // State to store the available final slots
  const [finalSlots, setFinalSlots] = useState([]);
  const [allAppointmentSlots, setAllAppointmentsSlots] = useState<any>([]);
  // Retrieves the user's current time zone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentMonth = moment().format("MM");
  // Retrieves the practice ID from the Redux store's persisted state
  const persistPracticeId = useSelector(
    (state: any) => state?.persisted?.practice?.persistPracticeDetails?.id
  );
  const startOfMonth = moment(currentShowingMonth).format("YYYY-MM-DD");
  // Formats the current month to the first day of the month in "YYYY-MM-DD" format
  const endOfMonth = moment(currentShowingMonth)
    .endOf("month")
    .format("YYYY-MM-DD");

  const { providerDetails, bookingSlotDetails } = watch();

  // Fetches details for a single reason based on practiceId and rfv_id, only if rfv_id is defined.
  const { data: singleReasonDetails = {} } = useGetSingleReasonDetailsQuery(
    {
      practiceId: persistPracticeId,
      id: appointmentDetails?.rfv_id,
    },
    {
      skip: !appointmentDetails?.rfv_id, // Only call when rfv_id is defined
    }
  );

  // Fetches available appointment slots based on practiceId, reasonForVisitId, and date range (start and end of month).
  const {
    data: appointmentSlotsDetails = {},
    error: apiSlotsError,
    isFetching,
  } = useGetAppointmentSlotsListQuery(
    {
      practiceId: persistPracticeId,
      reasonForVisitId: appointmentDetails?.rfv_id,
      startDate: startOfMonth?.includes(currentMonth)
        ? moment(new Date()).format("YYYY-MM-DD")
        : startOfMonth,
      endDate: endOfMonth,
    },
    {
      skip:
        !appointmentDetails?.rfv_id ||
        !persistPracticeId ||
        !endOfMonth ||
        !startOfMonth,
      // !providerDetails?.provider_display_name,
    }
  );

  // Filters and adds a "Choose any" provider option if there is more than one provider available.
  const filteredProviders =
    singleReasonDetails?.result?.providers &&
    singleReasonDetails?.result?.providers?.length > 1
      ? [
          ...singleReasonDetails?.result?.providers,
          {
            pms_prov_num: 0,
            profile_pic: "",
            provider_id: "",
            provider_display_name: "Choose any",
          },
        ]
      : [...(singleReasonDetails?.result?.providers || [])];

  useEffect(() => {
    if (
      allAppointmentSlots?.length &&
      providerDetails?.provider_display_name
    ) {
      const filterDate = allAppointmentSlots?.filter((slots: any) => {
        return (
          slots?.DateTimeEnd?.split(" ")[0] ===
          moment(date).format("YYYY-MM-DD")
        );
      });

      if (filterDate?.length) {
        const timeSlots = getSlots(filterDate);

        setFinalSlots(timeSlots);
      }
    } else {
      setFinalSlots([]);
    }
  }, [
    moment(date).format("YYYY-MM-DD"),
    startOfMonth,
    allAppointmentSlots,
    providerDetails?.provider_display_name,
  ]);

  // Slots error
  useEffect(() => {
    if (apiSlotsError) {
      setFinalSlots([]);
      setAllAppointmentsSlots([]);
    }
  }, [apiSlotsError]);

  // Calendar month change
  useEffect(() => {
    if (appointmentSlotsDetails?.result?.length) {
      setAllAppointmentsSlots([...appointmentSlotsDetails?.result]);
    }
  }, [appointmentSlotsDetails?.result]);

  // colect available dates
  useEffect(() => {
    if (allAppointmentSlots) {
      const filterDates = allAppointmentSlots?.map((slot: any) => {
        const [dateString, timeString] = slot.DateTimeStart.split(" ");
        return new Date(`${dateString}T${timeString}Z`);
      });

      const earliestDate = new Date(
        Math.min(...filterDates.map((date: any) => date.getTime()))
      );

      setAvailableDates(filterDates);
      setDate(earliestDate);
    } else {
      setFinalSlots([]);
    }
  }, [allAppointmentSlots, providerDetails?.provider_display_name]);

  // Get slots for single day
  function getSlots(filterDate: any) {
    const timeSlots: any = generateTimeSlots({
      appointments: filterDate?.filter((slot: any) => {
        // Check for provider ID and match date
        const isMatchingProvider =
          providerDetails?.pms_prov_num !== 0
            ? slot?.ProvNum === providerDetails?.pms_prov_num
            : true;

        return isMatchingProvider;
      }),
      gapMinutes: singleReasonDetails?.result?.final_duration,
    });
    return timeSlots;
  }

  // *** main return
  return (
    <div className="px-7 py-6">
      {/* <DynamicHeading text="Please select provider" hType="h1" className="" /> */}
      <Typography
        as="h4"
        className="text-xl font-medium text-[#373737] text-[20px]"
      >
        Please select provider
      </Typography>
      <div className="flex flex-wrap gap-6 mt-5">
        {filteredProviders?.map((provider: any, index: number) => (
          <Controller
            key={provider?.provider_id || index}
            name="providerDetails"
            control={control}
            rules={{
              required: "Please select a Provider",
              validate: (value) => {
                if (!value?.provider_display_name) {
                  return "Please select a Provider";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <div
                className={`flex border-[1px] min-h-[2rem] px-3 py-1 gap-3 lg:flex-[0_0_47%] flex-[1_0_100%] items-center cursor-pointer rounded
      ${
        field.value?.provider_display_name === provider?.provider_display_name
          ? "bg-button-clr-700 text-white border-button-clr-700"
          : "bg-white text-black border-[#00000070]"
      }`}
                onClick={() => field.onChange(provider)} // Use field.onChange
              >
                {/* Hidden Radio Input */}
                <Input
                  type="radio"
                  value={provider?.provider_display_name}
                  className="hidden"
                />

                {/* Optional Image */}
                <img
                  src={provider?.prov_profile_pic || doctor_avatar}
                  className="rounded-full bg-gray-300 max-w-[55px] mr-2 aspect-square"
                  alt="Provider"
                />

                {/* Provider Name */}
                <span>{provider?.provider_display_name}</span>
              </div>
            )}
          />
        ))}
      </div>
      {providerDetails?.provider_display_name ? (
        <div id="slots" className="h-full mt-5">
          <div>
            <div className="flex">
              <Typography
                as="h4"
                className="text-xl font-medium text-[#373737] text-[20px]"
              >
                Please select a slot
              </Typography>
              {/* <p className="text-[24px] w-[50%]"></p> */}
            </div>

            <div className="flex sm:flex-nowrap [@media(max-width:592px)]:flex-wrap flex-nowrap  mt-5  ">
              <div className="box-border border-r-[1px]  border-gray-300 pr-6  [@media(max-width:522px)]:border-none sm:w-[80%] md:w-[55%] lg:w-[80%] w-[100%]">
                <Calendar
                  mode="single"
                  selected={date ? date : undefined} // Date | undefined
                  onSelect={setDate}
                  className="rounded-md border-none font-semibold text-[25px]"
                  setCurrentMonth={setCurrentShowingMonth}
                  availableDates={availableDates}
                />
                <p className="text-center">Time zone</p>
                <p className="text-center">{timeZone}</p>
              </div>
              <div className="w-[60%]">
                <p className="text-center">
                  {" "}
                  {moment(date)?.format("dddd, MMMM D")}
                </p>

                <div className="mt-5 flex  flex-col gap-3 box-border  overflow-y-auto max-h-[365px] overflow-x-hidden theme-scroll  sm:w-[80%] w-[100%] md:w-[90%]">
                  {isFetching ? (
                    [...Array(5)].map((_, index) => (
                      <Skeleton
                        key={index}
                        height={50}
                        className="w-3/5 ml-[20%] rounded-md"
                      />
                    ))
                  ) : finalSlots && finalSlots?.length > 0 ? (
                    finalSlots?.map((slot: any) => (
                      <Controller
                        key={slot?.slotStart}
                        name="bookingSlotDetails"
                        control={control}
                        render={({ field }) => (
                          <div
                            className={`border border-[#616163] rounded-lg py-2.5 px-4 text-center box-border cursor-pointer whitespace-nowrap w-[60%] mx-auto ${
                              bookingSlotDetails?.slotStart === slot?.slotStart
                                ? "bg-button-clr-700 text-white"
                                : "bg-white text-black"
                            }`}
                            onClick={() => field.onChange(slot)} // No need to spread {...field} here
                          >
                            <span className="pl-2">{slot?.slotStart}</span>
                          </div>
                        )}
                      />
                    ))
                  ) : apiSlotsError?.message?.includes(
                      "The office's eConnector is not running"
                    ) ||
                    apiSlotsError?.message?.includes(
                      "Error. This is most likely a version issue"
                    ) ? (
                    <div className="text-center text-[18px] font-md">
                      <p>
                        Please turn on your e-connector <br />
                        Contact us for help.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-2 bg-red-200 border-2 border-[#dc7272] max-w-max mx-auto mt-8 px-5 text-red-800">
                      No Slots available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ApptSlotBooking;
