import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Todos() {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data.slice(0, 10)));
  }, []);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="container">
      <button className="logout-btn" onClick={logout}>Logout</button>

      <div className="todo-grid">
        {todos.map(todo => (
          <div className="todo-card" key={todo.id}>
            <h4>{todo.title}</h4>
            <p>{todo.completed ? "Completed" : "Not Completed"}</p>
          </div>
        ))}
      </div>
    </div>

  );
}

export default Todos;
