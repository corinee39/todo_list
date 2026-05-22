import './CalendarCard.css';

function CalendarCard() {
  return (
    <div className="calendar-card">
      <div className="calendar-title-row">
        <h2>2026년 5월</h2>
        <button className="calendar-arrow">⌄</button>
      </div>

      <div className="calendar-weekdays">
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span className="saturday">토</span>
        <span className="sunday">일</span>
      </div>

      <div className="calendar-grid">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <button className="selected">1</button>
        <button className="saturday">2</button>
        <button className="sunday">3</button>

        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>7</button>
        <button>8</button>
        <button className="saturday">9</button>
        <button className="sunday">10</button>

        <button>11</button>
        <button>12</button>
        <button>13</button>
        <button>14</button>
        <button>15</button>
        <button className="saturday">16</button>
        <button className="sunday">17</button>

        <button>18</button>
        <button>19</button>
        <button>20</button>
        <button>21</button>
        <button className="today">22</button>
        <button className="saturday">23</button>
        <button className="sunday">24</button>

        <button>25</button>
        <button>26</button>
        <button>27</button>
        <button>28</button>
        <button>29</button>
        <button className="saturday">30</button>
        <button className="sunday">31</button>
      </div>
    </div>
  );
}

export default CalendarCard;