import { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";
import SelectDropDown from "@/components/custom/SelectDropDown";
import FormInputField from "@/components/custom/FormInputField";
import { Controller } from "react-hook-form";

type AppProps = {
  register: any;
  control: any;
  watch: any;
  setValue: any;
  setContent: (data: string) => void;
  emailContent: string;
};

const EmailTemplate = ({ register, control, watch, setValue }: AppProps) => {
  const { insertEmailPlaceholderTypeOption } = watch(); // Get options
  const editorRef = useRef<any>(null);
  // Handle insertion of placeholders into the editor
  const handleValueInsert = (selectedOption: { id: string; label: string }) => {
    if (!selectedOption?.id) return;

    const contentToInsert = `{{${selectedOption.id}}}`;
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.selection.insertHTML(contentToInsert);

      const updatedContent = editor.getEditorValue();
      setValue("emailBody", updatedContent, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // Handle editor content changes
  // const handleEditorChange = (newContent: string) => {
  //   setEditorContent(newContent);
  //   setContent(newContent); // Update content state
  //   setValue("emailBody", newContent); // Sync with React Hook Form
  // };

  const editorConfig: any = useMemo(
    () => ({
      readonly: false,
      height: 400,
      toolbarSticky: true,
      placeholder: "",
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "image",
        "|",
        "undo",
        "redo",
      ],
      disablePlugins: [
        "file",
        "image",
        "video",
        "speechRecognize",
        "line height",
      ],
      events: {
        afterInit: (editor: any) => {
          editorRef.current = editor;
        },
      },
    }),
    []
  );

  return (
    <>
      {/* Subject Input */}
      <FormInputField
        register={register}
        type="text"
        placeholder="Enter email subject"
        fieldName="emailSubject"
        labelName="Email Subject"
        labelClassName="text-md text-gray-500 font-normal mt-4 font-[700]"
        className="p-6 px-2.5 mt-3 font-[350] text-base border-2 border-gray-300 rounded-[7px] focus-visible:ring-blue-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent"
      />

      {/* Placeholder Dropdown */}
      <div className="mt-6 w-full">
        <SelectDropDown
          name="insertEmailPlaceholderType"
          options={insertEmailPlaceholderTypeOption}
          control={control}
          selected="Insert placeholder type"
          handleOnchange={handleValueInsert}
          containerClassname="w-full"
        />
      </div>

      {/* Jodit Editor */}
      <div className="mt-6 max-w-[700px] w-full border border-gray-300 rounded-md">
        <Controller
          name="emailBody"
          control={control}
          render={({ field }) => (
            <JoditEditor
              {...field}
              config={editorConfig}
              ref={editorRef}
              value={field.value}
              onChange={(newContent: string) => {
                field.onChange(newContent);
              }}
            />
          )}
        />
      </div>
    </>
  );
};

export default EmailTemplate;
