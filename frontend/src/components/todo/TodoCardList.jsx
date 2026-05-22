import { useState } from 'react';
import './TodoCardList.css';

function TodoCardList({ todoSections, onAddTodo, onToggleTodo }) {
  const [inputValues, setInputValues] = useState({});

  const handleChangeInput = (sectionId, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [sectionId]: value,
    }));
  };

  const handleSubmitTodo = (event, sectionId) => {
    event.preventDefault();

    const todoTitle = inputValues[sectionId]?.trim();

    if (!todoTitle) {
      return;
    }

    onAddTodo(sectionId, todoTitle);

    setInputValues((prevValues) => ({
      ...prevValues,
      [sectionId]: '',
    }));
  };

  return (
    <div className="todo-card-list">
      {todoSections.map((section) => (
        <article className={`todo-card ${section.theme}`} key={section.id}>
          <h3>{section.title}</h3>

          <div className="todo-list">
            {section.todos.map((todo) => (
              <label
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                key={todo.id}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggleTodo(section.id, todo.id)}
                />
                <span>{todo.title}</span>
              </label>
            ))}
          </div>

          <form
            className="todo-add-form"
            onSubmit={(event) => handleSubmitTodo(event, section.id)}
          >
            <input
              type="text"
              value={inputValues[section.id] || ''}
              placeholder="새 할 일 추가"
              onChange={(event) =>
                handleChangeInput(section.id, event.target.value)
              }
            />
            <button type="submit">추가</button>
          </form>
        </article>
      ))}
    </div>
  );
}

export default TodoCardList;