import { HiQuestionMarkCircle } from "react-icons/hi";
import { Tooltip } from "../UI";

const FormElementPreview = ({ settings, element }) => {
  const {
    label,
    labelPosition,
    required,
    hideLabel,
    description,
    descriptionPosition,

    applyMaskOn,
    displayMask,
    tooltip,
  } = settings.displaySettings;

  return (
    <div className=" mx-auto p-6 rounded-sm border  shadow-lg relative">
      {/* Content with settings preview */}
      <div className="relative z-10">
        <div
          className={`${
            descriptionPosition?.value?.toLowerCase() === "top"
              ? "flex flex-col-reverse"
              : "flex flex-col"
          }`}
        >
          <div
            className={`flex ${
              labelPosition?.value?.toLowerCase() === "right"
                ? "flex-row-reverse items-center gap-4"
                : labelPosition?.value?.toLowerCase() === "bottom"
                ? "flex-col-reverse"
                : labelPosition?.value?.toLowerCase() === "left"
                ? "flex-row items-center gap-4"
                : "flex-col"
            }`}
          >
            {!hideLabel?.value && (
              <label className="flex items-center text-nowrap gap-1 mb-1 max-w-max font-medium">
                <h1 className="">{label?.value || "Label"}</h1>
                <span
                  className={`${
                    required?.value ? "block text-red-500" : "hidden"
                  }`}
                >
                  *
                </span>
                {tooltip?.value && (
                  <Tooltip>
                    <Tooltip.Icon>
                      <HiQuestionMarkCircle className="text-slate-600" />
                    </Tooltip.Icon>
                    <Tooltip.Content>{tooltip.value}</Tooltip.Content>
                  </Tooltip>
                )}
              </label>
            )}
            <GenerateElementPreview element={element} settings={settings} />
          </div>
          {description?.value && (
            <p className="text-gray-500 text-sm">{description.value}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const GenerateElementPreview = ({ element, settings }) => {
  const {
    placeholder,
    required,
    hidden,
    prefix,
    suffix,
    autoComplete,
    initialFocus,
    spellCheck,
    disabled,
    cols,
    rows,
  } = settings.displaySettings;

  const { optionList, optionList: { options = "" } = {} } =
    settings?.dataSettings || {};

  const hiddenClass = hidden?.value ? "hidden" : "";

  switch (element.type) {
    case "input":
      return (
        <div className="flex w-full">
          {prefix.value ? (
            <input
              type={element.inputType || "text"}
              className={`w-12  bg-stone-50 `}
              value={prefix.value}
              readOnly
            />
          ) : null}
          {element.inputType != "text" &&
          element.inputType != "number" &&
          element.inputType != "email" ? (
            <>
              {console.log("asdasdas", element.inputType)}
              <input
                type={optionList?.value || "date"}
                required={required?.value || false}
                className={`border w-full px-2 py-1 rounded ${hiddenClass} disabled:bg-slate-100`}
                autoComplete={autoComplete.value.toString()}
                autoFocus={initialFocus.value}
                spellCheck={spellCheck.value}
                disabled={disabled.value}
              />
            </>
          ) : (
            <input
              type={element.inputType || "text"}
              placeholder={placeholder?.value || "Enter something"}
              required={required?.value || false}
              className={`border w-full px-2 py-1 rounded ${hiddenClass} disabled:bg-slate-100`}
              autoComplete={autoComplete.value.toString()}
              autoFocus={initialFocus.value}
              spellCheck={spellCheck.value}
              disabled={disabled.value}
            />
          )}

          {suffix.value ? (
            <input
              type={element.inputType || "text"}
              className={`w-12 bg-stone-50`}
              value={suffix.value}
              readOnly
            />
          ) : null}
        </div>
      );

    case "checkboxGroup":
      return (
        <div className={`flex flex-col ${hiddenClass}`}>
          {prefix.value && <span className="text-sm">{prefix.value}</span>}

          {options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="checkbox disabled:bg-slate-100"
                disabled={disabled.value}
              />
              <label className="text-sm font-normal">{option.label}</label>
            </div>
          ))}

          {suffix.value && <span className="text-sm">{suffix.value}</span>}
        </div>
      );

    case "textArea":
      return (
        <div className="flex w-full">
          {prefix.value ? (
            <input
              type={element.inputType || "text"}
              className={`w-12  bg-stone-50 `}
              value={prefix.value}
              readOnly
            />
          ) : null}

          <textarea
            placeholder={placeholder?.value || "Enter something"}
            required={required?.value || false}
            className={`border w-full h-full  px-2 py-1 rounded ${hiddenClass} disabled:bg-slate-100`}
            autoComplete={autoComplete.value.toString()}
            autoFocus={initialFocus.value}
            spellCheck={spellCheck.value}
            disabled={disabled.value}
            rows={rows}
            cols={cols}
          />

          {suffix.value ? (
            <input
              type={element.inputType || "text"}
              className={`w-12 bg-stone-50`}
              value={suffix.value}
              readOnly
            />
          ) : null}
        </div>
      );

    case "select":
      return (
        <div className="flex flex-1">
          {prefix.value ? (
            <input
              type={element.inputType || "text"}
              className={`w-3/12  bg-stone-50 `}
              value={prefix.value}
              readOnly
            />
          ) : null}
          <select className={`w-full border px-2 py-1 rounded ${hiddenClass}`}>
            {options?.length > 0 ? (
              options.map((opt, id) => (
                <option value={opt.value} key={id}>
                  {opt.label}
                </option>
              ))
            ) : (
              <option>No options available</option>
            )}
          </select>
          {suffix.value ? (
            <input
              type={element.inputType || "text"}
              className={`w-3/12 bg-stone-50`}
              value={suffix.value}
              readOnly
            />
          ) : null}
        </div>
      );

    default:
      return null;
  }
};

export default FormElementPreview;
