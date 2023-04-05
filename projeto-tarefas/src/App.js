import './App.css';

import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs"

const API = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  //Load todos on page load
  useEffect(() => {

    const loadData = async() => {
      setLoading(true)

      const res = await fetch(API + "/todos")
      .then((res) => {
        console.log(res.json)
        return res.json()
      })
      .then((data) => {
        console.log(data)
        return data
      })
      .catch((err) => console.log(err));

      setLoading(false);

      console.log(res)
      setTodos(res);
      // setTodos([]);
    };

    loadData()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    /preventDefault = impede que o evento padrão ocorra/

    const todo = {
      id: Math.random(),
      title,
      description,
      time,
      priority,
      done: false,
    }

    // // Envio para api
    // console.log(todo);

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // /fetch = busca/
    // /stringify = converte os valores para uma string json. Esse valor pode ser substituido especificando a função replacer/

    setTodos((prevState) => [...prevState,todo]);

    setTitle("");
    setDescription("");
    setTime("");
    // /* limpa o input após ser enviado*/
  };

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    });

    setTodos((prevState) => 
    prevState.map((t) => (t.id === data.id ? (t = data) : t)));
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className="header">
        <h1>React Todo</h1>
      </div>
      <div className="form">
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          {/* onSubmit é um evento*/}
          {/* handleSubmit é uma função que corresponde ao evento onSubmit*/}
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input 
            type="text" 
            name="title" 
            placeholder="Título da tarefa"
            onChange={(e) => setTitle(e.target.value)}
            /* e= evento, target=input  e colocando no setTitle o value que é o valor do input*/
            value={title || ""}
            required
            /* required= obrigatório*/
            />
          </div>
          <div className="form-control">
            <label htmlFor="description">Descrição:</label>
            <input 
            type="text" 
            name="description" 
            placeholder="Descrição da tarefa"
            onChange={(e) => setDescription(e.target.value)}            
            value={description || ""}
            required
            />
          </div>      
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input 
            type="number" 
            name="time" 
            placeholder="Tempo estimado (em horas)"
            onChange={(e) => setTime(e.target.value)}
            value={time || ""}
            required
            />
          </div>
          <div className="form-control">
          <label for="priority">Selecione a prioridade:</label>
          <select name="priority" id="priority" className="priority" onChange={(e) => setPriority(e.target.value)} >
            <option value="baixa">Baixa</option>
            <option value="normal" selected>Normal</option>
            <option value="importante">Importante</option>
            <option value="urgente">Urgente</option>
          </select>
          </div>
          <input type="submit" value="Criar Tarefa"/>
        </form>
      </div>
      <div className="list">
        <h2>Lista de tarefas:</h2>
      
        {todos instanceof Array && todos.length === 0 && <p>Não há tarefas!</p>}
        {todos instanceof Array && todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <p>Descrição: {todo.description}</p>
            <p>Prioridade: {todo.priority}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;