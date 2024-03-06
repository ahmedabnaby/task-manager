import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Task } from '../Dashboard';


export type AddTaskFormProps = {
    addTask: (task: Task) => void;
};

const AddTaskForm: React.FC<AddTaskFormProps> = ({ addTask }) => {
    const today = new Date().toISOString().slice(0, 10);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<string>(today); // Set default value to today's date
    const [type, setType] = useState<string>("Personal");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !dueDate) {
            alert("Title and Due Date are required!");
            return;
        }

        const newTask: Task = {
            id: Date.now(),
            title,
            description,
            dueDate,
            completed: false,
            userId: "user_id", // You can replace this with the actual user ID
            type,
        };

        addTask(newTask);
        setTitle("");
        setDescription("");
        setDueDate("");
        setType("Personal"); // Reset type to default after submitting
    };

    return (
        <div id="add-task-form">
            <h5>New task ..</h5>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    placeholder="Enter task description..."
                    modules={{
                        toolbar: [
                            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                            [{size: []}],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, 
                            {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image', 'video'],
                            ['clean']
                        ],
                    }}
                />
                <input
                    type="date"
                    placeholder='Due date'
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
                <select value={type} className='mb-3' onChange={(e) => setType(e.target.value)}>
                    <option value="Personal">Personal</option>
                    <option value="Business">Business</option>
                </select>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AddTaskForm;
