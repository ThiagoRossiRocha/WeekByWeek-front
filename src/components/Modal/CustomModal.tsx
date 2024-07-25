import Modal from "react-modal";
import React from "react";
import "./style.css";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (text: string) => void;
  placeholder: string;
  buttonText: string;
  title: string;
  value: string;
  onChange: any;
  isEditing?: boolean;
}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
  placeholder,
  buttonText,
  title,
  value,
  onChange,
  isEditing
}) => {
  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        {!isEditing ? (
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="modal-input"
          />
        ) : (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="modal-text-area"
            rows={5} // você pode ajustar o número de linhas conforme necessário
          />
        )}

        <div className="modal-buttons">
          <button onClick={handleSubmit} className="modal-button">
            {buttonText}
          </button>
          <button onClick={onRequestClose} className="modal-button cancel">
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
