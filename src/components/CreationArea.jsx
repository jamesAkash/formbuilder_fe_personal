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
      className="bg-white group p-2 rounded-md mt-4"
    >
      <div className="flex justify-between w-full">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 text-gray-500 group-hover:text-gray-700"
          style={{
            cursor: active ? "grabbing" : "grab",
          }}
        >
          <DragHandleDots2Icon />
        </div>
        <div className="flex gap-1 opacity-60 px-1 py-1 group-hover:opacity-100 rounded-lg border-slate-300 border">
          <button
            onClick={() => setSelectedElement(element)}
            className="text-blue-500 hover:text-blue-700"
          >
            <GearIcon />
          </button>
          <button
            onClick={() => removeElement(element.uniqueId)}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <FormElement element={element} />
    </div>
  );
};

const CreationArea = () => {
  const { formElements, setFormElements } = useFormContext();
  console.log(formElements);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      console.log("No valid drop target");
      return;
    }

    const draggedElement = formElements.find((el) => el.uniqueId === active.id);

    if (!draggedElement) {
      console.log("Dragged element not found in formElements");
      return;
    }

    const newElement = {
      ...draggedElement,
      uniqueId: `section-${draggedElement.id}-${Date.now()}`,
    };
    // console.log(over.id.startsWith("container"));
    if (over.id.startsWith("container")) {
      const parts = over.id.split("-");
      if (parts.length >= 3) {
        const [test, containerId, zoneIndex] = parts;
        console.log("YOLO");
        // Update the container's zones.
        setFormElements((prev) =>
          prev.map((el) => {
            console.log("--------------->", el, test + "-" + containerId);
            if (el.uniqueId === test + "-" + containerId) {
              const updatedZones = { ...(el.zones || {}) };
              console.log("UPDATED ZONES ->", updatedZones);
              // Add the new element to the specified zone.
              updatedZones[zoneIndex] = [
                ...(updatedZones[zoneIndex] || []),
                newElement,
              ];
              console.log(updatedZones);
              // Update the children for rendering purposes.
              const updatedChildren = [...(el.children || []), newElement];

              return { ...el, zones: updatedZones, children: updatedChildren };
            }
            return el;
          })
        );
        return;
      }
    }

    // Handle reordering if the element is not being dropped into a container.
    if (active.id !== over.id) {
      const oldIndex = formElements.findIndex(
        (el) => el.uniqueId === active.id
      );
      const newIndex = formElements.findIndex((el) => el.uniqueId === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedElements = arrayMove(formElements, oldIndex, newIndex);
        setFormElements(reorderedElements);
      }
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <main className="flex-1 mx-4 my-2 rounded-md shadow-sm p-4 bg-slate-200 ">
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
