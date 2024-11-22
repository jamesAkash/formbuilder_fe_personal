import {
  BoxIcon,
  CalendarIcon,
  ContainerIcon,
  EnvelopeClosedIcon,
  HeightIcon,
  KeyboardIcon,
  LayersIcon,
  TextAlignJustifyIcon,
  TextIcon,
} from "@radix-ui/react-icons";

const commonJsEvents = {
  triggerPoint: {
    value: "",
    type: "select",
    label: "Event",
    dependent: false,
    options: [
      { value: "onChange", label: "Change" },
      { value: "onClick", label: "Click" },
      { value: "onBlur", label: "blur" },
    ],
  },
  // info:{
  //   type:"collapsible",
  //   label:"Guide",
  //   onclick:()=>{setValue(!show)},

  //   content:`<p>hello</p>`,
  // },
  customScript: {
    value: "",
    type: "codeEditor",
    label: "Enter custom JS here",
  },
};

const commonDisplaySettings = {
  label: {
    value: "",
    type: "text",
    label: "Field Label",
    placeholder: "Enter Label Name",
  },
  labelPosition: {
    value: "top",
    type: "select",
    label: "Label Position",
    dependent: false,
    options: [
      { value: "top", label: "Top" },
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
      { value: "bottom", label: "Bottom" },
    ],
  },
  placeholder: {
    value: "",
    type: "text",
    label: "Placeholder",
    placeholder: "Enter placeholder text",
  },
  description: {
    value: "",
    type: "text",
    label: "Description of Element",
    placeholder: "Tell the user about the element",
  },

  descriptionPosition: {
    value: "bottom",
    type: "select",
    label: "Description Position",
    dependent: false,
    options: [
      { value: "top", label: "Top" },
      { value: "bottom", label: "Bottom" },
    ],
  },
  tooltip: {
    value: "",
    type: "text",
    label: "Tooltip",
    placeholder: "Enter tooltip content",
  },
  prefix: {
    value: "",
    type: "text",
    label: "Prefix",
    placeholder: "Enter prefix",
  },
  suffix: {
    value: "",
    type: "text",
    label: "Suffix",
    placeholder: "Enter suffix",
  },
  displayMask: {
    value: "",
    type: "text",
    label: "Display Mask",
    placeholder: "Mask",
  },
  applyMaskOn: {
    value: "",
    type: "select",
    dependent: false,
    label: "Apply Mask On",
    options: [
      { value: "change", label: "Change" },
      { value: "blur", label: "Blur" },
    ],
  },
  required: { value: false, type: "checkbox", label: "Required" },
  hidden: { value: false, type: "checkbox", label: "Hidden Field" },
  hideLabel: { value: false, type: "checkbox", label: "Hide Label" },
  initialFocus: { value: false, type: "checkbox", label: "Initial Focus" },
  disabled: { value: false, type: "checkbox", label: "Disabled" },
  spellCheck: { value: false, type: "checkbox", label: "Allow Spell Check" },
  autoComplete: { value: false, type: "checkbox", label: "Auto complete" },
};

const commonConditionalSettings = {
  show: {
    value: undefined,
    type: "select",
    dependent: false,
    label: "Show or Hide this Field",
    options: [
      { value: true, label: "Show this field" },
      { value: false, label: "Hide this field" },
    ],
  },
  conjunction: {
    value: "",
    type: "select",
    dependent: false,
    label: "When",
    options: [
      { value: "all", label: "When all conditions are met" },
      { value: "some", label: "When some conditions are met" },
    ],
  },

  conditions: [],
};

const commonValidationSettings = {
  unique: { value: false, type: "checkbox", label: "Unique Field" },
  errorLabel: {
    value: "",
    type: "text",
    label: "Default Error Message",
    placeholder: "Provide a default error message",
  },
};

const commonStyleSettings = {
  width: { value: "100", type: "text", label: "Width", placeholder: "100" },
  widthUnit: {
    value: "%",
    type: "select",
    dependent: false,
    label: "Unit",
    options: [
      { value: "px", label: "pixels" },
      { value: "%", label: "percentage" },
    ],
  },
};

const elementsSchema = [
  {
    id: "textInput",
    label: "Text Input",
    type: "input",
    inputType: "text",
    placeholder: "Enter text",
    icon: TextIcon,
    displaySettings: {
      ...commonDisplaySettings,
      placeholder: {
        ...commonDisplaySettings.placeholder,
        value: "Enter text",
      },
    },
    validationSettings: {
      ...commonValidationSettings,
      minLength: { value: 3, type: "number", label: "Minimum Length" },
      maxLength: { value: 15, type: "number", label: "Maximum Length" },
      regex: {
        value: "",
        type: "text",
        label: "Regex Pattern",
        placeholder: "Provide regex pattern for custom validation",
      },
    },
    styleSettings: {
      ...commonStyleSettings,
      background: { value: "#fff", type: "color", label: "Background color" },
      text: { value: "#000", type: "color", label: "Text color" },
      fontSize: { value: "", type: "text", label: "Font size (px)" },
    },
    conditionalSettings: {
      ...commonConditionalSettings,
    },
    customJs: {
      ...commonJsEvents,
    },
  },
  {
    id: "numberInput",
    label: "Numeric Input",
    type: "input",
    inputType: "number",
    placeholder: "",
    icon: KeyboardIcon,
    displaySettings: {
      ...commonDisplaySettings,
      placeholder: {
        ...commonDisplaySettings.placeholder,
        value: "",
      },
    },
    validationSettings: {
      ...commonValidationSettings,
      // minLength: { value: 3, type: "number", label: "Minimum Length" },
      // maxLength: { value: 15, type: "number", label: "Maximum Length" },
      regex: {
        value: "",
        type: "text",
        label: "Regex Pattern",
        placeholder: "Provide regex pattern for custom validation",
      },
    },
    styleSettings: {
      ...commonStyleSettings,
      background: { value: "#fff", type: "color", label: "Background color" },
      text: { value: "#000", type: "color", label: "Text color" },
      fontSize: { value: "", type: "text", label: "Font size (px)" },
    },
    conditionalSettings: {
      ...commonConditionalSettings,
    },
    customJs: {
      ...commonJsEvents,
    },
  },
  {
    id: "emailInput",
    label: "Email Input",
    type: "input",
    inputType: "email",
    placeholder: "Enter your email",
    icon: EnvelopeClosedIcon,
    displaySettings: {
      ...commonDisplaySettings,
      placeholder: {
        ...commonDisplaySettings.placeholder,
        value: "abc@mail.com",
      },
    },
    validationSettings: {
      ...commonValidationSettings,
    },
    styleSettings: {
      ...commonStyleSettings,
    },
    conditionalSettings: {
      ...commonConditionalSettings,
    },
    customJs: {
      ...commonJsEvents,
    },
  },
  {
    id: "dateInput",
    label: "Date",
    type: "input",
    inputType: "date",

    icon: CalendarIcon,
    displaySettings: {
      ...commonDisplaySettings,
    },
    validationSettings: {
      minDate: { value: "", label: "Minimum Date", type: "date" },
      maxDate: { value: "", label: "Maximum Date", type: "date" },
      offset: {
        value: "",
        label: "Offset value",
        type: "number",
        placeholder: "Enter value",
      },
      quantifyOffset: {
        value: "",
        label: "Quantify offset",
        type: "select",
        dependent: false,
        options: [
          { value: "days", label: "Days" },
          { value: "weeks", label: "Weeks" },
          { value: "months", label: "Months" },
          { value: "years", label: "Years" },
        ],
      },
      ...commonValidationSettings,
    },
    styleSettings: {
      ...commonStyleSettings,
    },
    conditionalSettings: {
      ...commonConditionalSettings,
    },
    dataSettings: {
      optionList: {
        value: "",
        type: "select",
        dependent: false,
        label: "date type",
        options: [
          { value: "date", label: "dd-mm-yy" },
          { value: "datetime-local", label: "datetime local" },
          { value: "time", label: "time" },
          { value: "week", label: "week" },
          { value: "month", label: "month" },
        ],
      },
    },
    customJs: {
      ...commonJsEvents,
    },
  },
  {
    id: "textArea",
    label: "Text Area",
    type: "textArea",
    placeholder: "Type something",
    icon: TextAlignJustifyIcon,
    displaySettings: {
      ...commonDisplaySettings,
      cols: { value: "30", type: "text", label: "Columns" },
      rows: { value: "10", type: "text", label: "Rows" },
      placeholder: {
        ...commonDisplaySettings.placeholder,
        value: "Enter something",
      },
    },
    validationSettings: {
      ...commonValidationSettings,
    },
    styleSettings: {
      ...commonStyleSettings,
    },
    conditionalSettings: {
      ...commonConditionalSettings,
    },
    customJs: {
      ...commonJsEvents,
    },
  },
  {
    id: "select",
    label: "Dropdown",
    type: "select",
    dependent: false,

    icon: HeightIcon,
    displaySettings: {
      ...commonDisplaySettings,
      placeholder: {
        ...commonDisplaySettings.placeholder,
        value: "Enter text",
      },
    },
    validationSettings: {
      ...commonValidationSettings,
    },
    styleSettings: {
      ...commonStyleSettings,
      background: { value: "#fff", type: "color", label: "Background color" },
      text: { value: "#000", type: "color", label: "Text color" },
      fontSize: { value: "", type: "text", label: "Font size (px)" },
    },
    dataSettings: {
      parent: {
        value: false,
        type: "checkbox",
        label: "Does it have a parent",
      },
      selectParent: {
        value: "",
        type: "select",
        label: "Select the parent",
        // to identify, the select field when rendering for the hierarchy
        dependent: true,
      },
      optionList: {
        value: "",
        type: "row",
        label: "options",
        options: [
          {
            label: "Label 1",
            value: "value1",
            parentValue: "",
            // During rendering need to keep track of a parentId and its value
            //Depending on which need to render the options
          },
          {
            label: "Label 2",
            value: "value2",
            parentValue: "",
          },
        ],
      },
    },
    conditionalSettings: {
      ...commonConditionalSettings,
    },
    customJs: {
      ...commonJsEvents,
    },
  },
  {
    id: "checkboxInput",
    label: "Checkbox",
    type: "checkbox",
    icon: BoxIcon,
    displaySettings: {
      ...commonDisplaySettings,
      hidden: { value: false },
    },
    validationSettings: {
      ...commonValidationSettings,
      required: { value: false, message: "This field is required" },
    },
    styleSettings: {
      ...commonStyleSettings,
      inputClass: "border rounded",
      labelClass: "ml-2 text-sm",
    },
    conditionalSettings: {
      ...commonConditionalSettings,
    },
  },
  {
    id: "checkboxGroupInput",
    label: "",
    subLabel: "Check box group",
    type: "checkboxGroup",
    icon: LayersIcon,
    displaySettings: {
      ...commonDisplaySettings,
      hidden: { value: false },
    },
    validationSettings: {
      ...commonValidationSettings,
      required: { value: false, message: "This field is required" },
    },
    styleSettings: {
      ...commonStyleSettings,
      containerClass: "flex flex-col space-y-2",
    },
    dataSettings: {
      optionList: {
        value: "",
        type: "row",
        label: "options",
        options: [
          {
            label: "Label 1",
            value: "value1",
          },
          {
            label: "Label 2",
            value: "value2",
          },
        ],
      },
    },
    conditionalSettings: {
      ...commonConditionalSettings,
    },
    customJs: {
      ...commonJsEvents,
    },
  },

  {
    id: "container",
    label: "Container",
    type: "container",
    heading: "",
    icon: ContainerIcon,
    displaySettings: {
      heading: { value: "", type: "text", label: "Enter heading" },
    },
    styleSettings: {
      cols: { value: 3, type: "number", label: "Number of columns" },
    },
    conditionalSettings: {
      ...commonConditionalSettings,
    },
    customJs: {
      ...commonJsEvents,
    },
  },
];

export default elementsSchema;
