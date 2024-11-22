import { useState } from "react";
import { useFormContext } from "../App";
import ReactDOM from "react-dom";
import FormElementPreview from "./FormElementPreview";
import styled from "styled-components";
import { Tooltip } from "../UI";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { PlusIcon } from "@radix-ui/react-icons";
import Editor from "@monaco-editor/react";

const SettingsModal = ({ element }) => {
  const { updateElement, setSelectedElement, formElements } = useFormContext();
  const [tab, setTab] = useState("display");
  const [settings, setSettings] = useState({ ...element });

  const handleSave = () => {
    updateElement(settings, element.uniqueId);
    setSelectedElement(null);
  };

  const handleChange = (section, key, value) => {
    // console.log(`section - ${section}
    //   key - ${key}
    //   value - ${value}`);
    // console.log(settings);
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: { ...prev[section][key], value },
      },
    }));
  };

  const handleConditionalChange = (index, key, value) => {
    setSettings((prev) => {
      const updatedSettings = { ...prev };

      updatedSettings.conditionalSettings.conditions[index] = {
        ...updatedSettings.conditionalSettings.conditions[index],
        [key]: {
          ...updatedSettings.conditionalSettings.conditions[index][key],
          value: value,
        },
      };

      return updatedSettings;
    });
  };

  const handleDeleteCondition = (index) => {
    setSettings((prev) => {
      const updatedSettings = { ...prev };
      updatedSettings.conditionalSettings.conditions = [
        ...updatedSettings.conditionalSettings.conditions.slice(0, index),
        ...updatedSettings.conditionalSettings.conditions.slice(index + 1),
      ];
      return updatedSettings;
    });
  };

  const addConditions = (settingsType) => {
    setSettings((prevSettings) => {
      const newCondition = {
        id:
          prevSettings[settingsType].conditions.length > 0
            ? prevSettings[settingsType].conditions[
                prevSettings[settingsType].conditions.length - 1
              ].id + 1
            : 1,
        when: { type: "select", value: "", label: "When", options: [] },
        is: {
          type: "select",
          value: "",
          label: "Is",
          options: [
            { value: "=", label: "Equal to" },
            { value: ">", label: "Greater than" },
            { value: "<", label: "Less than" },
          ],
        },
        value: {
          type: "text",
          value: "",
          label: "Value",
          placeholder: "Enter value to compare with",
        },
      };

      return {
        ...prevSettings,
        [settingsType]: {
          ...prevSettings[settingsType],
          conditions: [...prevSettings[settingsType].conditions, newCondition],
        },
      };
    });
  };

  const handleOptionChange = (settingsType, key, index, field, value) => {
    setSettings((prevSettings) => {
      const updatedOptions = prevSettings[settingsType][key].options.map(
        (opt, i) => (i === index ? { ...opt, [field]: value } : opt)
      );

      return {
        ...prevSettings,
        [settingsType]: {
          ...prevSettings[settingsType],
          [key]: {
            ...prevSettings[settingsType][key],
            options: updatedOptions,
          },
        },
      };
    });
  };

  // console.log("settings", settings);

  const handleAddOption = (settingsType, key) => {
    const newOption = {
      label: "New Option",
      value: `New option`,
    };

    setSettings((prev) => ({
      ...prev,
      [settingsType]: {
        ...prev[settingsType],
        [key]: {
          ...prev[settingsType][key],
          options: [...prev[settingsType][key].options, newOption],
        },
      },
    }));
  };

  const handleDeleteOption = (settingsType, key, index) => {
    const updatedOptions = settings[settingsType][key].options.filter(
      (_, i) => i !== index
    );

    setSettings((prev) => ({
      ...prev,
      [settingsType]: {
        ...prev[settingsType],
        [key]: {
          ...prev[settingsType][key],
          options: updatedOptions,
        },
      },
    }));
  };

  // console.log(Object.keys(settings["displaySettings"]).map((a) => a));
  const renderSettings = (settingsType) => {
    return Object.keys(settings[settingsType]).map((key) => {
      // individual,setting =  settings["displaySettings"]["labelPosition"]
      // individual, setting -> type,value,label
      // console.log(key);
      const setting = settings[settingsType][key];

      switch (setting.type) {
        case "checkbox":
          return (
            <div
              key={key}
              className="flex  gap-6 mt-2 items-center border-b-slate-200 py-1 pl-2 border-b"
            >
              <input
                type="checkbox"
                checked={setting.value}
                onChange={(e) =>
                  handleChange(settingsType, key, e.target.checked)
                }
                className="w-5 h-5"
              />
              <div className="flex gap-1 items-center ">
                <label>{setting.label}</label>
                <Tooltip>
                  <Tooltip.Icon>
                    <div className=" text-slate-800">
                      <HiQuestionMarkCircle />
                    </div>
                  </Tooltip.Icon>
                  <Tooltip.Content>
                    Description to be provided in the schema
                  </Tooltip.Content>
                </Tooltip>
              </div>
            </div>
          );
        // For custom JS now
        // case "textArea":
        //   return (
        //     <div key={key} className="mt-4 border p-4 rounded-md shadow-md">
        //       <div key={key} className="flex flex-col mt-4">
        //         <div className="flex gap-1 items-center ">
        //           <label>{setting.label}</label>
        //           <Tooltip>
        //             <Tooltip.Icon>
        //               <div className=" text-slate-800">
        //                 <HiQuestionMarkCircle />
        //               </div>
        //             </Tooltip.Icon>
        //             <Tooltip.Content>
        //               Description to be provided in the schema
        //             </Tooltip.Content>
        //           </Tooltip>
        //         </div>
        //         <textarea
        //           className="bg-slate-50 border p-4 font-mono border-slate-500 rounded-md"
        //           value={setting.value}
        //           onChange={(e) =>
        //             handleChange(settingsType, key, e.target.value)
        //           }
        //         />
        //       </div>
        //     </div>
        //   );

        case "codeEditor":
          return (
            <div key={key} className="mt-4 border p-4 rounded-md shadow-md">
              <div className="flex flex-col mt-4">
                <div className="flex gap-1 items-center">
                  <label>{setting.label}</label>
                  <Tooltip>
                    <Tooltip.Icon>
                      <div className="text-slate-800">
                        <HiQuestionMarkCircle />
                      </div>
                    </Tooltip.Icon>
                    <Tooltip.Content>
                      Description to be provided in the schema
                    </Tooltip.Content>
                  </Tooltip>
                </div>
                {/* By default removing all styles, as there were cusror alignment issues  */}
                <div
                  className="mt-2 border rounded-md"
                  style={{ height: "400px", width: "100%" }}
                >
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    //fallback in case `setting.value` is undefined
                    value={setting.value || "//write custom js here"}
                    // `newValue`, first argument - need this setup for monaco
                    onChange={(newValue) => {
                      // console.log("NEW VALUE ->", newValue);
                      handleChange(settingsType, key, newValue);
                    }}
                    options={{
                      fontFamily: '"Source Code Pro", "Courier New", monospace',
                      fontSize: 14,
                      lineHeight: 20,
                      wordWrap: "off",
                      renderWhitespace: "all",
                      cursorSmoothCaretAnimation: false,
                      pixelRatio: 1,
                      disableLayerHinting: true,
                      disableMonospaceOptimizations: true,
                    }}
                    //'vs', 'vs-dark', or 'hc-black'
                    theme="vs"
                  />
                </div>
              </div>
            </div>
          );

        case "row":
          return (
            <div key={key} className="mt-4 border p-4 rounded-md shadow-md">
              <label className="text-lg font-semibold">
                {/* from main label */}
                {setting.label || "Options"}
              </label>
              <div className="flex flex-col space-y-2 mt-2">
                {setting.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {/* if selectParent.value ? also provide the options from parent */}
                    {settings?.dataSettings?.selectParent?.value && (
                      <select
                        value={option.parentValue}
                        onChange={(e) =>
                          handleOptionChange(
                            settingsType,
                            key,
                            index,
                            "parentValue",
                            e.target.value
                          )
                        }
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {/* 
                        find the element from the uniqueId which is settings?.dataSettings?.selectParent?.value FROM the formElements
                        -exrract the option from them and place them here based on their
                        */}
                        {formElements
                          .find(
                            (el) =>
                              el.uniqueId ===
                              settings?.dataSettings?.selectParent?.value
                          )
                          .dataSettings.optionList.options.map((opt, idx) => (
                            <option key={idx} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                    )}

                    <input
                      type="text"
                      value={option.label}
                      placeholder="Option Label"
                      onChange={(e) =>
                        handleOptionChange(
                          settingsType,
                          key,
                          index,
                          "label",
                          e.target.value
                        )
                      }
                      className="flex-1 p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      value={option.value}
                      placeholder="Option Value"
                      onChange={(e) =>
                        handleOptionChange(
                          settingsType,
                          key,
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      className="flex-1 p-2 border rounded-md"
                    />
                    <button
                      onClick={() =>
                        handleDeleteOption(settingsType, key, index)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddOption(settingsType, key)}
                  className="mt-2 bg-blue-500 text-white p-2 rounded-md"
                >
                  Add Option
                </button>
              </div>
            </div>
          );
        case "text":
        case "number":
          return (
            <div
              key={key}
              className=" item-container  border p-4 pt-[6px] rounded-md shadow-md "
            >
              <div className="flex gap-1 items-center">
                <label className="text-nowrap">{setting.label}</label>
                <Tooltip>
                  <Tooltip.Icon>
                    <div className=" text-slate-800">
                      <HiQuestionMarkCircle />
                    </div>
                  </Tooltip.Icon>
                  <Tooltip.Content>
                    Description to be provided in the schema
                  </Tooltip.Content>
                </Tooltip>
              </div>
              <input
                type={setting.type}
                value={setting.value}
                onChange={(e) =>
                  handleChange(settingsType, key, e.target.value)
                }
                placeholder={setting?.placeholder || ""}
                className="w-full outline-none focus:ring-yellow-400 focus:ring-2 ring-offset-2"
              />
            </div>
          );
        case "select":
          // If normal select which is independent
          if (!setting.dependent) {
            {
              // console.log(setting.dependent);
            }
            return (
              <div
                key={key}
                className="item-container border p-4 pt-[6px] rounded-md shadow-md"
              >
                <div className="flex items-center gap-1">
                  <label>{setting.label}</label>
                  <Tooltip>
                    <Tooltip.Icon>
                      <div className="text-slate-800">
                        <HiQuestionMarkCircle />
                      </div>
                    </Tooltip.Icon>
                    <Tooltip.Content>
                      Description to be provided in the schema
                    </Tooltip.Content>
                  </Tooltip>
                </div>
                <select
                  className="w-full outline-none bg-slate-200 focus:ring-yellow-400 focus:ring-2 ring-offset-2"
                  value={setting.value || ""}
                  onChange={(e) =>
                    handleChange(settingsType, key, e.target.value)
                  }
                  aria-label={setting.label || "Select value"}
                >
                  <option value="" disabled>
                    Select value
                  </option>

                  {setting.options &&
                    setting.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                </select>
              </div>
            );
          }

          if (setting.dependent && settings.dataSettings.parent.value) {
            return (
              <div
                key={key}
                className="item-container border p-4 pt-[6px] rounded-md shadow-md"
              >
                <div className="flex items-center gap-1">
                  <label>{setting.label}</label>
                  <Tooltip>
                    <Tooltip.Icon>
                      <div className="text-slate-800">
                        <HiQuestionMarkCircle />
                      </div>
                    </Tooltip.Icon>
                    <Tooltip.Content>
                      Description to be provided in the schema
                    </Tooltip.Content>
                  </Tooltip>
                </div>
                <select
                  className="w-full outline-none bg-slate-200 focus:ring-yellow-400 focus:ring-2 ring-offset-2"
                  value={setting.value || ""}
                  onChange={(e) =>
                    handleChange(settingsType, key, e.target.value)
                  }
                  aria-label={setting.label || "Select value"}
                >
                  <option value="" disabled>
                    Select value
                  </option>
                  {/* Render options derived from formElements if parent.value is true */}
                  {formElements.map((el, idx) => (
                    <option key={idx} value={el.uniqueId}>
                      {el.displaySettings.label.value}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return null;

        case "color":
          return (
            <div key={key} className="item-container">
              <label>{setting.label}</label>
              <input
                type={setting.type}
                value={setting.value}
                onChange={(e) =>
                  handleChange(settingsType, key, e.target.value)
                }
                className="input"
              />
            </div>
          );

        case "date":
          return (
            <div
              key={key}
              className=" item-container  border p-4 pt-[6px] rounded-md shadow-md "
            >
              <div className="flex items-center gap-1">
                <label>{setting.label}</label>
                <Tooltip>
                  <Tooltip.Icon>
                    <div className="text-slate-800">
                      <HiQuestionMarkCircle />
                    </div>
                  </Tooltip.Icon>
                  <Tooltip.Content>
                    Description to be provided in the schema
                  </Tooltip.Content>
                </Tooltip>
              </div>
              <input
                type={setting.type}
                value={setting.value}
                onChange={(e) =>
                  handleChange(settingsType, key, e.target.value)
                }
                className="w-full outline-none focus:ring-yellow-400 focus:ring-2 ring-offset-2"
              />
            </div>
          );

        default:
          return null;
      }
    });
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-slate-950 bg-opacity-50 flex items-center justify-center">
      <StyledSettingsWrapper>
        <div className="bg-white py-6 px-8 rounded-lg  shadow-lg  w-[80vw] overflow-y-auto ">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-blue-800 font-light capitalize pb-2">
              Edit {element?.inputType || element.type} Settings
            </h2>
            <button
              onClick={() => setSelectedElement(null)}
              className="text-4xl text-red-600"
            >
              <IoClose />
            </button>
          </div>

          {/* layout */}
          <div className="flex flex-col sm:flex-row sm:gap-6">
            <div className="flex  rounded-lg border-2 border-stone-200 shadow-2xl bg-white flex-1 flex-col    ">
              {/* navigation */}

              <div className="flex bg-slate-100 border-b border-b-slate-300 rounded-t-md   p-4 shadow-md  gap-2">
                <button
                  onClick={() => setTab("display")}
                  className={`px-2 py-[4px] rounded-md hover:ring-2 hover:ring-yellow-400 border  ${
                    tab === "display"
                      ? " bg-blue-800 text-white"
                      : "bg-slate-50 text-black"
                  }`}
                >
                  Display
                </button>
                <button
                  onClick={() => setTab("validation")}
                  className={`px-2 py-[4px] rounded-md hover:ring-2 hover:ring-yellow-400 border  ${
                    tab === "validation"
                      ? " bg-blue-800 text-white"
                      : "bg-slate-50 text-black"
                  }`}
                >
                  Validation
                </button>
                <button
                  onClick={() => setTab("style")}
                  className={`px-2 py-[4px] rounded-md hover:ring-2 hover:ring-yellow-400 border  ${
                    tab === "style"
                      ? " bg-blue-800 text-white"
                      : "bg-slate-50 text-black"
                  }`}
                >
                  Styling
                </button>
                {element?.dataSettings && (
                  <button
                    onClick={() => setTab("data")}
                    className={`px-2 py-[4px] rounded-md hover:ring-2 hover:ring-yellow-400 border  ${
                      tab === "data"
                        ? " bg-blue-800 text-white"
                        : "bg-slate-50 text-black"
                    }`}
                  >
                    Data
                  </button>
                )}

                <button
                  onClick={() => setTab("conditional")}
                  className={`px-2 py-[4px] rounded-md hover:ring-2 hover:ring-yellow-400 border  ${
                    tab === "conditional"
                      ? " bg-blue-800 text-white"
                      : "bg-slate-50 text-black"
                  }`}
                >
                  Conditional
                </button>
                <button
                  onClick={() => setTab("Custom JS")}
                  className={`px-2 py-[4px] rounded-md hover:ring-2 hover:ring-yellow-400 border  ${
                    tab === "Custom JS"
                      ? " bg-blue-800 text-white"
                      : "bg-slate-50 text-black"
                  }`}
                >
                  Custom JS
                </button>
              </div>
              {/* render */}

              <div className="px-4 pt-0 h-[70vh] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 overflow-auto   py-4">
                {tab === "display" ? (
                  renderSettings("displaySettings")
                ) : tab === "validation" ? (
                  renderSettings("validationSettings")
                ) : tab === "style" ? (
                  renderSettings("styleSettings")
                ) : tab === "data" ? (
                  renderSettings("dataSettings")
                ) : tab === "conditional" ? (
                  <>
                    {renderSettings("conditionalSettings")}
                    {settings.conditionalSettings.conditions.length > 0 &&
                      settings.conditionalSettings.conditions.map(
                        (condition, index) => (
                          <div
                            key={index}
                            className="flex gap-2 items-end mt-2 border p-2 py-4"
                          >
                            {/* When */}
                            <div className="w-full flex flex-col">
                              <label htmlFor="when">When</label>
                              <select
                                value={condition.when.value || ""}
                                onChange={(e) =>
                                  handleConditionalChange(
                                    index,
                                    "when",
                                    e.target.value
                                  )
                                }
                                className="bg-slate-200 p-2 rounded-md w-full"
                              >
                                <option disabled value="">
                                  Select Form Element
                                </option>
                                {formElements.map((el, idx) => (
                                  <option
                                    key={idx}
                                    // Passing uniqueId instead of label
                                    value={el.uniqueId}
                                  >
                                    {el.displaySettings.label.value}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Is */}
                            <div className="flex flex-col w-full">
                              <label htmlFor="Is">Is</label>
                              <select
                                value={condition.is.value || ""}
                                onChange={(e) =>
                                  handleConditionalChange(
                                    index,
                                    "is",
                                    e.target.value
                                  )
                                }
                                className="bg-slate-200 p-2 rounded-md w-full"
                              >
                                <option value="" disabled>
                                  Select operator
                                </option>
                                {condition.is.options.map((option, idx) => (
                                  <option key={idx} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Value */}
                            <div className="flex flex-col w-full">
                              <label htmlFor="Value">Value</label>
                              <input
                                type="text"
                                value={condition.value.value}
                                onChange={(e) =>
                                  handleConditionalChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                                placeholder={condition.value.placeholder}
                                className="bg-slate-200 p-2 rounded-md w-full"
                              />
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteCondition(index)}
                              className="text-red-500 p-1 border border-red-500 rounded-md hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        )
                      )}

                    <div className="item-container">
                      <button
                        onClick={() => addConditions("conditionalSettings")}
                        className="bg-green-700 text-white px-2 py-[2px] gap-1 rounded-md flex items-center"
                      >
                        Add Conditions
                        <PlusIcon />
                      </button>
                    </div>
                  </>
                ) : (
                  <div>{renderSettings("customJs")}</div>
                )}
              </div>
            </div>
            <div className="basis-2/5 ">
              {/* Preview section */}

              <div className=" border-2 border-stone-200 shadow-md h-min rounded-lg bg-white    ">
                <div className="bg-slate-100 rounded-t-md border-b  p-4 shadow-md">
                  <h3 className="text-xl font-light uppercase w-fit px-2 ">
                    Preview
                  </h3>
                </div>
                <FormElementPreview settings={settings} element={element} />
              </div>
              {/* Save */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setSelectedElement(null)}
                  className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </StyledSettingsWrapper>
    </div>,
    document.body
  );
};

const StyledEditor = styled.div`
  .editor-container {
    display: flex;
    width: 100%;
    height: 90vh; /* Match the editor height */
    padding: 0;
    margin: 0;
    font-family: inherit; /* Prevent mismatched fonts */
  }

  .editor-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const StyledSettingsWrapper = styled.div`
  input[type="text"],
  input[type="number"],
  input[type="date"],
  select {
    border: 1px solid #a5a8aa;
    border-radius: 4px;
    padding: 4px 8px;
    color: #201e1c;
  }

  .item-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  label {
    color: #0a0909;
    font-size: 18px;
  }
`;

export default SettingsModal;
