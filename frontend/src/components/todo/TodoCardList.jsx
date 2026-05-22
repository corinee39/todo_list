import './TodoCardList.css';

function TodoCardList({ todoSections }) {
  return (
    <div className="todo-card-list">
      {todoSections.map((section) => (
        <article className={`todo-card ${section.theme}`} key={section.id}>
          <h3>{section.title}</h3>

          {section.todos.map((todo, index) => (
            <p key={`${section.id}-${index}`}>○ {todo}</p>
          ))}
        </article>
      ))}
    </div>
  );
}

export default TodoCardList;