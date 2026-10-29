import { useState } from "react";
import { useDispatch } from "react-redux";
import { itemUpdated, itemDeleted } from "./todosSlice";
import Icon from "./Icon";

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function formatDue(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const sameYear = y === new Date().getFullYear();
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }) });
}

function dueLabel(iso, completed) {
  const today = todayISO();
  if (completed) return { text: formatDue(iso), tone: "" };
  if (iso < today) return { text: `Overdue · ${formatDue(iso)}`, tone: "overdue" };
  if (iso === today) return { text: "Today", tone: "today" };
  return { text: formatDue(iso), tone: "" };
}

export default function TodoItem({ item }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item);

  const startEdit = () => {
    setDraft(item);
    setEditing(true);
  };

  const save = (e) => {
    e?.preventDefault();
    const text = draft.text.trim();
    if (!text) return;
    dispatch(itemUpdated({ id: item.id, text, due: draft.due, priority: draft.priority }));
    setEditing(false);
  };

  if (editing) {
    return (
      <li className="item editing">
        <form className="edit-form" onSubmit={save}>
          <input
            className="edit-text" type="text" value={draft.text} required maxLength={200} autoFocus
            aria-label="Item text"
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
          />
          <div className="edit-row">
            <input
              type="date" value={draft.due} aria-label="Due date"
              onChange={(e) => setDraft({ ...draft, due: e.target.value })}
            />
            <select
              value={draft.priority} aria-label="Priority"
              onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <div className="spacer" />
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </li>
    );
  }

  const due = item.due ? dueLabel(item.due, item.completed) : null;

  return (
    <li className={`item${item.completed ? " completed" : ""}`}>
      <label className="checkbox">
        <input
          type="checkbox" aria-label="Mark complete" checked={item.completed}
          onChange={(e) => dispatch(itemUpdated({ id: item.id, completed: e.target.checked }))}
        />
        <span className="checkmark"><Icon name="check" size={14} strokeWidth="3" /></span>
      </label>
      <div className="item-body" onDoubleClick={startEdit}>
        <span className="item-text">{item.text}</span>
        <div className="item-meta">
          <span className={`priority ${item.priority}`}>{item.priority}</span>
          {due && (
            <span className={`due ${due.tone}`}>
              <Icon name="calendar" size={13} /> {due.text}
            </span>
          )}
        </div>
      </div>
      <div className="item-actions">
        <button className="icon-btn" title="Edit" aria-label="Edit" onClick={startEdit}>
          <Icon name="edit" />
        </button>
        <button
          className="icon-btn danger" title="Delete" aria-label="Delete"
          onClick={() => dispatch(itemDeleted(item.id))}
        >
          <Icon name="trash" />
        </button>
      </div>
    </li>
  );
}
