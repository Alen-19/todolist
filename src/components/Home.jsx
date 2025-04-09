import React from "react";
import "../App.css";
import { useState, useEffect } from "react";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (todo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: todo,
          status: false,
          date: new Date().toLocaleDateString(),
        },
      ]);
      setTodo("");
    }
  };

  const toggleStatus = (id) => {
    setTodos(
      todos.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const startEditing = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTodos(
        todos.map((item) =>
          item.id === id ? { ...item, text: editText.trim() } : item
        )
      );
      setEditId(null);
      setEditText("");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.status;
    if (filter === "completed") return todo.status;
    return true;
  });

  const getDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  };

  return (
    <div className="app">
      <div className="mainHeading">
        <h1>ToDo List</h1>
      </div>
      <div className="subHeading">
        <h2>
          Whoop, it's {getDay()} {" "}
          <span role="img" aria-label="moon">🌝</span> {" "}
          <span role="img" aria-label="coffee">☕</span>
        </h2>
      </div>

      <form onSubmit={addTodo} className="input">
        <input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          type="text"
          placeholder="🖊️ Add item..."
        />
        <i onClick={addTodo} className="fas fa-plus"></i>
      </form>

      <div className="filters" style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            background: filter === "all" ? "#4a90e2" : "rgba(255,255,255,0.1)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            margin: "0 5px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          style={{
            background: filter === "active" ? "#4a90e2" : "rgba(255,255,255,0.1)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            margin: "0 5px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{
            background: filter === "completed" ? "#4a90e2" : "rgba(255,255,255,0.1)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            margin: "0 5px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Completed
        </button>
      </div>

      {filteredTodos.map((obj) => (
        <div key={obj.id} className="todos">
          <div className="todo">
            <div className="left">
              <input
                checked={obj.status}
                onChange={() => toggleStatus(obj.id)}
                type="checkbox"
              />
              {editId === obj.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                  autoFocus
                  onKeyPress={(e) => e.key === "Enter" && saveEdit(obj.id)}
                />
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p className={obj.status ? "completed" : ""}>
                    {obj.text}
                  </p>
                  <span className="date-badge">{obj.date}</span>
                </div>
              )}
            </div>
            <div className="right">
              {editId === obj.id ? (
                <i onClick={() => saveEdit(obj.id)} className="fas fa-save"></i>
              ) : (
                <i
                  onClick={() => startEditing(obj.id, obj.text)}
                  className="fas fa-edit"
                ></i>
              )}
              <i onClick={() => deleteTodo(obj.id)} className="fas fa-trash"></i>
            </div>
          </div>
        </div>
      ))}

      {filteredTodos.length === 0 && (
        <div className="empty-state">
          {filter === "all"
            ? "No todos yet. Add some tasks!"
            : filter === "active"
            ? "No active tasks"
            : "No completed tasks"}
        </div>
      )}
    </div>
  );
}

export default App;