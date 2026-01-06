import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const TodoApp = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (!todo) return;
    setTodos([...todos, { text: todo, done: false }]);
    setTodo("");
  };

  return (
    <Card>
      <CardHeader className="font-bold text-lg">Todo App</CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <Button onClick={addTodo}>Add</Button>
        </div>

        {todos.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <Checkbox
              checked={t.done}
              onCheckedChange={() =>
                setTodos(
                  todos.map((item, idx) =>
                    idx === i ? { ...item, done: !item.done } : item
                  )
                )
              }
            />
            <span className={t.done ? "line-through" : ""}>
              {t.text}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TodoApp;
