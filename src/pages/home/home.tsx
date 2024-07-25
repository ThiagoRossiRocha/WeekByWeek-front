import "./style.css";
import { BsPlus, BsPlusLg } from "react-icons/bs";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Modal from "../../components/Modal/CustomModal";

export function Home(): JSX.Element {
  const [columns, setColumns] = useState<{
    [key: string]: {
      id: string;
      title: string;
      cards: { id: string; text: string }[];
    };
  }>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [newCard, setNewCard] = useState("");
  const [editingCardText, setEditingCardText] = useState("");
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);
  const [isAddCardModalOpen, setAddCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setEditCardModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState("");
  const [editingCard, setEditingCard] = useState<{
    id: string;
    text: string;
    columnId: string;
  } | null>(null);

  const handleAddColumn = (title: string) => {
    const newColumnId = `coluna-${columnOrder.length + 1}`;
    setColumns({
      ...columns,
      [newColumnId]: { id: newColumnId, title, cards: [] },
    });
    setColumnOrder([...columnOrder, newColumnId]);
  };

  const handleAddCardSubmit = (text: string) => {
    if (currentColumnId) {
      handleAddCard(currentColumnId, text);
    }
    setAddCardModalOpen(false);
    setNewCard("");
  };

  const handleEditCardSubmit = (text: string) => {
    if (editingCard) {
      const updatedColumn = {
        ...columns[editingCard.columnId],
        cards: columns[editingCard.columnId].cards.map((card) =>
          card.id === editingCard.id ? { ...card, text } : card
        ),
      };
      setColumns({
        ...columns,
        [editingCard.columnId]: updatedColumn,
      });
    }
    setEditCardModalOpen(false);
    setEditingCard(null);
    setNewCard("");
  };

  const handleAddCardClick = (columnId: string) => {
    setCurrentColumnId(columnId);
    setAddCardModalOpen(true);
  };

  const handleEditCardDoubleClick = (card: any, columnId: any) => {
    setEditingCard({ id: card.id, text: card.text, columnId });
    setEditingCardText(card.text);
    setEditCardModalOpen(true);
  };

  const handleAddCard = (columnId: string, text: string) => {
    const newCardId = `${columnId}-${columns[columnId].cards.length + 1}`;
    const newCardData = { id: newCardId, text };
    const updatedColumn = {
      ...columns[columnId],
      cards: [...columns[columnId].cards, newCardData],
    };
    setColumns({
      ...columns,
      [columnId]: updatedColumn,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCard(event.target.value);
  };

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditingCardText(event.target.value);
  };
  
  const handleColumnTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewColumnTitle(event.target.value);
  };

  const handleColumnSubmit = (title: string) => {
    handleAddColumn(title);
    setColumnModalOpen(false);
    setNewColumnTitle("");
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = Array.from(columns[source.droppableId].cards);
    const [movedCard] = sourceColumn.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, movedCard);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          cards: sourceColumn,
        },
      });
    } else {
      const destinationColumn = Array.from(
        columns[destination.droppableId].cards
      );
      destinationColumn.splice(destination.index, 0, movedCard);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          cards: sourceColumn,
        },
        [destination.droppableId]: {
          ...columns[destination.droppableId],
          cards: destinationColumn,
        },
      });
    }
  };

  return (
    <div className="box">
      <DragDropContext onDragEnd={onDragEnd}>
        <h2 className="title">WeekByWeek</h2>
        <div className="item">
          {columnOrder.map((columnId) => (
            <div key={columnId} className="item-column">
              <h4 className="title-column">{columns[columnId].title}</h4>

              <Droppable droppableId={columnId} type="task">
                {(provided) => (
                  <div
                    className="data"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {columns[columnId].cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="card-box"
                            onDoubleClick={() =>
                              handleEditCardDoubleClick(card, columnId)
                            }
                          >
                            <div className="content">{card.text}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                className="button-add-card"
                onClick={() => handleAddCardClick(columnId)}
              >
                <BsPlus size={30} />
              </button>
            </div>
          ))}

          <button
            className="button-add-column"
            onClick={() => setColumnModalOpen(true)}
          >
            <BsPlusLg size={35} />
          </button>
        </div>

        <Modal
          isOpen={isColumnModalOpen}
          onRequestClose={() => setColumnModalOpen(false)}
          onSubmit={(title) => handleColumnSubmit(title)}
          placeholder="Digite o nome da coluna..."
          buttonText="Confirmar"
          title="Nova Coluna"
          value={newColumnTitle}
          onChange={handleColumnTitleChange}
        />
        <Modal
          isOpen={isAddCardModalOpen}
          onRequestClose={() => setAddCardModalOpen(false)}
          onSubmit={(text) => handleAddCardSubmit(text)}
          placeholder="Digite a anotação..."
          buttonText="Confirmar"
          title="Nova Nota"
          value={newCard}
          onChange={handleInputChange}
        />

        <Modal
          isOpen={isEditCardModalOpen}
          onRequestClose={() => setEditCardModalOpen(false)}
          onSubmit={(text) => handleEditCardSubmit(text)}
          placeholder="Digite a anotação..."
          buttonText="Confirmar"
          title="Editar Nota"
          value={editingCardText}
          onChange={handleEditInputChange}
          isEditing={true}
        />
      </DragDropContext>
    </div>
  );
}

export default Home;
