import { Typography } from "@/components/custom/Typography";
import { useForm } from "react-hook-form";
import { insertPlaceholderTypeOption } from "@/constant/template";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailTemplate from "./EmailTemplate";
import TextTemplate from "./TextTemplate";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import {
  useGetEmailndTextTemplateQuery,
  useGetTemplateListQuery,
  useUpdateEmailTemplateMutation,
  useUpdateTextTemplateMutation,
} from "@/redux/practiceDashBoard/apiSlice";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import _ from "lodash";
import { twMerge } from "tailwind-merge";
import { RootState } from "@/redux/store";
import TemplateSkeleton from "@/components/custom/skeletons/TemplateSkeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type FormValues = {
  templateType: {
    id: string;
    label: string;
    is_sms: boolean | null;
    is_email: boolean | null;
  };
  insertEmailPlaceholderType: { id: string; label: string }[];
  insertEmailPlaceholderTypeOption: { id: string; label: string }[];
  insertTextPlaceholderType: { id: string; label: string }[];
  insertTextPlaceholderTypeOption: { id: string; label: string }[];
  emailSubject: string;
  emailBody: string;
  textBody: string;
};

const Template = () => {
  const [templateTypeOption, setTemplateTypeOption] = useState<
    {
      id: string;
      label: string;
      is_sms: boolean | null;
      is_email: boolean | null;
    }[]
  >([]);
  const [activeTab, setActiveTab] = useState<string>("email");
  const [emailComparedObject, setEmailComparedObject] = useState<any>({});
  const [isEmailObjectValueChange, setIsEmailObjectValueChange] =
    useState<boolean>(false);
  const [textComparedObject, setTextComparedObject] = useState<any>({});
  const [istextObjectValueChange, setIsTextObjectValueChange] =
    useState<boolean>(false);
  const persistPracticeId = useSelector(
    (state: RootState) => state?.persisted?.practice?.persistPracticeDetails?.id
  );
  const [emailContent, setEmailContent] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { control, watch, register, setValue, handleSubmit } =
    useForm<FormValues>({
      defaultValues: {
        templateType: { id: "", label: "", is_sms: null, is_email: null },
        insertEmailPlaceholderType: [],
        insertEmailPlaceholderTypeOption: [],
        insertTextPlaceholderType: [],
        insertTextPlaceholderTypeOption: [],
        emailSubject: "",
        emailBody: "",
        textBody: "",
      },
    });

  const { templateType, emailSubject, emailBody, textBody } = watch();
  //Api Call
  const { data: templateList, isFetching: templateFetching } =
    useGetTemplateListQuery(
      {
        practiceId: persistPracticeId,
      },
      { skip: !persistPracticeId }
    );

  const { data: templateData, isFetching } = useGetEmailndTextTemplateQuery(
    {
      practiceId: persistPracticeId,
      templateName: templateType?.id,
    },
    { skip: !persistPracticeId || !templateType?.id }
  );
  const watchedValue = watch();
  const [updateEmailTemplate] = useUpdateEmailTemplateMutation();
  const [updateTextTemplate] = useUpdateTextTemplateMutation();

  useEffect(() => {
    if (templateList?.result?.length) {
      const updatedTemplateList = templateList?.result?.map((template: any) => {
        return {
          id: template?.template_name,
          label: template?.name,
          is_email: template?.is_email,
          is_sms: template?.is_sms,
        };
      });
      setTemplateTypeOption(updatedTemplateList);
      setValue("templateType", updatedTemplateList[0]);
      setSelectedId(updatedTemplateList[0]?.id); // for this line bydefault the first option will be  selectedId
    } else {
      setTemplateTypeOption([
        { id: "", label: "No option", is_sms: null, is_email: null },
      ]);
      // setValue("templateType", {
      //   id: "",
      //   label: "",
      //   is_sms: null,
      //   is_email: null,
      // });
    }
  }, [templateList?.result]);

  useEffect(() => {
    // Create an object from the watched values
    const watchedEmailObject = {
      emailBody: watchedValue?.emailBody,
      emailSubject: watchedValue?.emailSubject,
    };
    const watchedTextObject = {
      textBody: watchedValue?.textBody,
    };

    const isEqual = _.isEqual(emailComparedObject, watchedEmailObject);
    const isTextEqual = _.isEqual(textComparedObject, watchedTextObject);

    setIsEmailObjectValueChange(isEqual);
    setIsTextObjectValueChange(isTextEqual);
  }, [
    watchedValue?.emailBody,
    watchedValue?.emailSubject,
    emailComparedObject,
    textComparedObject,
    watchedValue?.textBody,
  ]);

  // For comparison or further processing
  useEffect(() => {
    if (templateData?.result) {
      const updatedEmailObject = handleSetEmailFormDataValue(
        templateData?.result
      );
      const updatedTextObject = handleSetTextFormDataValue(
        templateData?.result
      );

      setEmailComparedObject(updatedEmailObject);
      setTextComparedObject(updatedTextObject);
    }
  }, [templateData?.result, open]);

  useEffect(() => {
    const dynamicTextColumns =
      templateData?.result?.text_template?.dynamic_columns || [];
    const dynamicEmailColumns =
      templateData?.result?.email_template?.dynamic_columns || [];
    setValue(
      "insertTextPlaceholderTypeOption",
      dynamicTextColumns?.length > 0
        ? insertPlaceholderTypeOption?.filter((item) =>
            dynamicTextColumns?.includes(item?.id)
          )
        : [{ id: "", label: "No option" }]
    );

    setValue(
      "insertEmailPlaceholderTypeOption",
      dynamicEmailColumns?.length > 0
        ? insertPlaceholderTypeOption?.filter((item) =>
            dynamicEmailColumns?.includes(item?.id)
          )
        : [{ id: "", label: "No option" }]
    );
  }, [templateData?.result]);

  useEffect(() => {
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const handleUpdateEmailTemplate = async () => {
    try {
      const finalData = {
        practiceId: persistPracticeId,
        templateName: templateType?.id,
        emailSubject,
        emailBody: emailBody?.replace(/\\/g, ""),
      };
      const result: any = await updateEmailTemplate(finalData).unwrap();
      if (result?.success) {
        toast.success(result?.message || "Update successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update");
    }
  };

  const handleUpdateTextTemplate = async () => {
    try {
      const finalData = {
        practiceId: persistPracticeId,
        templateName: templateType?.id,
        textBody: textBody?.replace(/\\/g, ""),
      };
      const result = await updateTextTemplate(finalData).unwrap();
      if (result?.success) {
        toast.success(result?.message || "Update successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update");
    }
  };

  function handleSetEmailFormDataValue(formData: Partial<any>) {
    const initialObject: Partial<FormValues> = {
      emailSubject: formData?.email_template?.subject || "",
      emailBody:
        formData?.email_template?.template_html?.replace(/\\/g, "") || "",
    };
    setEmailContent(
      formData?.email_template?.template_html?.replace(/\\/g, "")
    );
    Object.entries(initialObject).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key as keyof FormValues, value);
      }
    });
    return initialObject;
  }

  function handleSetTextFormDataValue(formData: Partial<any>) {
    const initialObject: Partial<FormValues> = {
      textBody: formData?.text_template?.body?.replace(/\\/g, "") || "",
    };
    setTextContent(formData?.text_template?.body?.replace(/\\/g, ""));
    Object.entries(initialObject).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key as keyof FormValues, value);
      }
    });
    return initialObject;
  }

  const handleBtn = (Ttype: any) => {
    setValue("templateType", Ttype);
    setSelectedId(Ttype?.id);
  };

  const checkViewport = () => {
    const isMobileView = window.innerWidth < 1000;
    setIsMobile(isMobileView);
    if (!isMobileView) setDrawerOpen(false);
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div id="template" className="lg:m-10 m-4 bg-white p-[25px]">
        <div className="py-3">
          <Typography as="h2" className="text-black font-medium text-[26px]">
            Templates
          </Typography>
        </div>

        <div className="flex justify-between gap-4 border-2 rounded-xl">
          {templateFetching ? (
            <div className="lg:w-1/2 w-full p-[25px] pb-5 ">
              <TemplateSkeleton />
            </div>
          ) : (
            <div className="lg:w-1/2 w-full p-[25px] pb-5 ">
              <div className="flex flex-col gap-4">
                {templateTypeOption?.map(
                  (Ttype: FormValues["templateType"]) => (
                    <div
                      key={Ttype.id}
                      className={`flex items-center justify-between h-[65px] border  bg-[#f6f9ff]  rounded-xl px-3 ${
                        selectedId === Ttype?.id
                          ? "border-[#739DFD]"
                          : "border-gray-200"
                      }`}
                    >
                      {Ttype?.label}
                      <div className="flex gap-2 items-center">
                        <Icon
                          icon="lets-icons:check-ring-light"
                          width="35"
                          height="35"
                          className="rounded-full text-[#4d69ab] bg-[#e6f0ff] p-[6px] cursor-pointer"
                        />
                        {isMobile ? (
                          <DrawerTrigger>
                            <Icon
                              icon="ep:edit"
                              width="35"
                              height="35"
                              className={`rounded-full ${
                                selectedId === Ttype?.id
                                  ? "bg-[#396cce] text-white"
                                  : "bg-[#e6f0ff] text-[#4d69ab]"
                              } p-[8px] cursor-pointer`}
                              onClick={() => handleBtn(Ttype)}
                            />
                          </DrawerTrigger>
                        ) : (
                          <Icon
                            icon="ep:edit"
                            width="35"
                            height="35"
                            className={`rounded-full ${
                              selectedId === Ttype?.id
                                ? "bg-[#396cce] text-white"
                                : "bg-[#e6f0ff] text-[#4d69ab]"
                            } p-[8px] cursor-pointer`}
                            onClick={() => handleBtn(Ttype)}
                          />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/** */}
            </div>
          )}
          {isMobile ? (
            <DrawerContent className="h-full overflow-y-auto">
              <DrawerHeader className="flex justify-between ">
                <DrawerTitle>Templates</DrawerTitle>
                <DrawerClose asChild>
                  <Button className="bg-white text-black">
                    <Icon
                      icon="oui:cross"
                      width="16"
                      height="16"
                      className="text-gray-500"
                    />
                  </Button>
                </DrawerClose>
              </DrawerHeader>

              <div className="lg:w-1/2 lg:block bg-[#f6f7fb] p-[25px]">
                {(templateType?.is_email && !templateType?.is_sms) ||
                (!templateType?.is_email && templateType?.is_sms) ? (
                  <div className="mt-5 col-start-1 col-end-4">
                    <Label className="text-md text-gray-700 font-normal">
                      {templateType?.is_email ? "Email" : "Text"}
                    </Label>
                  </div>
                ) : (
                  ""
                )}
                {isFetching || templateFetching ? (
                  <TemplateSkeleton />
                ) : templateType?.is_email && templateType?.is_sms ? (
                  <Tabs
                    defaultValue={
                      templateType?.is_email
                        ? "email"
                        : templateType?.is_sms
                        ? "text"
                        : activeTab
                    }
                    onValueChange={setActiveTab}
                    className="flex flex-col"
                  >
                    {templateType?.is_email && templateType?.is_sms ? (
                      <div className="flex justify-start">
                        <TabsList className="h-11 text-gray-700 gap-5">
                          {templateType?.is_email && (
                            <TabsTrigger
                              value="email"
                              className=" min-w-[110px] text-[16px] h-[42px] border-2 data-[state=active]:border data-[state=active]:border-blue-500 data-[state=active]:bg-transparent  data-[state=active]:text-blue-500 "
                            >
                              EMAIL
                            </TabsTrigger>
                          )}
                          {templateType?.is_sms && (
                            <TabsTrigger
                              value="text"
                              className=" min-w-[110px] text-[16px] h-[42px] border-2 data-[state=active]:border data-[state=active]:border-blue-500 data-[state=active]:bg-transparent  data-[state=active]:text-blue-500 "
                            >
                              TEXT
                            </TabsTrigger>
                          )}
                        </TabsList>
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      className={twMerge(
                        "w-full",
                        templateType?.is_email && templateType?.is_sms && ""
                      )}
                    >
                      {templateType?.is_email && (
                        <TabsContent value="email" className="mt-5 px-1">
                          <form
                            onSubmit={handleSubmit(handleUpdateEmailTemplate)}
                          >
                            <EmailTemplate
                              setValue={setValue}
                              register={register}
                              control={control}
                              watch={watch}
                              emailContent={emailContent}
                              setContent={setEmailContent}
                            />
                            <div className="mt-5 flex lg:justify-end  ">
                              <Button
                                className="bg-[#6995fe] w-full lg:w-max flex gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
                                type="submit"
                                disabled={isEmailObjectValueChange}
                              >
                                <Icon
                                  icon="mingcute:save-line"
                                  className="text-white"
                                />
                                Save
                              </Button>
                            </div>
                          </form>
                        </TabsContent>
                      )}
                      {templateType?.is_sms && (
                        <TabsContent value="text" className="mt-5">
                          <form
                            onSubmit={handleSubmit(handleUpdateTextTemplate)}
                          >
                            <TextTemplate
                              setValue={setValue}
                              register={register}
                              control={control}
                              watch={watch}
                              textContent={textContent}
                              setContent={setTextContent}
                            />
                            <div className="mt-5 flex lg:justify-end  ">
                              <Button
                                className="bg-[#6995fe] flex lg:w-max w-full gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
                                type="submit"
                                disabled={istextObjectValueChange}
                              >
                                <Icon
                                  icon="mingcute:save-line"
                                  className="text-white"
                                />
                                Save
                              </Button>
                            </div>
                          </form>
                        </TabsContent>
                      )}
                    </div>
                  </Tabs>
                ) : templateType?.is_email ? (
                  <form
                    onSubmit={handleSubmit(handleUpdateEmailTemplate)}
                    className=""
                  >
                    <EmailTemplate
                      setValue={setValue}
                      register={register}
                      control={control}
                      watch={watch}
                      emailContent={emailContent}
                      setContent={setEmailContent}
                    />
                    <div className="mt-5 flex lg:justify-end  ">
                      <Button
                        className="bg-[#6995fe] flex gap-1 lg:w-max w-full font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
                        type="submit"
                        disabled={isEmailObjectValueChange}
                      >
                        <Icon
                          icon="mingcute:save-line"
                          className="text-white"
                        />
                        Save
                      </Button>
                    </div>
                  </form>
                ) : templateType?.is_sms ? (
                  <form
                    onSubmit={handleSubmit(handleUpdateTextTemplate)}
                    className="col-start-1 col-end-4"
                  >
                    <TextTemplate
                      setValue={setValue}
                      register={register}
                      control={control}
                      watch={watch}
                      textContent={textContent}
                      setContent={setTextContent}
                    />
                    <div className="mt-5 flex lg:justify-end  ">
                      <Button
                        className="bg-[#6995fe] flex lg:w-max w-full gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
                        type="submit"
                        disabled={istextObjectValueChange}
                      >
                        <Icon
                          icon="mingcute:save-line"
                          className="text-white"
                        />
                        Save
                      </Button>
                    </div>
                  </form>
                ) : (
                  ""
                )}
              </div>
            </DrawerContent>
          ) : (
            <div className="lg:w-1/2 lg:block hidden bg-[#f6f7fb] p-[25px]">
              {(templateType?.is_email && !templateType?.is_sms) ||
              (!templateType?.is_email && templateType?.is_sms) ? (
                <div className="mt-5 col-start-1 col-end-4">
                  <Label className="text-md text-gray-700 font-normal">
                    {templateType?.is_email ? "Email" : "Text"}
                  </Label>
                </div>
              ) : (
                ""
              )}
              {isFetching || templateFetching ? (
                <TemplateSkeleton />
              ) : templateType?.is_email && templateType?.is_sms ? (
                <Tabs
                  defaultValue={
                    templateType?.is_email
                      ? "email"
                      : templateType?.is_sms
                      ? "text"
                      : activeTab
                  }
                  onValueChange={setActiveTab}
                  className="flex flex-col"
                >
                  {templateType?.is_email && templateType?.is_sms ? (
                    <div className="flex justify-start">
                      <TabsList className="h-11 text-gray-700 gap-5">
                        {templateType?.is_email && (
                          <TabsTrigger
                            value="email"
                            className=" min-w-[110px] text-[16px] h-[42px] border-2 data-[state=active]:border data-[state=active]:border-blue-500 data-[state=active]:bg-transparent  data-[state=active]:text-blue-500 "
                          >
                            EMAIL
                          </TabsTrigger>
                        )}
                        {templateType?.is_sms && (
                          <TabsTrigger
                            value="text"
                            className=" min-w-[110px] text-[16px] h-[42px] border-2 data-[state=active]:border data-[state=active]:border-blue-500 data-[state=active]:bg-transparent  data-[state=active]:text-blue-500 "
                          >
                            TEXT
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </div>
                  ) : (
                    ""
                  )}
                  <div
                    className={twMerge(
                      "w-full",
                      templateType?.is_email && templateType?.is_sms && ""
                    )}
                  >
                    {templateType?.is_email && (
                      <TabsContent value="email" className="mt-5 px-1">
                        <form
                          onSubmit={handleSubmit(handleUpdateEmailTemplate)}
                        >
                          <EmailTemplate
                            setValue={setValue}
                            register={register}
                            control={control}
                            watch={watch}
                            emailContent={emailContent}
                            setContent={setEmailContent}
                          />
                          <div className="mt-5 flex justify-end  ">
                            <Button
                              className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
                              type="submit"
                              disabled={isEmailObjectValueChange}
                            >
                              <Icon
                                icon="mingcute:save-line"
                                className="text-white"
                              />
                              Save
                            </Button>
                          </div>
                        </form>
                      </TabsContent>
                    )}
                    {templateType?.is_sms && (
                      <TabsContent value="text" className="mt-5">
                        <form onSubmit={handleSubmit(handleUpdateTextTemplate)}>
                          <TextTemplate
                            setValue={setValue}
                            register={register}
                            control={control}
                            watch={watch}
                            textContent={textContent}
                            setContent={setTextContent}
                          />
                          <div className="mt-5 flex justify-end  ">
                            <Button
                              className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
                              type="submit"
                              disabled={istextObjectValueChange}
                            >
                              <Icon
                                icon="mingcute:save-line"
                                className="text-white"
                              />
                              Save
                            </Button>
                          </div>
                        </form>
                      </TabsContent>
                    )}
                  </div>
                </Tabs>
              ) : templateType?.is_email ? (
                <form
                  onSubmit={handleSubmit(handleUpdateEmailTemplate)}
                  className=""
                >
                  <EmailTemplate
                    setValue={setValue}
                    register={register}
                    control={control}
                    watch={watch}
                    emailContent={emailContent}
                    setContent={setEmailContent}
                  />
                  <div className="mt-5 flex justify-end  ">
                    <Button
                      className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
                      type="submit"
                      disabled={isEmailObjectValueChange}
                    >
                      <Icon icon="mingcute:save-line" className="text-white" />
                      Save
                    </Button>
                  </div>
                </form>
              ) : templateType?.is_sms ? (
                <form
                  onSubmit={handleSubmit(handleUpdateTextTemplate)}
                  className="col-start-1 col-end-4"
                >
                  <TextTemplate
                    setValue={setValue}
                    register={register}
                    control={control}
                    watch={watch}
                    textContent={textContent}
                    setContent={setTextContent}
                  />
                  <div className="mt-5 flex justify-end ">
                    <Button
                      className="bg-[#6995fe] flex gap-1 font-normal text-md text-white h-[49px] py-1 px-7 rounded-[7px] hover:bg-[#6995fe]"
                      type="submit"
                      disabled={istextObjectValueChange}
                    >
                      <Icon icon="mingcute:save-line" className="text-white" />
                      Save
                    </Button>
                  </div>
                </form>
              ) : (
                ""
              )}
            </div>
          )}
        </div>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Drawer>
  );
};

export default Template;
