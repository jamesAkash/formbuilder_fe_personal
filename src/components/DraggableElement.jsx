import { useDraggable } from "@dnd-kit/core";
import FormElement from "./FormElement";

const DraggableElement = ({ element }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.uniqueId,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-2 bg-gray-200 rounded shadow-md cursor-grab"
    >
      {/* <p>{element.label || "Untitled Element"}</p> */}
      {element && <FormElement element={element} />}
    </div>
  );
};

export default DraggableElement;
