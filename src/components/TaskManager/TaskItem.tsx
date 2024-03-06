import React, { useState } from "react";
import { Task } from "../Dashboard";
import EditModal from "./EditModal"; // Import the EditModal component

type TaskItemProps = {
  task: Task;
  deleteTask: (id: number) => void;
  saveEditTask: (id: number, title: string, description: string, dueDate: string) => void;
  completeTask: (id: number) => void;
  editInput: React.RefObject<HTMLInputElement>;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, deleteTask, saveEditTask, completeTask, editInput }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate);

  const handleSaveEdit = (id: number) => {
    saveEditTask(id, editedTitle, editedDescription, editedDueDate);
    setIsEditing(false);
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedDueDate(task.dueDate);
    setShowModal(true);
  };

  return (
    <li className={task.completed ? "completed" : ""}>
      {showModal && (
        <EditModal
          editedTitle={editedTitle}
          editedDescription={editedDescription}
          editedDueDate={editedDueDate}
          setEditedTitle={setEditedTitle}
          setEditedDescription={setEditedDescription}
          setEditedDueDate={setEditedDueDate}
          handleSaveEdit={() => handleSaveEdit(task.id)}
          closeModal={() => setShowModal(false)}
        />
      )}
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            ref={editInput}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
          />
          <button onClick={() => handleSaveEdit(task.id)}>Save</button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Due Date: {task.dueDate}</p>
          <div className="task-actions">
            <button onClick={handleOpenModal}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <button onClick={() => completeTask(task.id)}>
              {task.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TaskItem;
