import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Typography } from "@/components/custom/Typography";
import Appearance from "./appearance";
import Widgets from "./widgets";
import { useGetGeneralSettingDataQuery } from "@/redux/practiceDashBoard/apiSlice";
import { useSelector } from "react-redux";
import Confirmation from "./confirmation";
import OthersSetting from "./others";
import Referrer from "./referrer";

const PracticeSettings = () => {
  const persistPracticeId = useSelector(
    (state: any) => state?.persisted?.practice?.persistPracticeDetails?.id
  );

  //getting data from db
  const { data: generalDetailsData = {}, isFetching } =
    useGetGeneralSettingDataQuery(
      {
        practiceId: persistPracticeId,
      },
      { skip: !persistPracticeId }
    );

  return (
    <div id="settings" className="bg-white m-2 md:m-5 flex flex-col">
      <Typography as="h1" className="text-black font-medium text-[24px] p-7 ">
        Settings
      </Typography>

      <Tabs defaultValue="appearance" className="w-full ">
        <div className=" px-5 ">
          <TabsList className=" gap-[40px h-11 bg-white text-gray-700 gap-10">
            <TabsTrigger
              value="appearance"
              className="relative max-w-[99px] text-[16px]  h-[42px]  data-[state=active]:after:content-[''] data-[state=active]:after:absolute  data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#2260EE]  "
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="widgets"
              className="relative max-w-[99px] text-[16px]  h-[42px]  data-[state=active]:after:content-[''] data-[state=active]:after:absolute  data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#2260EE]"
            >
              Widgets
            </TabsTrigger>
            <TabsTrigger
              value="confirmation"
              className="relative max-w-[99px] text-[16px]  h-[42px]  data-[state=active]:after:content-[''] data-[state=active]:after:absolute  data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#2260EE]"
            >
              Confirmation
            </TabsTrigger>

            <TabsTrigger
              value="others"
              className="relative max-w-[99px] text-[16px]  h-[42px]  data-[state=active]:after:content-[''] data-[state=active]:after:absolute  data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#2260EE]"
            >
              Others
            </TabsTrigger>
            <TabsTrigger
              value="referrer"
              className="relative max-w-[99px] text-[16px]  h-[42px]  data-[state=active]:after:content-[''] data-[state=active]:after:absolute  data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#2260EE]"
            >
              Referrer
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="border-t-2">
          <TabsContent value="appearance" className="mt-8 px-1">
            <Appearance
              generalDetailsData={generalDetailsData?.result}
              isFetching={isFetching}
            />
            {/** this is index from Appearance folder */}
          </TabsContent>
          <TabsContent value="widgets" className="mt-0">
            <Widgets generalDetailsData={generalDetailsData?.result} />
          </TabsContent>
          <TabsContent value="confirmation" className="mt-0">
            <Confirmation generalDetailsData={generalDetailsData?.result} />
          </TabsContent>
          <TabsContent value="others" className="mt-0">
            <OthersSetting generalDetailsData={generalDetailsData?.result} />
          </TabsContent>
          <TabsContent value="referrer" className="mt-0">
            <Referrer generalDetailsData={generalDetailsData?.result}/>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PracticeSettings;
