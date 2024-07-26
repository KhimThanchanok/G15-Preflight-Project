import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import { type TodoItem } from './types';

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [todoHeader, setTodoHeader] = useState("");
  const [priority, setPriority] = useState("");
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");

  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  async function fetchData() {
    const res = await axios.get<TodoItem[]>("api/todo");
    setTodos(res.data);
  }

  useEffect(() => {
    fetchData();
    setPriority("medium");
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    switch (name) {
      case "inputText":
        setInputText(value);
        break;
      case "todoHeader":
        setTodoHeader(value);
        break;
      case "priority":
        setPriority(value);
        break;
    }
  }

  function handleSubmit() {
    if (!inputText || !todoHeader) return;
    if (mode === "ADD") {
      axios
        .request({
          url: "/api/todo",
          method: "put",
          data: { todoHeader, todoText: inputText, priority },
        })
        .then(() => {
          setInputText("");
          setTodoHeader("");
          setPriority("medium");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    } else {
      axios
        .request({
          url: "/api/todo",
          method: "patch",
          data: { id: curTodoId, todoText: inputText, todoHeader, priority },
        })
        .then(() => {
          setInputText("");
          setTodoHeader("");
          setPriority("medium");
          setMode("ADD");
          setCurTodoId("");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    }
  }

  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { id } })
      .then(fetchData)
      .then(() => {
        setMode("ADD");
        setInputText("");
        setTodoHeader("");
        setPriority("medium");
      })
      .catch((err) => alert(err));
  }

  function handleCancel() {
    setMode("ADD");
    setInputText("");
    setTodoHeader("");
    setPriority("medium");
    setCurTodoId("");
  }

  function getCardColor(priority: string) {
    switch (priority) {
      case "low":
        return "#ABFC88"; // Light green
      case "medium":
        return "#FFF894"; // Light yellow
      case "high":
        return "#FF9494"; // Light red
      default:
        return "#ffffff"; // White
    }
  }

  return (
    <div style={{ backgroundColor: '#F5F5DC', color: 'white', padding: '20px', minHeight: '100vh' }}>
      <div className="container">
        <header >
          <h1 style={{ color: '#A67B5B', fontFamily: "monospace"}}>TODO APP</h1>
        </header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <main style={{ flex: 1, marginRight: '1rem' }}>
            <div style={{ alignItems: "start", marginBottom: '1rem' }}>
              <input 
                type="text" 
                name="todoHeader"
                placeholder="Title" 
                onChange={handleChange} 
                value={todoHeader} 
                data-cy="todo-header" 
                style={{ flex: 1, marginRight: '1rem' }} 
                className="form-control" 
              />
              <input 
                type="text" 
                name="inputText" 
                placeholder="Notes" 
                onChange={handleChange} 
                value={inputText} 
                data-cy="input-text" 
                style={{ flex: 1, marginRight: '1rem', marginTop: '0.5rem'}} 
                className="form-control" 
              />
              <div style={{ display: "flex", alignItems: "center", marginBottom: '1rem', marginTop: '0.5rem'}}>
                <button
                  onClick={() => setPriority("low")}
                  style={{ backgroundColor: priority === "low" ? '#ABFC88' : '#FFFFFF', color: 'black', marginRight: '1rem' }}
                  className="btn"
                >
                  Low
                </button>
                <button
                  onClick={() => setPriority("medium")}
                  style={{ backgroundColor: priority === "medium" ? '#FFF894' : '#FFFFFF', color: 'black', marginRight: '1rem' }}
                  className="btn"
                >
                  Medium
                </button>
                <button
                  onClick={() => setPriority("high")}
                  style={{ backgroundColor: priority === "high" ? '#FF9494' : '#FFFFFF', color: 'black' }}
                  className="btn"
                >
                  High
                </button>
              </div>
              <button 
                onClick={handleSubmit} 
                data-cy="submit" 
                style={{ backgroundColor: '#EED9C4', color: '#A67B5B' }}
                className="btn me-2 "
              >
                {mode === "ADD" ? "Submit" : "Update"}
              </button>
              {mode === "EDIT" && (
                <button 
                  onClick={handleCancel} 
                  className="btn"
                >
                  Cancel
                </button>
              )}
            </div>
            <Row xs={1} md={2} lg={3} className="g-4" data-cy="todo-item-wrapper">
              {todos
                .filter((item) => selectedPriority === "all" || item.priority === selectedPriority)
                .sort(compareDate)
                .map((item) => {
                  const { date, time } = formatDateTime(item.createdAt);
                  return (
                    <Col key={item.id}>
                      <Card className="text-dark" style={{ backgroundColor: getCardColor(item.priority) }}>
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <div>
                              <Card.Title>{item.todoHeader}</Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">{date} at {time}</Card.Subtitle>
                              <Card.Text style={{ whiteSpace: 'normal', wordBreak: 'break-word',  color: 'black' }}>
                                {item.todoText}
                              </Card.Text>
                            </div>
                            <div className="d-flex flex-column justify-content-start">
                              <button
                                className="btn mb-2"
                                onClick={() => {
                                  setMode("EDIT");
                                  setCurTodoId(item.id);
                                  setInputText(item.todoText);
                                  setTodoHeader(item.todoHeader);
                                  setPriority(item.priority);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                </svg>
                              </button>
                              <button
                                className="btn"
                                onClick={() => handleDelete(item.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          </main>
          <aside style={{ width: '200px', backgroundColor: '#EED9C4', padding: '1.3rem', borderRadius: '8px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="priority-filter" style={{ marginRight: '1rem', color: '#A67B5B'}}>Filter by Priority:</label>
              <select
                id="priority-filter"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="form-select"
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;

function formatDateTime(dateStr: string) {
  if (!dayjs(dateStr).isValid()) {
    return { date: "N/A", time: "N/A" };
  }
  const dt = dayjs(dateStr);
  const date = dt.format("D/MM/YY");
  const time = dt.format("HH:mm");
  return { date, time };
}

function compareDate(a: TodoItem, b: TodoItem) {
  const da = dayjs(a.createdAt);
  const db = dayjs(b.createdAt);
  return da.isBefore(db) ? -1 : 1;
}
