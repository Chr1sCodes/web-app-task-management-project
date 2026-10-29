import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLists, listSelected } from "./todosSlice";
import Icon from "./Icon";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_PER_DAY = 3;

const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function buildMonthGrid(year, month) {
  const start = new Date(year, month, 1);
  start.setDate(1 - start.getDay());
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  // Drop the trailing week if it falls entirely in the next month
  return days[35].getMonth() !== month ? days.slice(0, 35) : days;
}

export default function CalendarPage({ onOpenTodo }) {
  const dispatch = useDispatch();
  const lists = useSelector(selectLists);
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const byDate = {};
  for (const list of lists) {
    for (const item of list.items) {
      if (!item.due) continue;
      (byDate[item.due] ||= []).push({ ...item, listId: list.id, listName: list.name });
    }
  }

  const shift = (delta) => {
    const d = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  };

  const openItem = (listId) => {
    dispatch(listSelected(listId));
    onOpenTodo();
  };

  const todayISO = toISO(today);
  const days = buildMonthGrid(cursor.year, cursor.month);
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const scheduled = days.filter((d) => d.getMonth() === cursor.month).reduce((n, d) => n + (byDate[toISO(d)]?.length || 0), 0);

  return (
    <main className="page page-wide">
      <header className="calendar-header">
        <div>
          <h1 className="title">{monthLabel}</h1>
          <p className="page-subtitle">{scheduled} task{scheduled === 1 ? "" : "s"} due this month</p>
        </div>
        <div className="calendar-nav">
          <button className="btn btn-ghost" onClick={() => setCursor({ year: today.getFullYear(), month: today.getMonth() })}>
            Today
          </button>
          <button className="icon-btn" aria-label="Previous month" onClick={() => shift(-1)}>
            <Icon name="chevronLeft" />
          </button>
          <button className="icon-btn" aria-label="Next month" onClick={() => shift(1)}>
            <Icon name="chevronRight" />
          </button>
        </div>
      </header>

      <div className="calendar">
        {WEEKDAYS.map((w) => <div key={w} className="weekday">{w}</div>)}
        {days.map((d) => {
          const iso = toISO(d);
          const tasks = byDate[iso] || [];
          const outside = d.getMonth() !== cursor.month;
          return (
            <div key={iso} className={`day${outside ? " outside" : ""}${iso === todayISO ? " today" : ""}`}>
              <span className="day-number">{d.getDate()}</span>
              <ul className="day-tasks">
                {tasks.slice(0, MAX_PER_DAY).map((t) => (
                  <li key={t.id}>
                    <button
                      className={`chip ${t.priority}${t.completed ? " done" : ""}${!t.completed && iso < todayISO ? " overdue" : ""}`}
                      title={`${t.text} · ${t.listName}`}
                      onClick={() => openItem(t.listId)}
                    >
                      {t.text}
                    </button>
                  </li>
                ))}
                {tasks.length > MAX_PER_DAY && <li className="more">+{tasks.length - MAX_PER_DAY} more</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </main>
  );
}
