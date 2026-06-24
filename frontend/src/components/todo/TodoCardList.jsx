import { useState } from "react";
import "./TodoCardList.css";

function TodoCardList({
  selectedDate,
  todoSections,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  readOnly = false,
}) {
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
      [sectionId]: "",
    }));
  };

  return (
    <div className="todo-card-list">
      <div className="todo-list-header">
        <div>
          <h2>선택된 날짜 할 일</h2>
          <p>{selectedDate}</p>
        </div>
      </div>

      {todoSections.map((section) => (
        <article className={`todo-card ${section.theme}`} key={section.id}>
          <h3>{section.title}</h3>

          <div className="todo-list">
            {section.todos.length === 0 ? (
              <p className="todo-empty-message">
                선택한 날짜의 할 일이 없습니다.
              </p>
            ) : (
              section.todos.map((todo) => (
                <div
                  className={`todo-item-row ${
                    todo.completed ? "completed" : ""
                  }`}
                  key={todo.id}
                >
                  <label className="todo-item">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      disabled={readOnly}
                      onChange={
                        readOnly
                          ? undefined
                          : () => onToggleTodo(section.id, todo.id)
                      }
                    />
                    <span>{todo.title}</span>
                  </label>

                  {!readOnly && (
                    <button
                      className="todo-delete-button"
                      onClick={() => onDeleteTodo(section.id, todo.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {!readOnly && (
            <form
              className="todo-add-form"
              onSubmit={(event) => handleSubmitTodo(event, section.id)}
            >
              <input
                type="text"
                value={inputValues[section.id] || ""}
                placeholder="새 할 일 추가"
                onChange={(event) =>
                  handleChangeInput(section.id, event.target.value)
                }
              />
              <button type="submit">추가</button>
            </form>
          )}
        </article>
      ))}
    </div>
  );
}

export default TodoCardList;
