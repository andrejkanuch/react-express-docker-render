import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:4001";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await axios.get(`${API_BASE_URL}/todos`);
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }

    fetchTodos();
  }, []);

  async function addTodo() {
    if (newTodo.trim()) {
      const response = await axios.post(`${API_BASE_URL}/todos`, {
        text: newTodo,
      });
      setTodos([...todos, response.data]);
      setNewTodo("");
    }
  }

  async function toggleTodoCompletion(id) {
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`);
    setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
  }

  async function deleteTodo(id) {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <div className="App">
      <h1>Todo List</h1>
      <input
        type="text"
        placeholder="Add a new task"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodoCompletion(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
