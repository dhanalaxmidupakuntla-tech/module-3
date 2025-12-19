import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TodoDetails() {
  const { todoId } = useParams();
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`)
      .then((res) => res.json())
      .then((data) => setTodo(data));
  }, [todoId]);

  if (!todo) return <p>Loading...</p>;

  return (
    <div>
      <h2>Todo Details</h2>
      <h4>ID: {todo.id}</h4>
      <h4>Title: {todo.title}</h4>
      <h4>Status: {todo.completed ? "Completed" : "Not Completed"}</h4>
    </div>
  );
}

export default TodoDetails;
