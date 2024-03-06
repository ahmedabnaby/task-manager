import React from "react";
import { Modal, Button } from "react-bootstrap";
import AddTaskForm, { AddTaskFormProps } from "./AddTaskForm";

type AddTaskModalProps = {
  show: boolean;
  handleClose: () => void;
  addTask: AddTaskFormProps["addTask"];
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({ show, handleClose, addTask }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddTaskForm addTask={addTask} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTaskModal;
