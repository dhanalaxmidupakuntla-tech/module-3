import { useState } from "react";
import TodosList from "./TodosList";

function App() {
  const [showTodos, setShowTodos] = useState(true);

  return (
    <div>
      <button onClick={() => setShowTodos(false)}>
        Unmount Todos
      </button>

      {showTodos && <TodosList />}
    </div>
  );
}

export default App;
