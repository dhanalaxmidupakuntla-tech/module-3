import { useState } from "react";

function TodoApp() {
    const [tasks, setTasks] = useState(["tea", "breakfast", "walk"]);
    const [newTask, setNewTask] = useState("");

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() === "") return;

        setTasks([...tasks, newTask]);
        setNewTask("");
    }

    function deleteTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    return (
        <>
            <div className="to-do-list">
                <h1>To Do List</h1>

                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                />

                <button className="add-button" onClick={addTask}>
                    Add
                </button>
            </div>

            <ol>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <span className="text">{task}</span>
                        <button onClick={() => deleteTask(index)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ol>
        </>
    );
}

export default TodoApp;
