import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react/dist/iconify.js";
import logo_placeholder from "@/assets/logo-placeholder.png";
import { Typography } from "@/components/custom/Typography";
import SkeletonAppearancePreviewPhone from "@/components/custom/skeletons/SkeletonAppearancePreviewPhone";
import SkeletonAppearancePreviewLaptop from "@/components/custom/skeletons/SkeletonAppearancePreviewLaptop";

const AppearancePreview = ({ watch, isFetching }: any) => {
  const {
    name,
    phone,
    address,
    logo,
    brandColor,
    colorPrimary,
    colorSecondary,
  } = watch();

  return (
    <div id="AppearancePreview" className="flex gap-3 ">
      <Tabs
        defaultValue="phone"
        className="min-h-[68 0px] min-w-[685px] flex items-center flex-col"
      >
        {/* Toggle button */}

        <TabsList className="space-x-4 bg-transparent mb-4 flex justify-center">
          {/* Phone Tab */}
          <TabsTrigger
            value="phone"
            className="bg-gray-200 data-[state=active]:bg-[#7AA3FF] rounded-xl h-[54px] w-[57px] flex items-center justify-center"
          >
            <Icon
              icon="fluent:phone-status-bar-20-regular"
              style={{ height: "34px", width: "34px" }}
              className="text-white"
            />
          </TabsTrigger>

          {/* Laptop Tab */}
          <TabsTrigger
            value="laptop"
            className="bg-gray-200 data-[state=active]:bg-[#7AA3FF] rounded-xl h-[54px] w-[57px] flex items-center justify-center"
          >
            <Icon
              icon="uiw:laptop"
              style={{ height: "30px", width: "30px" }}
              className="text-white"
            />
          </TabsTrigger>
        </TabsList>

        {/* Phone Preview */}

        <TabsContent value="phone" className="w-[41%] mt-3">
          {isFetching ? (
            <SkeletonAppearancePreviewPhone />
          ) : (
            <div className="flex flex-col justify-center border-[10px] border-black rounded-[18px] shadow-2xl p-3 bg-blue-50 aspect-[2/3] max-w-[280px] w-full ">
              <div
                className="flex flex-col min-h-[165px] gap-1 items-center justify-center max-h-[150px] rounded-t-[4px] text-white px-2 py-4 overflow-hidden"
                style={{ background: brandColor ? brandColor : "#144092" }}
              >
                <div className="max-h-[85px] max-w-[75px] object-contain">
                  <img
                    src={logo ? logo : logo_placeholder}
                    alt="logo preview empty"
                    className=" object-cover bg-transparent"
                  />
                </div>

                {address ? (
                  <h3 className="w-full whitespace-normal break-words text-center mt-2 text-[14px]">
                    {address}
                  </h3>
                ) : (
                  <Typography as="p" className="text-white text-[14px]">
                    Display address
                  </Typography>
                )}
                {phone ? (
                  <Typography
                    as="p"
                    className="max-w-full whitespace-normal text-center text-[14px] text-white"
                  >
                    {phone}
                  </Typography>
                ) : (
                  <Typography as="p" className="text-white">
                    Practice phone
                  </Typography>
                )}
              </div>

              <div className="flex flex-col p-4 gap-3 bg-white">
                <Typography as="h2" className="font-bold text-gray-500">
                  Enter your Details
                </Typography>
                <label
                  htmlFor=""
                  className="text-gray-500 text-sm font-semibold"
                >
                  First Name
                </label>
                <div className="border-2 border-gray-300 p-2.5 rounded-[5px] text-gray-400 text-sm">
                  Enter First Name
                </div>
                <label
                  htmlFor=""
                  className="text-gray-500 text-sm font-semibold"
                >
                  Last Name
                </label>
                <div className="border-2 border-gray-300 p-2.5 rounded-[5px] text-gray-400 text-sm">
                  Enter Last Name
                </div>

                <div className="space-y-3 mt-3">
                  <Typography
                    as="h2"
                    className="font-bold text-xs text-gray-500"
                  >
                    Have you visited us before
                  </Typography>
                  <div
                    className={`border-2 border-gray-100 p-2.5 rounded-[5px] text-white text-center text-xs`}
                    style={{
                      background: colorPrimary ? colorPrimary : "#144092",
                      borderColor: colorPrimary ? colorPrimary : "#144092",
                    }}
                  >
                    New Patient
                  </div>
                  <div className="border-2 border-gray-300 p-2 rounded-[5px] text-gray-700 text-center text-xs">
                    Returning Patient
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Laptop Preview */}

        <TabsContent value="laptop" className="w-[72%] mt-2">
          {isFetching ? (
            <SkeletonAppearancePreviewLaptop />
          ) : (
            <div className="flex justify-center border-[10px] border-black w-full  rounded-[15px] shadow-2xl mt-5 p-4  bg-blue-50  aspect-[3/2] max-w-[490px]  overflow-hidden ">
              {/** leftside */}
              <div
                className="flex flex-col h-full w-[35%] items-center  border text-white  px-3 py-6 "
                style={{ background: brandColor ? brandColor : "#144092" }}
              >
                <div className="max-h-[80px] max-w-[85px]  object-contain text-center">
                  <img
                    src={logo ? logo : logo_placeholder}
                    alt="logo preview empty"
                    className="max-w-[85px] object-cover "
                  />
                </div>

                {name ? (
                  <Typography
                    as="p"
                    className=" max-w-full whitespace-normal break-words text-center text-[10px] mt-3 text-white"
                  >
                    {name}
                  </Typography>
                ) : (
                  <Typography as="p" className=" mt-3 text-[10px] text-white ">
                    Practice name
                  </Typography>
                )}
                {address ? (
                  <Typography
                    as="p"
                    className=" max-w-full whitespace-normal break-words text-center text-[10px] font-light text-white"
                  >
                    {address}
                  </Typography>
                ) : (
                  <Typography
                    as="p"
                    className="font-light text-[10px] text-white"
                  >
                    Display address
                  </Typography>
                )}
                {phone ? (
                  <Typography
                    as="p"
                    className="max-w-full whitespace-normal break-words  text-center text-[10px] font-light text-white"
                  >
                    {phone}
                  </Typography>
                ) : (
                  <Typography
                    as="p"
                    className="font-light text-[10px] text-white"
                  >
                    Practice phone
                  </Typography>
                )}
              </div>

              {/** rightside */}

              <div className="h-full flex flex-col min-w-[65%] border p-5 gap-2 bg-white overflow-hidden">
                <Typography
                  as="h1"
                  className="font-semibold text-gray-500 text-md mt-2"
                >
                  Enter your Details
                </Typography>
                <div className="flex gap-2 text-sm ">
                  <div className="flex flex-col gap-1 w-1/2 ">
                    <label
                      htmlFor=""
                      className="text-gray-500 text-xs font-semibold "
                    >
                      First Name
                    </label>
                    <div className="border border-gray-300 p-1 rounded-[2px] text-gray-400 text-[10px]">
                      Enter First Name
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-1/2">
                    <label
                      htmlFor=""
                      className="text-gray-500 text-xs font-semibold"
                    >
                      Last Name
                    </label>
                    <div className=" border border-gray-300 p-1 rounded-[2px] text-gray-400 text-[10px]">
                      Enter Last Name
                    </div>
                  </div>
                </div>
                <Typography
                  as="h2"
                  className="font-bold text-xs text-gray-500 mt-4"
                >
                  Have you visited us before
                </Typography>
                <div className="flex gap-3">
                  <div
                    className="min-w-[100px] max-w-[130px] border  p-1 rounded-[2px] text-white text-[10px] text-center"
                    style={{
                      background: colorPrimary ? colorPrimary : "#144092",
                      borderColor: colorPrimary ? colorPrimary : "#144092",
                    }}
                  >
                    New Patient
                  </div>
                  <div className="min-w-[100px] max-w-[130px] border border-gray-300 p-1 rounded-[2px] text-gray-500 text-[10px] text-center">
                    Returning Patient
                  </div>
                </div>
                <div className="flex w-full gap-1 items-center justify-start mt-3">
                  <div className="border-2 h-3 w-3 rounded-[3px]"></div>
                  <Typography as="h2" className="text-gray-500 text-xs">
                    Booking for Someone Else
                  </Typography>
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <Typography as="h2" className="text-xs">
                    Step 1 of 5
                  </Typography>
                  <div
                    className="w-[60px] rounded text-white text-center py-1 px-2 text-[10px]"
                    style={{
                      background: colorSecondary ? colorSecondary : "#144092",
                    }}
                  >
                    Next
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppearancePreview;
