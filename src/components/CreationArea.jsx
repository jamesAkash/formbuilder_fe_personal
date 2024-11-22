import {
  DragHandleDots2Icon,
  GearIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useFormContext } from "../App";
import FormElement from "./FormElement";
import {
  DndContext,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Tooltip } from "../UI";

const SortableItem = ({ id, element }) => {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });
  const { removeElement, setSelectedElement } = useFormContext();
  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
    transition,
    width: `${
      element.type != "container" ? element.styleSettings.width.value : "100%"
    }${element.type != "container" && element.styleSettings.widthUnit.value}`,
    background: active ? "#f8fafc" : "",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative px-4 py-6 mb-4 bg-white border rounded-lg shadow group"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute max-w-max top-1 left-2 cursor-grab p-1 text-gray-500 group-hover:text-gray-700"
        style={{
          cursor: active ? "grabbing" : "grab",
        }}
      >
        <DragHandleDots2Icon />
      </div>

      <FormElement element={element} />

      <div className="absolute top-1 right-2 flex gap-2 opacity-60 px-2 py-1 group-hover:opacity-100 rounded-lg border-slate-300 border">
        <button
          onClick={() => setSelectedElement(element)}
          className="text-blue-500 hover:text-blue-700"
        >
          <GearIcon />
        </button>
        <button
          onClick={() => removeElement(element.uniqueId)}
          className=" text-red-500 hover:text-red-700"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

const CreationArea = () => {
  const { formElements, setFormElements } = useFormContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(MouseSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log(active, over);
    if (active.id !== over.id) {
      const oldIndex = formElements.findIndex(
        (el) => el.uniqueId === active.id
      );
      const newIndex = formElements.findIndex((el) => el.uniqueId === over.id);
      setFormElements(arrayMove(formElements, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <main className="flex-1 p-4 bg-slate-200  gap-4">
        <SortableContext
          items={formElements.map((el) => el.uniqueId)}
          strategy={verticalListSortingStrategy}
        >
          {formElements.map((element) => (
            <SortableItem
              key={element.uniqueId}
              id={element.uniqueId}
              element={element}
            />
          ))}
        </SortableContext>
      </main>
    </DndContext>
  );
};

export default CreationArea;
