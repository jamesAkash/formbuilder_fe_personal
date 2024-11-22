import { useFormContext } from "../App";

const FormSchemaDisplay = () => {
  const { formElements } = useFormContext();
  return (
    <pre className=" p-4 bg-gray-800 text-white h-screen overflow-auto rounded-md text-sm">
      {JSON.stringify(formElements, null, 2)}
    </pre>
  );
};

export default FormSchemaDisplay;
