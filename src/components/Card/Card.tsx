import React from "react";
import "./style.css"
import { Draggable} from "@hello-pangea/dnd";

interface TaskProps {
  card: {
    id: string;
    name: string;
  };
  index: number;
}

const Card: React.FC<TaskProps> = ({ card, index }) => {
  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <p>{card.name}</p>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Card;
