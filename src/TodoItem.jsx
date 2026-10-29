import { useState } from "react";
import { useDispatch } from "react-redux";
import { itemUpdated, itemDeleted } from "./todosSlice";

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
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

  const overdue = item.due && !item.completed && item.due < todayISO();

  return (
    <li className={`item${item.completed ? " completed" : ""}${editing ? " editing" : ""}`}>
      {!editing && (
        <input
          type="checkbox" className="toggle" aria-label="Mark complete" checked={item.completed}
          onChange={(e) => dispatch(itemUpdated({ id: item.id, completed: e.target.checked }))}
        />
      )}
      <div className="item-body">
        {editing ? (
          <form className="edit-fields" onSubmit={save}>
            <input
              type="text" value={draft.text} required maxLength={200} autoFocus
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            />
            <input type="date" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} />
            <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </form>
        ) : (
          <>
            <span className="item-text" onDoubleClick={startEdit}>{item.text}</span>
            <div className="item-meta">
              <span className={`badge ${item.priority}`}>{item.priority}</span>
              {item.due && <span className={overdue ? "overdue" : ""}>Due {item.due}</span>}
            </div>
          </>
        )}
      </div>
      <div className="item-actions">
        {editing ? (
          <>
            <button onClick={save}>Save</button>
            <button className="ghost" onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="ghost" title="Edit" onClick={startEdit}>✏️</button>
            <button className="ghost danger" title="Delete" onClick={() => dispatch(itemDeleted(item.id))}>🗑️</button>
          </>
        )}
      </div>
    </li>
  );
}
