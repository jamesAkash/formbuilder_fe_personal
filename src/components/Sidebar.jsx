import { EnterFullScreenIcon, ViewVerticalIcon } from "@radix-ui/react-icons";
import { useFormContext } from "../App";
import elementsSchema from "../elementSchema";
import { useDraggable } from "@dnd-kit/core";

const Sidebar = ({ showPreview, jsonBtnToggle }) => {
  return (
    <aside className="bg-gray-100 p-4 flex flex-col justify-between pb-24">
      <div>
        {elementsSchema.map((el) => (
          <Element el={el} key={el.id} />
        ))}
      </div>
      <div className="text-sm">
        <button
          className="bg-blue-500 flex items-center text-nowrap   text-white px-4 py-2 rounded mt-4"
          onClick={() => showPreview(true)}
        >
          <div className="p-2">
            <EnterFullScreenIcon />
          </div>
          Preview Form
        </button>
        <button
          className="bg-blue-500 flex items-center text-white px-4 py-2 rounded mt-4"
          onClick={jsonBtnToggle}
        >
          <div className="p-2">
            <ViewVerticalIcon />
          </div>
          Schema View
        </button>
      </div>
    </aside>
  );
};

const Element = ({ el }) => {
  const { addElement } = useFormContext();

  const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
    {
      id: el.id,
    }
  );

  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
    padding: "8px",
    margin: "4px",
    cursor: active ? "grabbing" : "grab",
  };

  return (
    <button
      onClick={() => addElement(el.id)}
      className="capitalize flex w-full text-left items-center gap-2 bg-white rounded-md shadow-xl border px-3 py-2 my-2"
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {el.icon && (
        <div className="p-[2px] border border-slate-600 rounded-md text-sm text-slate-800 grabbing:text-slate-900">
          <el.icon />
        </div>
      )}
      <span className="text-nowrap text-sm">{el?.subLabel || el.label}</span>
    </button>
  );
};

export default Sidebar;
