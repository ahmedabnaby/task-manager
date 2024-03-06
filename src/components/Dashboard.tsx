import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import TaskItem from "./TaskManager/TaskItem";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { AddTaskFormProps } from "./TaskManager/AddTaskForm";
import AddTaskModal from "./TaskManager/AddTaskModal";
export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  userId: string;
  type: string; // Add the 'type' property to the Task type
};
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTaskValue, setSearchTaskValue] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      // Fetch tasks for the current user
      const fetchTasks = async () => {
        const userTasksRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userTasksRef);
        if (snapshot.exists()) {
          setTasks(snapshot.data()?.tasks || []);
        }
      };

      fetchTasks();
    }
  }, [user]);

  const addTask: AddTaskFormProps["addTask"] = async (task) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const newTask: Task = {
      ...task,
      completed: false,
      userId: user.uid,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    const userTasksRef = doc(db, "users", user.uid);
    await setDoc(userTasksRef, {
      tasks: updatedTasks,
    }, { merge: true });

    setShowModal(false);
  };

  const deleteTask = async (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    if (user) {
      const userTasksRef = doc(db, "users", user.uid);
      await updateDoc(userTasksRef, {
        tasks: updatedTasks,
      });
    }
  };

  const saveEditTask = async (id: number, newTitle: string, newDescription: string, newDueDate: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, title: newTitle, description: newDescription, dueDate: newDueDate } : task
    );
    setTasks(updatedTasks);

    if (user) {
      const userTasksRef = doc(db, "users", user.uid);
      await setDoc(userTasksRef, {
        tasks: updatedTasks,
      }, { merge: true });
    }
  };

  const completeTask = async (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    if (user) {
      const userTasksRef = doc(db, "users", user.uid);
      await setDoc(userTasksRef, {
        tasks: updatedTasks,
      }, { merge: true });
    }
  };

  const searchTask = (taskName: string) => {
    setSearchTaskValue(taskName);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTaskValue.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTaskValue.toLowerCase())
  );

  const getCurrentDate = (): { day: string; month: string; date: number; year: number } => {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();

    return { day, month, date, year };
  };

  const TodaysDate: React.FC = () => {
    const { day, month, date, year } = getCurrentDate();

    return (
      <p>
        {day} <span>{month} {date}, {year}</span>
      </p>
    );
  };

  const TypeCount: React.FC<{ list: Task[]; type: string }> = ({ list, type }) => (
    <p>
      {list.filter((l) => l.type === type).length} <span>{type}</span>
    </p>
  );

  const PersonalTask: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
    <TypeCount list={tasks} type="Personal" />
  );

  const BusinessTask: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
    <TypeCount list={tasks} type="Business" />
  );

  return (
    <Container>
      <header>
        <div className="date">
          <TodaysDate />
        </div>
        <div className="type-of-tasks">
          <PersonalTask tasks={tasks} />
          <BusinessTask tasks={tasks} />
        </div>
      </header>

      <Row>
        <Col md={6} className="leftCol">
          <div className="task-list">
            <div className="search-task">
              <input
                type="text"
                placeholder="Search Task"
                value={searchTaskValue}
                onChange={(e) => searchTask(e.target.value)}
              />
            </div>
            <ul>
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  deleteTask={deleteTask}
                  saveEditTask={saveEditTask}
                  completeTask={completeTask}
                  editInput={editInput}
                />
              ))}
            </ul>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add Task
            </Button>
          </div>
        </Col>
        <Col md={6}>
          <Image src="./Designerr.jpeg" className="rightImg" />
        </Col>
      </Row>

      <AddTaskModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        addTask={addTask}
      />
    </Container>
  );
};

export default Dashboard;
