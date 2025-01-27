import ReactColorPicker from "@/components/custom/ReactColorPicker";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import add_photo_placeholder from "@/assets/add_photo_placeholder.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import "react-toastify/dist/ReactToastify.css";
import { Typography } from "@/components/custom/Typography";
import FormInputFieldAlt from "@/components/custom/FormInputFieldAlt";

type AppProps = {
  register: any;
  watch: any;
  setValue: any;
  objcompare: any;
  handleUpdateGeneralSetting: any;
  isFetching: boolean;
};

const AppearanceFormDetails = ({
  register,
  watch,
  setValue,
  objcompare,
  handleUpdateGeneralSetting,
}: AppProps) => {
  const { logo, details, brandColor, colorPrimary, colorSecondary } = watch();

  //updating data into db

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateGeneralSetting(); //sending props to the api in apiSlice to perform the put request for update
  };

  // image file handling function
  const handleFileInputClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    //Left side
    <div id="AppearanceFormDetails" className="">
      <Typography as="h1" className="text-xl text-[#535353] font-medium">
        General
      </Typography>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-start mt-10"
      >
        <div className="flex w-[80%]">
          <div className="flex flex-col">
            <label className="text-md text-[#535353] font-medium mb-2 ">
              Practice Logo
            </label>
            <p className="text-sm text-[#3F3F3FBF] mt-2 mr-5 ">
              This webpage requires data that you entered earlier in order to be
              properly displayed.
            </p>
          </div>
          <div className="flex items-center">
            <Avatar className="flex justify-center h-[60px] w-[60px] border-none outline outline-2 outline-gray-200">
              <AvatarImage
                src={logo ? logo : add_photo_placeholder}
                alt="preview logo"
                className="max-w-[50px] object-contain"
              />
            </Avatar>

            <div className=" flex ml-[20px] ">
              <button
                type="button"
                className="px-2 text-gray-500 font-bold rounded-[7px]  min-w-[70px]"
                onClick={handleFileInputClick}
                aria-label={logo ? "Update Logo" : "Add Logo"}
              >
                {logo ? <div>Update</div> : <div> +Add </div>}
              </button>

              <button
                type="button"
                className={`px-3 text-red-500 font-bold transition-opacity duration-300 ${
                  logo ? "visible" : "invisible"
                }`}
                onClick={() => setValue("logo", "")}
              >
                Delete
              </button>
            </div>

            <input
              type="file"
              id="fileInput"
              {...register("logo")} // properly spread register
              onChange={(event: any) => {
                const file = event.target.files[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  setValue("logo", previewUrl);
                  setValue("file", file);
                }
              }}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>
        <hr className="h-1 text-gray-600 w-[81%] mt-8" />

        {/* Input fields */}

        <div className="w-full mt-10">
          <FormInputFieldAlt
            type="text"
            register={register}
            fieldName="name"
            placeholder="Enter Practice Name..."
            labelName="Practice Name"
            maxLength={100}
            labelClassName=" 2xl:text-md text-base text-[#535353] font-medium mt-2"
            inputClassName="h-[56px] text-base border-2 rounded-[7px] max-w-[400px] w-full  focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent placeholder:text-gray-500 "
            containerClassName="flex w-full flex-wrap items-center mt-2 "
            labelContainerClassName=" w-full md:w-[29%]"
          />

          <div className="flex flex-wrap  items-center mt-5 w-full  ">
            <div className="w-full md:w-[29%]">
              <label className=" 2xl:text-md text-base text-[#535353] font-medium mt-2">
                Practice Phone
              </label>
            </div>
            <input
              type="text"
              {...register("phone")}
              onInput={(e) => {
                const target = e.target as HTMLInputElement; // Cast e.target to HTMLInputElement for typescript type error
                target.value = target.value.replace(/[^0-9]/g, "");
              }}
              placeholder="Enter Practice address..."
              maxLength={10}
              className="h-[55px] border-2 px-3 text-base rounded-[6px] max-w-[400px] w-full  outline-blue-200 placeholder:text-gray-500"
            />
          </div>

          <FormInputFieldAlt
            type="text"
            register={register}
            fieldName="address"
            maxLength={60}
            placeholder="Enter display address..."
            labelName="Display Address"
            labelClassName=" 2xl:text-md text-base text-[#535353] font-medium mt-2"
            inputClassName="h-[55px] text-base border-2 rounded-[6px] max-w-[400px] w-full focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent placeholder:text-gray-500"
            containerClassName="flex w-full flex-wrap items-center mt-2  mt-5"
            labelContainerClassName=" w-full md:w-[29%]"
          />

          <div className="flex flex-wrap mt-5 w-full ">
            <div className=" w-full md:w-[29%] mt-4">
              <label className=" 2xl:text-md text-base text-[#535353] font-medium mt-5 ">
                Practice Details
              </label>
            </div>
            <textarea
              value={details}
              {...register("details")}
              className="h-[95px] text-base p-3 border-2 rounded-[8px] max-w-[400px] w-full outline-blue-200 placeholder:text-gray-500"
              placeholder="Enter Practice Details..."
            />
          </div>
        </div>

        <div className="flex flex-col w-full mt-3">
          <Typography
            as="h2"
            className="text-xl text-[#535353] font-medium mt-5 mr-8"
          >
            Theme
          </Typography>
          {/* Brand color */}
          <div className="flex align-center mt-5 gap-8 text-base ">
            <div className="flex flex-col">
              <label className=" 2xl:text-md text-[#535353] font-medium mt-2 ">
                Brand Color
              </label>
              <p className="text-sm text-gray-400">
                The primary color of the button
              </p>
            </div>
            <div className="flex items-center ml-6">
              <div
                className="w-[45px] h-[45px] rounded-[7px] border border-gray-300 mr-6 "
                style={{
                  backgroundColor: brandColor,
                }}
              />
              <div className="space-x-5">
                <ReactColorPicker
                  selectedColor={brandColor}
                  setSelectedColor={(color: any) =>
                    setValue("brandColor", color)
                  }
                  buttonName={"Update"}
                />
                <button
                  className="text-base font-semibold text-[#2B5ED4]"
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("brandColor", "#144092");
                  }}
                  aria-label="Reset Brand Color"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Button Primary */}
          <div className="flex align-center mt-5 gap-8 text-base ">
            <div className="flex flex-col">
              <label className=" 2xl:text-md text-[#535353] font-medium mt-2">
                Button Primary
              </label>
              <p className="text-sm text-gray-400">
                The primary color of the button
              </p>
            </div>
            <div className="flex items-center ml-6">
              <div
                className="w-[45px] h-[45px] rounded-[7px] border border-gray-300 mr-6"
                style={{
                  backgroundColor: colorPrimary,
                }}
              />
              <div className="space-x-5">
                <ReactColorPicker
                  selectedColor={colorPrimary}
                  setSelectedColor={(color: any) =>
                    setValue("colorPrimary", color)
                  }
                  buttonName={"Update"}
                />
                <button
                  className="text-base font-semibold text-[#2B5ED4] "
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("colorPrimary", "#144092");
                  }}
                  aria-label="Reset Primary Button Color"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Button Secondary */}
          <div className="flex align-center mt-5 gap-8 text-base">
            <div className="flex flex-col">
              <label className=" 2xl:text-md text-[#535353] font-medium mt-2">
                Button Secondary
              </label>
              <p className="text-sm text-gray-400">
                The primary color of the button
              </p>
            </div>
            <div className="flex items-center ml-6">
              <div
                className="w-[45px] h-[45px] rounded-[7px] border border-gray-300 mr-6"
                style={{
                  backgroundColor: colorSecondary,
                }}
              />
              <div className="space-x-5">
                <ReactColorPicker
                  selectedColor={colorSecondary}
                  setSelectedColor={(color: any) =>
                    setValue("colorSecondary", color)
                  }
                  buttonName={"Update"}
                />
                <button
                  className="text-base  font-semibold text-[#2B5ED4] "
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("colorSecondary", "#144092");
                  }}
                  aria-label="Reset Secondary Button Color"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button
            type="submit"
            disabled={objcompare ? true : false}
            className={`flex items-center rounded-[7px] bg-[#6996FE] gap-1 text-white mt-8 h-[49px] py-1 px-6 text-sm ${
              objcompare ? "opacity-[0.4]" : "opacity-100"
            }`}
          >
            <Icon
              icon="mingcute:save-line"
              style={{ color: "white" }}
              className="size-4"
            />
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppearanceFormDetails;
