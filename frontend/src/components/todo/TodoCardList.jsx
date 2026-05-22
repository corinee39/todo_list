import './TodoCardList.css';

function TodoCardList() {
  return (
    <div className="todo-card-list">
      <article className="todo-card pink">
        <h3>나를 사랑하고 돌보기</h3>
        <p>○ 아침명상 / 기도 / 스트레칭</p>
        <p>○ 유산균, 비타민C</p>
      </article>

      <article className="todo-card yellow">
        <h3>공부</h3>
        <p>○ 정보처리기사 필기 기출 풀이</p>
        <p>○ 오답노트 정리하기</p>
      </article>

      <article className="todo-card green">
        <h3>대화와 준비</h3>
        <p>○ 수험표, 신분증 챙기기</p>
        <p>○ 스터디 참여하기</p>
      </article>
    </div>
  );
}

export default TodoCardList;