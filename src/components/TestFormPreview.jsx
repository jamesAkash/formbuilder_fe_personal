import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useFormContext } from "../App";

const TestFormPreview = () => {
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
      console.log("WATCHED VALUES ->", watchedValues);
      console.log("WHEN ->", when);

      if (!when?.value) {
        console.warn("Condition 'when.value' is missing or undefined.");
        return false;
      }

      const fieldValue = watchedValues[when.value];
      const compareValue = value?.value;

      console.log("FIELD AND COMPARE ->", fieldValue, compareValue);

      switch (is?.value) {
        case "=":
          return fieldValue === compareValue;
        case ">":
          return fieldValue > compareValue;
        case "<":
          return fieldValue < compareValue;
        default:
          console.warn(`Error operator: ${is?.value}`);
          return false;
      }
    });

    // Evaluate conjunction ('all' or 'any')
    return conjunction === "all"
      ? results.every(Boolean)
      : results.some(Boolean);
  };

  //Execute custom JavaScript
  const executeCustomJs = (event, script, formElements) => {
    try {
      const helper = {
        getValue: watchedValues,
        formElements: formElements || [],
        setValue,
        event,
        currentElement: event.target,
        reset: (uniqueIds) => {
          if (Array.isArray(uniqueIds)) {
            uniqueIds.forEach((id) => setValue(id, ""));
          }
        },
        resetAll: () => reset(),
        setStyle: (id, styles) => {
          const element = document.querySelector(`#previewContainer #${id}`);
          if (element) Object.assign(element.style, styles);
        },
        // setStyle: (id, styles) => {
        //   const element = document.querySelector(`#previewContainer #${id}`);
        //   if (element) {
        //     if (styles.addClasses) {
        //       styles.addClasses.forEach((cls) => element.classList.add(cls));
        //     }
        //     if (styles.removeClasses) {
        //       styles.removeClasses.forEach((cls) =>
        //         element.classList.remove(cls)
        //       );
        //     }
        //   } else {
        //     console.warn(`Element with ID "${id}" not found.`);
        //   }
        // },
        triggerEvent: (id, eventName) => {
          const element = document.querySelector(`#previewContainer #${id}`);
          if (element) element.dispatchEvent(new Event(eventName));
        },
      };

      const customFunction = new Function("helper", script);
      customFunction(helper);
    } catch (err) {
      console.error("Error executing custom JS:", err.message || err);
    }
  };

  // Submit handler
  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div className="w-[40vw]">
      <DevTool control={control} />
      <form onSubmit={handleSubmit(onSubmit)}>
        {formElements.map((element) => {
          const {
            uniqueId,
            type,
            inputType,
            displaySettings = {},
            validationSettings = {},
            conditionalSettings = {},
            customJs = {},
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

          const shouldDisplay = evaluateConditions(
            conditionalSettings.conditions || [],
            conditionalSettings.conjunction?.value,
            watchedValues
          );
          if (hidden || !shouldDisplay) return null;

          const eventHandlers = {};
          if (customJs?.triggerPoint?.value) {
            eventHandlers[customJs.triggerPoint.value] = (event) =>
              executeCustomJs(
                event,
                customJs.customScript?.value,
                formElements
              );
          }

          // return (
          //   <div
          //     key={uniqueId}
          //     id="previewContainer"
          //     style={{ marginBottom: "16px" }}
          //   >
          //     {/* Label */}
          //     {!displaySettings.hideLabel?.value && (
          //       <label
          //         style={{
          //           display:
          //             labelPosition === "left" ? "inline-block" : "block",
          //         }}
          //       >
          //         {label}
          //         {required && <span style={{ color: "red" }}> *</span>}
          //       </label>
          //     )}
          //     {/* Element */}
          //     {type === "input" && (
          //       <input
          //         {...register(uniqueId, {
          //           required: required ? `${label} is required.` : false,
          //           ...(minLength && {
          //             minLength: {
          //               value: minLength.value,
          //               message: `Minimum length is ${minLength.value}`,
          //             },
          //           }),
          //           ...(maxLength && {
          //             maxLength: {
          //               value: maxLength.value,
          //               message: `Maximum length is ${maxLength.value}`,
          //             },
          //           }),
          //           ...(regex?.value && {
          //             pattern: {
          //               value: new RegExp(regex.value),
          //               message: `Invalid format.`,
          //             },
          //           }),
          //         })}
          //         id={uniqueId}
          //         type={inputType || "text"}
          //         placeholder={placeholder}
          //         style={{
          //           width: `${displaySettings.width?.value || 100}${
          //             displaySettings.widthUnit?.value || "%"
          //           }`,
          //           background: displaySettings.background?.value,
          //           color: displaySettings.text?.value,
          //         }}
          //         {...eventHandlers}
          //       />
          //     )}
          //     {type === "textarea" && (
          //       <textarea
          //         {...register(uniqueId, {
          //           required: required ? `${label} is required.` : false,
          //         })}
          //         id={uniqueId}
          //         placeholder={placeholder}
          //         rows={displaySettings.rows?.value || 3}
          //         cols={displaySettings.cols?.value || 30}
          //         {...eventHandlers}
          //       />
          //     )}
          //     {type === "select" && (
          //       <select
          //         id={uniqueId}
          //         {...register(uniqueId, {
          //           required: required ? `${label} is required.` : false,
          //         })}
          //         defaultValue=""
          //         {...eventHandlers}
          //       >
          //         <option value="" disabled>
          //           Select
          //         </option>
          //         {element.dataSettings?.optionList?.options.map((opt) => (
          //           <option key={opt.value} value={opt.value}>
          //             {opt.label}
          //           </option>
          //         ))}
          //       </select>
          //     )}
          //     {type === "checkboxGroup" && (
          //       <div>
          //         {element.dataSettings?.optionList?.options.map((opt, idx) => (
          //           <label key={idx}>
          //             <input
          //               id={uniqueId}
          //               type="checkbox"
          //               value={opt.value}
          //               {...register(`${uniqueId}[${idx}]`)}
          //             />
          //             {opt.label}
          //           </label>
          //         ))}
          //       </div>
          //     )}
          //     {/* Description */}
          //     {description && (
          //       <div
          //         style={{
          //           textAlign: descriptionPosition === "top" ? "top" : "bottom",
          //         }}
          //       >
          //         {description}
          //       </div>
          //     )}
          //     {/* Error */}
          //     {errors[uniqueId] && (
          //       <div style={{ color: "red" }}>{errors[uniqueId].message}</div>
          //     )}
          //   </div>
          // );

          return (
            <div
              key={uniqueId}
              id={`${uniqueId}-container`}
              className={`mb-4`} // Tailwind utility for margin-bottom
            >
              {/* Label */}
              {!displaySettings.hideLabel?.value && (
                <label
                  id={`${uniqueId}-label`}
                  className={`
                    ${labelPosition === "left" ? "inline-block mr-2" : "block"} 
                    font-medium
                  `}
                >
                  {label}
                  {required && <span className="text-red-500"> *</span>}
                </label>
              )}
              {/* Element */}
              {type === "input" && (
                <input
                  {...register(uniqueId, {
                    required: required ? `${label} is required.` : false,
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
                  className={`
                    w-${displaySettings.width?.value || "full"} 
                    ${displaySettings.widthUnit?.value === "%" ? "" : "px"} 
                    bg-${displaySettings.background?.value || "white"} 
                    text-${displaySettings.text?.value || "black"} 
                    border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  {...eventHandlers}
                />
              )}
              {type === "textarea" && (
                <textarea
                  {...register(uniqueId, {
                    required: required ? `${label} is required.` : false,
                  })}
                  id={uniqueId}
                  placeholder={placeholder}
                  rows={displaySettings.rows?.value || 3}
                  cols={displaySettings.cols?.value || 30}
                  className={`w-full bg-white text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...eventHandlers}
                />
              )}
              {type === "select" && (
                <select
                  id={uniqueId}
                  {...register(uniqueId, {
                    required: required ? `${label} is required.` : false,
                  })}
                  defaultValue=""
                  className="w-full bg-white text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...eventHandlers}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {element.dataSettings?.optionList?.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
              {type === "checkboxGroup" && (
                <div className="flex flex-col">
                  {element.dataSettings?.optionList?.options.map((opt, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input
                        id={uniqueId}
                        type="checkbox"
                        value={opt.value}
                        {...register(`${uniqueId}[${idx}]`)}
                        className="form-checkbox text-blue-500 border-gray-300 rounded"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}
              {/* Description */}
              {description && (
                <div
                  id={`${uniqueId}-description`}
                  className={`text-sm ${
                    descriptionPosition === "top" ? "text-top" : "text-bottom"
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TestFormPreview;
