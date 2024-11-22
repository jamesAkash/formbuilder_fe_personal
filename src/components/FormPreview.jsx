import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormContext } from "../App";
import { DevTool } from "@hookform/devtools";
import ReactDOM from "react-dom";

const FormPreview = ({ onClose }) => {
  const { formElements } = useFormContext();
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm();

  // const onSubmit = (data) => {
  //   console.log({ data: { id: formElements[0].uniqueId, formData: data } });
  // };
  // Helper Functions for Custom Scripts
  const customJSHelpers = {
    setValue: (fieldName, value) => setValue(fieldName, value),
    getValue: (fieldName) => watch(fieldName),
    showField: (fieldName) => toggleFieldVisibility(fieldName, true),
    hideField: (fieldName) => toggleFieldVisibility(fieldName, false),
    disableField: (fieldName) => toggleFieldState(fieldName, true),
    enableField: (fieldName) => toggleFieldState(fieldName, false),
  };

  const toggleFieldVisibility = (fieldName, isVisible) => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.parentElement.style.display = isVisible ? "block" : "none";
    }
  };

  const toggleFieldState = (fieldName, isDisabled) => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.disabled = isDisabled;
    }
  };

  // Execute Custom JS Script
  const executeCustomScript = (script, event) => {
    try {
      const allValues = watch();
      const fieldName = event.target.name;
      const fieldValue = customJSHelpers.getValue(fieldName);

      if (script) {
        const customFunction = new Function(
          "event",
          "formElements",
          "fieldValue",
          "allValues",
          "helpers",
          script
        );
        customFunction(
          event,
          formElements,
          fieldValue,
          allValues,
          customJSHelpers
        );
      }
    } catch (error) {
      console.error("Error executing custom JS script:", error);
    }
  };

  // Lifecycle Hook: Handle Form Load
  useEffect(() => {
    console.log("Form Loaded:", formElements);
    formElements.forEach((element) => {
      const { customJs } = element;
      if (customJs?.triggerPoint?.value === "onLoad") {
        executeCustomScript(customJs.customScript.value, {});
      }
    });
  }, [formElements]);

  const handleSubmitWrapper = (data) => {
    console.log("Form Data Submitted:", data);
    const enrichedData = {
      id: formElements[0].uniqueId,
      formData: data,
    };
    console.log({ enrichedData });
  };

  return (
    <>
      <DevTool control={control} placement="top-left" />
      {ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-4/5 h-5/6">
            <h2 className="text-lg font-bold mb-4">Form Preview</h2>
            <form
              className="h-[90%]"
              onSubmit={handleSubmit(handleSubmitWrapper)}
            >
              <div className="flex flex-col justify-between h-full">
                {/* form elements */}
                <div>
                  {formElements.map((element) => {
                    const {
                      uniqueId,
                      displaySettings = {},
                      styleSettings = {},
                      conditionalSettings = {},
                    } = element;

                    const {
                      label: { value: label },
                      description,
                      descriptionPosition = { value: "bottom" },
                      labelPosition = { value: "top" },
                      hideLabel = { value: false },
                      required = { value: false },
                      prefix = { value: "" },
                      suffix = { value: "" },
                    } = displaySettings;

                    const {
                      show: { value: hideOrShow = true },
                      conjunction: { value: conjunctionValue = "all" },
                      conditions = [],
                    } = conditionalSettings;

                    const watchedValues = watch();

                    let shouldDisplay = hideOrShow;

                    if (conditions.length > 0) {
                      shouldDisplay = conditions[
                        conjunctionValue === "all" ? "every" : "some"
                      ]((condition) => {
                        const { when, is, value } = condition;
                        const whenValue = watchedValues[when?.value];
                        const conditionValue = value?.value;

                        console.log("Condition Evaluation:", {
                          when: when?.value,
                          is: is.value,
                          value: value?.value,
                          whenValue,
                        });

                        switch (is.value) {
                          case "=":
                            return whenValue === conditionValue;
                          case ">":
                            return whenValue > conditionValue;
                          case "<":
                            return whenValue < conditionValue;
                          default:
                            console.warn("Unsupported operator:", is.value);
                            return false;
                        }
                      });
                    }

                    if (!hideOrShow || !shouldDisplay) return null;

                    return (
                      <div
                        key={uniqueId}
                        className={`mb-4 ${
                          descriptionPosition.value.toLowerCase() === "top"
                            ? "flex flex-col-reverse"
                            : "flex flex-col"
                        }`}
                        style={{
                          width: `${styleSettings.width.value}${styleSettings.widthUnit.value}`,
                        }}
                      >
                        {/* Elements */}
                        <div
                          className={`flex ${
                            labelPosition.value.toLowerCase() === "right"
                              ? "flex-row-reverse items-center gap-4"
                              : labelPosition.value.toLowerCase() === "bottom"
                              ? "flex-col-reverse"
                              : labelPosition.value.toLowerCase() === "left"
                              ? "items-center gap-4"
                              : "flex-col"
                          }`}
                        >
                          {/* label */}
                          {!hideLabel.value && (
                            <label>
                              {label}
                              {required.value && (
                                <span className="ml-1 text-red-600">*</span>
                              )}
                            </label>
                          )}
                          <>
                            {/* prefix */}
                            <div className="flex w-full">
                              {prefix.value ? (
                                <input
                                  type="text"
                                  className={`w-12  bg-stone-50 `}
                                  value={prefix.value}
                                  readOnly
                                />
                              ) : null}
                              {/* Element */}
                              <GeneratePreviewElements
                                element={element}
                                errors={errors}
                                register={register}
                                executeCustomJs={executeCustomJs}
                              />
                              {/* Suffix */}
                              {suffix.value ? (
                                <input
                                  type="text"
                                  className={`w-12  bg-stone-50 `}
                                  value={suffix.value}
                                  readOnly
                                />
                              ) : null}
                            </div>
                            {/* Error */}
                            {errors[label] && (
                              <span className="text-red-500 text-sm">
                                {errors[label].message}
                              </span>
                            )}
                          </>
                        </div>
                        {/* Description */}
                        {description && (
                          <p className="text-gray-500 text-sm">
                            {description.value}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Test Submit
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

const GeneratePreviewElements = ({
  element,
  register,
  errors,
  executeCustomJs,
}) => {
  const { formElements } = useFormContext();
  const { watch } = useForm();

  const {
    type = "input",
    inputType = "text",
    displaySettings = {},
    validationSettings = {},
    styleSettings = {},
    customJs = {},
    uniqueId,
  } = element;
  const {
    label: { value: label },
    placeholder = { value: "" },
    required = { value: false },
    hidden = { value: false },
  } = displaySettings;

  const { optionList, optionList: { options = "" } = {} } =
    element?.dataSettings || {};

  const { triggerPoint, customScript } = customJs;

  // const handleCustomJs = (event) => {
  //   console.log("Custom Script:", customScript.value);

  //   if (customScript.value) {
  //     try {
  //       const fieldValue = watch(label) || "";
  //       console.log(`Value for ${label}:`, fieldValue);
  //       console.log(`Custom JS triggered. Value for ${label}:`, fieldValue);
  //       const script = new Function(
  //         "event",
  //         "formElements",
  //         "fieldValue",
  //         "allValues",
  //         customScript.value
  //       );
  //       script(event, formElements, fieldValue);
  //     } catch (error) {
  //       console.error("Error executing custom JS:", error);
  //     }
  //   }
  // };

  // Defining event handlers dynamically based on triggerPoint
  const eventHandlers = {
    ...(triggerPoint.value === "onChange" && {
      onChange: (event) =>
        executeCustomScript(customJs.customScript.value, event),
    }),
    ...(triggerPoint.value === "onClick" && {
      onClick: (event) =>
        executeCustomScript(customJs.customScript.value, event),
    }),
    ...(triggerPoint.value === "onBlur" && {
      onBlur: (event) =>
        executeCustomScript(customJs.customScript.value, event),
    }),
  };

  switch (type) {
    case "input":
      return (
        <>
          {inputType != "text" &&
          inputType != "number" &&
          element.inputType != "email" ? (
            <input
              defaultValue=""
              type={optionList?.value || "date"}
              {...register(label, {
                required: required.value ? `${label} is required.` : false,
              })}
              className={`w-full border px-2 py-1 rounded ${
                hidden.value ? "hidden" : ""
              }`}
            />
          ) : (
            <input
              defaultValue=""
              type={inputType}
              placeholder={placeholder.value}
              {...register(label, {
                required: required.value ? `${label} is required.` : false,
                ...(validationSettings.minLength?.value && {
                  minLength: {
                    value: validationSettings.minLength.value,
                    message: `Minimum length is ${validationSettings.minLength.value}.`,
                  },
                }),
                ...(validationSettings.maxLength?.value && {
                  maxLength: {
                    value: validationSettings.maxLength.value,
                    message: `Maximum length is ${validationSettings.maxLength.value}.`,
                  },
                }),
                ...(validationSettings.regex?.value && {
                  pattern: {
                    value: new RegExp(validationSettings.regex.value),
                    message: `Format of regular expression not matched [${validationSettings.regex.value}].`,
                  },
                }),
              })}
              className={`w-full border px-2 py-1 rounded ${
                hidden.value ? "hidden" : ""
              }`}
              {...eventHandlers}
            />
          )}
        </>
      );
    case "textArea":
      return (
        <>
          <textarea
            defaultValue=""
            type={type}
            placeholder={placeholder.value}
            {...register(label, {
              required: required.value ? `${label} is required.` : false,
              ...(validationSettings.minLength?.value && {
                minLength: {
                  value: validationSettings.minLength.value,
                  message: `Minimum length is ${validationSettings.minLength.value}.`,
                },
              }),
              ...(validationSettings.maxLength?.value && {
                maxLength: {
                  value: validationSettings.maxLength.value,
                  message: `Maximum length is ${validationSettings.maxLength.value}.`,
                },
              }),
              ...(validationSettings.regex?.value && {
                pattern: {
                  value: new RegExp(validationSettings.regex.value),
                  message: `Format of regular expression not matched [${validationSettings.regex.value}].`,
                },
              }),
            })}
            className={`w-full border px-2 py-1 rounded ${
              hidden.value ? "hidden" : ""
            }`}
            {...eventHandlers}
          />
        </>
      );

    case "checkboxGroup":
      return (
        <>
          {options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={option.value}
                {...register(label, {
                  required: required.value ? `${label} is required.` : false,
                })}
                className="checkbox disabled:bg-slate-100"
                {...eventHandlers}
              />
              <label className="text-sm font-normal">{option.label}</label>
            </div>
          ))}
        </>
      );

    case "select":
      return (
        <select
          {...register(label, {
            required: required.value ? `${label} is required.` : false,
          })}
          className={`w-full border px-2 py-1 rounded ${
            hidden.value ? "hidden" : ""
          }`}
          defaultValue=""
          {...eventHandlers}
        >
          <option value="" disabled>
            Select
          </option>
          {options.map((opt, id) => (
            <option value={opt.value} key={id}>
              {opt.label}
            </option>
          ))}
        </select>
      );
  }
};

export default FormPreview;
