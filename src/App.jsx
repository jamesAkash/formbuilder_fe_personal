import React, { useState, useContext, createContext } from "react";

import elementsSchema from "./elementSchema";
import {
  CreationArea,
  FormPreview,
  FormSchemaDisplay,
  SettingsModal,
  Sidebar,
} from "./components";
import { DndContext } from "@dnd-kit/core";
import DroppableArea from "./components/DroppableArea";
import TestFormPreview from "./components/TestFormPreview";

const FormContext = createContext();
export const useFormContext = () => useContext(FormContext);

function App() {
  const [formElements, setFormElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isJsonVisible, setIsJsonVisible] = useState(false);
  const [idCounter, setIdCounter] = useState(0);

  const handleDrop = (event) => {
    const { active, over } = event;

    if (over) {
      const draggedElement = elementsSchema.find((el) => el.id === active.id);
      if (draggedElement) {
        // unique ID for the new element
        const newElement = {
          ...draggedElement,
          uniqueId: `${draggedElement.id}-${idCounter}`,
        };
        setIdCounter((prev) => prev + 1);

        if (over.id === "drop-master") {
          setFormElements((prev) => [...prev, newElement]);
        } else if (over.id.startsWith("container")) {
          const [_, containerId, zoneIndex] = over.id.split("-");

          setFormElements((prev) =>
            prev.map((el) =>
              el.id === containerId
                ? {
                    ...el,
                    zones: {
                      ...(el.zones || {}),
                      [zoneIndex]: [
                        ...(el.zones?.[zoneIndex] || []),
                        newElement,
                      ],
                    },
                  }
                : el
            )
          );
        }
      }
    }
  };

  const removeElement = (id) =>
    setFormElements((prev) => prev.filter((el) => el.uniqueId !== id));

  const updateElement = (updatedElement) => {
    setFormElements((prev) =>
      prev.map((el) =>
        el.uniqueId === updatedElement.uniqueId ? updatedElement : el
      )
    );
    setSelectedElement(null);
  };

  return (
    <FormContext.Provider
      value={{
        formElements,
        removeElement,
        setSelectedElement,
        updateElement,
        setFormElements,
      }}
    >
      <div className="flex h-screen">
        <DndContext onDragEnd={handleDrop}>
          <Sidebar
            jsonBtnToggle={() => setIsJsonVisible((p) => !p)}
            showPreview={() => setShowPreview((p) => !p)}
          />

          <DroppableArea id="drop-master">
            <CreationArea setShowPreview={setShowPreview} />
          </DroppableArea>
        </DndContext>
        <div className="flex flex-col">
          {isJsonVisible && <FormSchemaDisplay />}
        </div>
        {selectedElement && <SettingsModal element={selectedElement} />}
        {showPreview && (
          <TestFormPreview onClose={() => setShowPreview(false)} />
        )}
      </div>
    </FormContext.Provider>
  );
}

export default App;
