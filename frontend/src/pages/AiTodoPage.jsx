import { useState } from 'react';
import { generateAiTodos } from '../api/aiApi';
import './AiTodoPage.css';

const DEFAULT_RECOMMEND_ITEMS = [
  {
    id: 1,
    title: '운영체제 프로세스와 스레드 개념 정리',
    checked: true,
  },
  {
    id: 2,
    title: '데이터베이스 정규화 1~3정규형 복습',
    checked: true,
  },
  {
    id: 3,
    title: '네트워크 TCP/IP 계층 구조 암기',
    checked: false,
  },
  {
    id: 4,
    title: '소프트웨어 공학 UML 다이어그램 보기',
    checked: false,
  },
  {
    id: 5,
    title: '필기 기출문제 20문제 풀기',
    checked: true,
  },
  {
    id: 6,
    title: '오답노트 정리하기',
    checked: false,
  },
];

const PRACTICAL_RECOMMEND_ITEMS = [
  {
    id: 1,
    title: '요구사항 확인 예상문제 풀기',
    checked: true,
  },
  {
    id: 2,
    title: '화면 설계 UML 다이어그램 복습',
    checked: true,
  },
  {
    id: 3,
    title: 'SQL 작성 문제 5개 풀기',
    checked: true,
  },
  {
    id: 4,
    title: 'Java 기본 문법 문제 풀기',
    checked: false,
  },
  {
    id: 5,
    title: '보안 용어 암기하기',
    checked: false,
  },
  {
    id: 6,
    title: '실기 오답노트 정리하기',
    checked: false,
  },
];

function getFallbackItems(goal) {
  if (goal.includes('실기')) {
    return PRACTICAL_RECOMMEND_ITEMS;
  }

  return DEFAULT_RECOMMEND_ITEMS;
}

function convertAiItemsToRecommendItems(items) {
  return items.map((item, index) => ({
    id: Date.now() + index,
    title: item,
    checked: true,
  }));
}

function AiTodoPage({ onChangePage, onAddAiTodos }) {
  const [goal, setGoal] = useState('정보처리기사 필기 공부하기');
  const [period, setPeriod] = useState('today');
  const [recommendItems, setRecommendItems] = useState(DEFAULT_RECOMMEND_ITEMS);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  const handleGenerateTodos = async () => {
    const trimmedGoal = goal.trim();

    if (!trimmedGoal) {
      alert('목표를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setApiMessage('');

    try {
      const result = await generateAiTodos({
        goal: trimmedGoal,
        period,
      });

      const items = result.items || [];

      if (items.length === 0) {
        setRecommendItems(getFallbackItems(trimmedGoal));
        setApiMessage('AI 응답이 비어 있어 임시 추천 목록을 표시했습니다.');
        return;
      }

      setRecommendItems(convertAiItemsToRecommendItems(items));
      setApiMessage('AI가 추천한 할 일 목록입니다.');
    } catch (error) {
      console.error(error);
      setRecommendItems(getFallbackItems(trimmedGoal));
      setApiMessage(
        '백엔드 AI API 연결 전이라 임시 추천 목록을 표시했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeChecked = (id) => {
    setRecommendItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddSelectedTodos = () => {
    const selectedTodos = recommendItems
      .filter((item) => item.checked)
      .map((item) => item.title);

    if (selectedTodos.length === 0) {
      alert('추가할 할 일을 선택해주세요.');
      return;
    }

    onAddAiTodos(selectedTodos);
    alert(`${selectedTodos.length}개의 할 일을 추가했습니다.`);
    onChangePage('home');
  };

  return (
    <main className="ai-todo-page">
      <div className="ai-todo-container">
        <header className="ai-todo-header">
          <button className="ai-back-button" onClick={() => onChangePage('home')}>
            ←
          </button>

          <div>
            <h1>AI 할 일 생성</h1>
            <p>목표를 입력하면 AI가 실천 가능한 할 일로 쪼개줘요.</p>
          </div>
        </header>

        <section className="ai-input-card">
          <div className="ai-card-title">
            <span className="ai-icon">AI</span>
            <h2>공부 목표</h2>
          </div>

          <input
            className="ai-goal-input"
            type="text"
            value={goal}
            placeholder="예: 정보처리기사 실기 준비하기"
            onChange={(event) => setGoal(event.target.value)}
          />

          <div className="ai-period-list">
            <button
              type="button"
              className={period === 'today' ? 'active' : ''}
              onClick={() => setPeriod('today')}
            >
              오늘
            </button>

            <button
              type="button"
              className={period === 'week' ? 'active' : ''}
              onClick={() => setPeriod('week')}
            >
              이번 주
            </button>

            <button
              type="button"
              className={period === 'custom' ? 'active' : ''}
              onClick={() => setPeriod('custom')}
            >
              직접 입력
            </button>
          </div>

          <button
            className="ai-generate-button"
            onClick={handleGenerateTodos}
            disabled={isLoading}
          >
            {isLoading ? 'AI 추천 생성 중...' : 'AI 추천 받기'}
          </button>

          {apiMessage && <p className="ai-api-message">{apiMessage}</p>}
        </section>

        <section className="ai-result-section">
          <h2>추천된 할 일</h2>

          <div className="ai-result-card">
            {recommendItems.map((item) => (
              <label className="ai-todo-item" key={item.id}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleChangeChecked(item.id)}
                />
                <span>{item.title}</span>
              </label>
            ))}
          </div>
        </section>

        <button className="ai-add-button" onClick={handleAddSelectedTodos}>
          선택한 할 일 추가
        </button>
      </div>
    </main>
  );
}

export default AiTodoPage;