import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useFormContext } from "../App";
import { DevTool } from "@hookform/devtools";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

const FormPreview = ({ onClose }) => {
  const { formElements } = useFormContext();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
    control,
  } = useForm();

  const watchedValues = watch();

  // Helper: Check conditions for conditional rendering
  const evaluateConditions = (conditions, conjunction, watchedValues) => {
    if (!conditions.length) return true;

    const results = conditions.map(({ when, is, value }) => {
      const fieldValue = watchedValues[when?.value];
      const compareValue = value?.value;

      switch (is?.value) {
        case "=":
          return fieldValue === compareValue;
        case ">":
          return fieldValue > compareValue;
        case "<":
          return fieldValue < compareValue;
        default:
          return false;
      }
    });

    // Evaluate conjunction ('all' or 'any')
    return conjunction === "all"
      ? results.every(Boolean)
      : results.some(Boolean);
  };

  // Execute custom JavaScript
  const executeCustomJs = (event, script, formElements) => {
    try {
      const helper = {
        // getValue["uniqueId"]
        getValue: watchedValues,
        form: formElements || [],
        // setValue(uid,val)
        toast,
        setValue,
        event,
        currentElement: event?.target || null,
        reset: (uniqueIds) => {
          if (Array.isArray(uniqueIds)) {
            uniqueIds.forEach((id) => setValue(id, ""));
          }
        },
        resetAll: () => reset(),
        setStyle: (id, styles) => {
          const element = document.querySelector(id);
          if (element) Object.assign(element.style, styles);
        },
      };

      const customFunction = new Function("helper", script);
      customFunction(helper);
    } catch (err) {
      console.error("Error executing custom JS:", err.message || err);
    }
  };

  // handle onload custom JS execution
  // useEffect(() => {
  //   formElements.forEach((element) => {
  //     const { customJs: { triggerPoint, customScript } = {} } = element;

  //     if (triggerPoint?.value === "onload" && customScript?.value) {
  //       executeCustomJs(null, customScript.value, formElements);
  //     }
  //   });
  // }, [formElements, watchedValues]);

  useEffect(() => {
    formElements.forEach((element) => {
      const { customJs = {} } = element;

      // trigger point onload
      if (customJs?.triggerPoint?.value === "onload") {
        executeCustomJs(
          // event object not required for onload
          null,
          customJs.customScript?.value,
          formElements
        );
      }
    });
  }, [formElements]);

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <>
      <DevTool control={control} placement="top-left" />
      {ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-4/5 h-5/6">
            <h2 className="text-lg font-bold mb-4">Form Preview</h2>
            <form className="h-[90%]" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col justify-between h-full">
                {/* form elements */}
                <div>
                  {formElements.map((element) => {
                    const {
                      uniqueId,
                      type,
                      inputType,
                      displaySettings = {},
                      validationSettings = {},
                      conditionalSettings = {},
                      customJs = {},
                      dataSettings = {},
                    } = element;

                    const {
                      label: { value: label } = {},
                      placeholder: { value: placeholder } = {},
                      required: { value: required } = {},
                      hidden: { value: hidden } = {},
                      description: { value: description } = {},
                      descriptionPosition: { value: descriptionPosition } = {},
                      labelPosition: { value: labelPosition } = {},
                    } = displaySettings;

                    const { minLength, maxLength, regex } = validationSettings;

                    // Evaluate if the field should be displayed
                    const shouldDisplay = evaluateConditions(
                      conditionalSettings.conditions || [],
                      conditionalSettings.conjunction?.value,
                      watchedValues
                    );
                    if (hidden || !shouldDisplay) return null;

                    // Event handlers for custom JavaScript
                    const eventHandlers = {};
                    if (
                      customJs?.triggerPoint?.value &&
                      customJs.triggerPoint.value !== "onload"
                    ) {
                      eventHandlers[customJs.triggerPoint.value] = (event) =>
                        executeCustomJs(
                          event,
                          customJs.customScript?.value,
                          formElements
                        );
                    }

                    // Memoize filtered options for case of data settings, element has a parent
                    const filteredOptions = useMemo(() => {
                      if (
                        dataSettings.parent?.value &&
                        dataSettings.selectParent?.value
                      ) {
                        return dataSettings.optionList?.options.filter(
                          (opt) =>
                            opt.parentValue ===
                            watchedValues[dataSettings.selectParent.value]
                        );
                      }
                      return dataSettings.optionList?.options || [];
                    }, [
                      watchedValues[dataSettings.selectParent?.value],
                      dataSettings,
                    ]);

                    // Set default value for dependent dropdowns
                    useEffect(() => {
                      if (
                        dataSettings.parent?.value &&
                        filteredOptions?.length &&
                        dataSettings.selectParent?.value &&
                        watchedValues[uniqueId] !== filteredOptions[0]?.value
                      ) {
                        console.log(uniqueId, filteredOptions[0]);
                        setValue(uniqueId, filteredOptions[0].value);
                      }
                    }, [
                      // Stable filtered options
                      filteredOptions,
                      // Only trigger if parent value changes
                      watchedValues[dataSettings.selectParent?.value],
                      dataSettings,
                      setValue,
                      uniqueId,
                    ]);

                    return (
                      <div
                        key={uniqueId}
                        id={`${uniqueId}-container`}
                        className="mb-4"
                      >
                        {/* Label */}
                        {!displaySettings.hideLabel?.value && (
                          <label
                            id={`${uniqueId}-label`}
                            className={`${
                              labelPosition === "left"
                                ? "inline-block mr-2"
                                : "block"
                            } font-medium`}
                          >
                            {label}
                            {required && (
                              <span className="text-red-500"> *</span>
                            )}
                          </label>
                        )}
                        {/* Input Types */}
                        {type === "input" && (
                          <input
                            {...register(uniqueId, {
                              required: required
                                ? `${label} is required.`
                                : false,
                              ...(minLength && {
                                minLength: {
                                  value: minLength.value,
                                  message: `Minimum length is ${minLength.value}`,
                                },
                              }),
                              ...(maxLength && {
                                maxLength: {
                                  value: maxLength.value,
                                  message: `Maximum length is ${maxLength.value}`,
                                },
                              }),
                              ...(regex?.value && {
                                pattern: {
                                  value: new RegExp(regex.value),
                                  message: `Invalid format.`,
                                },
                              }),
                            })}
                            id={uniqueId}
                            type={inputType || "text"}
                            placeholder={placeholder}
                            className="w-full bg-white text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...eventHandlers}
                          />
                        )}
                        {type === "button" && (
                          <button
                            {...register(uniqueId, {
                              required: required
                                ? `${label} is required.`
                                : false,
                              ...(minLength && {
                                minLength: {
                                  value: minLength.value,
                                  message: `Minimum length is ${minLength.value}`,
                                },
                              }),
                              ...(maxLength && {
                                maxLength: {
                                  value: maxLength.value,
                                  message: `Maximum length is ${maxLength.value}`,
                                },
                              }),
                              ...(regex?.value && {
                                pattern: {
                                  value: new RegExp(regex.value),
                                  message: `Invalid format.`,
                                },
                              }),
                            })}
                            type="button"
                            id={uniqueId}
                            className=" border rounded-md p-2 hover:outline-none hover:ring-2 hover:ring-blue-500"
                            {...eventHandlers}
                          >
                            {label}
                          </button>
                        )}
                        {type === "select" && (
                          <select
                            id={uniqueId}
                            {...register(uniqueId, {
                              required: required
                                ? `${label} is required.`
                                : false,
                            })}
                            multiple={
                              displaySettings.multiple.value == "true"
                                ? true
                                : false
                            }
                            defaultValue={
                              displaySettings.multiple.value === "true"
                                ? []
                                : ""
                            }
                            className="w-full bg-white text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...eventHandlers}
                          >
                            <option value="" disabled>
                              {placeholder || "Select an option"}
                            </option>
                            {filteredOptions?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                        {/* Description */}
                        {description && (
                          <div
                            id={`${uniqueId}-description`}
                            className={`text-sm ${
                              descriptionPosition === "top" ? "mb-2" : "mt-2"
                            }`}
                          >
                            {description}
                          </div>
                        )}
                        {/* Error */}
                        {errors[uniqueId] && (
                          <div
                            id={`${uniqueId}-error`}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors[uniqueId].message}
                          </div>
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

export default FormPreview;
