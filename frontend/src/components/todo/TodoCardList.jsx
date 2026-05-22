import './TodoCardList.css';

function TodoCardList({ todoSections, onToggleTodo }) {
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
        </article>
      ))}
    </div>
  );
}

export default TodoCardList;