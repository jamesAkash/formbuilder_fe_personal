import { useDroppable } from "@dnd-kit/core";

const DroppableArea = ({ children, id }) => {
  const { isOver, setNodeRef } = useDroppable({
    // dynamic id
    id: id,
  });
  const style = {
    height: "100%",
    width: "100%",
    border: isOver ? "2px dashed #ccc" : "",
    backgroundColor: isOver ? "#f0f3fa" : "#fff",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflow: "auto",
  };
  return (
    <div ref={setNodeRef} style={style}>
      {isOver ? "" : ""}
      {children}
    </div>
  );
};

export default DroppableArea;
