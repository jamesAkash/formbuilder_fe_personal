import DroppableArea from "./DroppableArea";

const FormElement = ({ element }) => {
  const {
    displaySettings: { labelPosition, hideLabel, descriptionPosition },
  } = element;
  if (element.type === "container") {
    return (
      <div>
        <h1>{element?.heading}</h1>
        <div
          style={{
            gridTemplateColumns: `repeat(${element.styleSettings.cols.value}, minmax(0, 1fr))`,
          }}
          className="grid"
        >
          {Array.from({ length: element.styleSettings.cols.value }).map(
            (_, index) => (
              <DroppableArea
                key={index}
                id={`container-${element.uniqueId}-${index}`}
              >
                <div className="z-50 h-24"></div>
              </DroppableArea>
            )
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`${
        descriptionPosition.value.toLowerCase() === "top"
          ? "flex flex-col-reverse"
          : "flex flex-col"
      }`}
    >
      <div
        className={`flex  ${
          labelPosition.value.toLowerCase() === "right"
            ? " flex-row-reverse items-center gap-4"
            : labelPosition.value.toLowerCase() === "bottom"
            ? " flex-col-reverse"
            : labelPosition.value.toLowerCase() === "left"
            ? "items-center gap-4"
            : "flex-col"
        }`}
      >
        {!hideLabel.value && (
          <label className="block text-nowrap mb-1  font-medium">
            {element.displaySettings.label.value || element.label}
          </label>
        )}
        <GenerateElement element={element} />
      </div>
      {element.displaySettings.description.value && (
        <p className="text-gray-500 text-sm">
          {element.displaySettings.description.value}
        </p>
      )}
    </div>
  );
};

// Later using composition to pass required directly
// const GenerateElement = ({ element }) => {
//   if (element.type === "input" && element.inputType != "checkbox")
//     return (
//       <input
//         type={element.inputType || "text"}
//         placeholder={
//           element.displaySettings.placeholder.value || "Enter something"
//         }
//         className={`w-full border px-2 py-1 rounded ${
//           element.displaySettings.hidden.value ? "hidden" : ""
//         }`}
//       />
//     );

//   if (element.type === "textArea")
//     return (
//       <textarea
//         placeholder={
//           element.displaySettings.placeholder.value || "Enter something"
//         }
//         className={` border px-2 py-1 rounded ${
//           element.displaySettings.hidden.value ? "hidden" : ""
//         }`}
//         cols={element.displaySettings.cols.value}
//         rows={element.displaySettings.rows.value}
//       />
//     );

//   if (element.type === "select")
//     return (
//       <select>
//         {element.dataSettings.optionList.options.map((opt, id) => {
//           return (
//             <option value={opt.value} key={id}>
//               {opt.label}
//             </option>
//           );
//         })}
//       </select>
//     );

//   if (element.type === "checkbox") {
//     return (
//       <label className="flex items-center space-x-2">
//         <input
//           type="checkbox"
//           className={`border rounded ${
//             element.displaySettings.hidden.value ? "hidden" : ""
//           }`}
//         />
//       </label>
//     );
//   }

//   if (element.type === "checkboxGroup") {
//     return (
//       <div
//         className={` ${element.displaySettings.hidden.value ? "hidden" : ""}`}
//       >
//         {element.dataSettings.optionList.options.map((opt, id) => (
//           <label key={id} className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               value={opt.value}
//               className="border rounded"
//             />
//             <span>{opt.label}</span>
//           </label>
//         ))}
//       </div>
//     );
//   }
// };

const GenerateElement = ({ element }) => {
  if (element.type === "input") {
    if (element.inputType === "checkbox") {
      return (
        <label className="flex items-center space-x-2">
          <input
            id={element.uniqueId}
            type="checkbox"
            className={`border rounded ${
              element.displaySettings.hidden.value ? "hidden" : ""
            }`}
            data-uniqueid={element.uniqueId}
          />
        </label>
      );
    } else if (element.inputType === "date") {
      return (
        <input
          id={element.uniqueId}
          type={element.dataSettings?.optionList?.value || "date"}
          placeholder={
            element.displaySettings.placeholder?.value || "Enter date"
          }
          className={`w-full border px-2 py-1 rounded ${
            element.displaySettings.hidden?.value ? "hidden" : ""
          }`}
          data-uniqueid={element.uniqueId}
        />
      );
    }
    return (
      <input
        id={element.uniqueId}
        type={element.inputType || "text"}
        placeholder={
          element.displaySettings.placeholder?.value || "Enter something"
        }
        className={`w-full border px-2 py-1 rounded ${
          element.displaySettings.hidden?.value ? "hidden" : ""
        }`}
        data-uniqueid={element.uniqueId}
      />
    );
  }

  if (element.type === "textArea")
    return (
      <textarea
        id={element.uniqueId}
        placeholder={
          element.displaySettings.placeholder?.value || "Enter something"
        }
        className={`border px-2 py-1 rounded ${
          element.displaySettings.hidden?.value ? "hidden" : ""
        }`}
        cols={element.displaySettings.cols?.value}
        rows={element.displaySettings.rows?.value}
        data-uniqueid={element.uniqueId}
      />
    );

  if (element.type === "select")
    return (
      <select
        id={element.uniqueId}
        defaultValue=""
        data-uniqueid={element.uniqueId}
      >
        <option value="" disabled>
          Select
        </option>
        {element.dataSettings.optionList.options.map((opt, id) => {
          return (
            <option value={opt.value} key={id}>
              {opt.label}
            </option>
          );
        })}
      </select>
    );

  if (element.type === "checkboxGroup") {
    return (
      <div
        data-uniqueid={element.uniqueId}
        id={element.uniqueId}
        className={`${element.displaySettings.hidden?.value ? "hidden" : ""}`}
      >
        {element.dataSettings.optionList.options.map((opt, id) => (
          <label key={id} className="flex items-center space-x-2">
            <input
              id={`${element.uniqueId}-${id}`}
              type="checkbox"
              value={opt.value}
              className="border rounded"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    );
  }
};

export default FormElement;
