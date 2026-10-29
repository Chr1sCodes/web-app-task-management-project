import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLists, selectActiveList, listSelected, listCreated, listRenamed, listDeleted,
  itemCreated, completedCleared,
} from "./todosSlice";
import TodoItem from "./TodoItem";

const FILTERS = ["all", "active", "completed"];

export default function App() {
  const dispatch = useDispatch();
  const lists = useSelector(selectLists);
  const list = useSelector(selectActiveList);

  const [newList, setNewList] = useState("");
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const addList = (e) => {
    e.preventDefault();
    const name = newList.trim();
    if (!name) return;
    dispatch(listCreated(name));
    setNewList("");
  };

  const addItem = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    dispatch(itemCreated({ text: t, due, priority }));
    setText("");
    setDue("");
    setPriority("medium");
  };

  const rename = () => {
    const name = prompt("Rename list:", list.name);
    if (name && name.trim()) dispatch(listRenamed({ id: list.id, name: name.trim() }));
  };

  const remove = () => {
    if (confirm(`Delete list "${list.name}" and all its items?`)) dispatch(listDeleted(list.id));
  };

  const q = search.trim().toLowerCase();
  const visible = (list?.items ?? []).filter((i) => {
    if (filter === "active" && i.completed) return false;
    if (filter === "completed" && !i.completed) return false;
    return !q || i.text.toLowerCase().includes(q);
  });
  const remaining = list ? list.items.filter((i) => !i.completed).length : 0;

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>📝 To-Do Lists</h1>
        <form className="inline-form" onSubmit={addList}>
          <input
            value={newList} onChange={(e) => setNewList(e.target.value)}
            placeholder="New list name" maxLength={60} required aria-label="New list name"
          />
          <button type="submit" title="Add list">+</button>
        </form>
        <ul className="lists">
          {lists.map((l) => (
            <li
              key={l.id}
              className={l.id === list?.id ? "active" : ""}
              onClick={() => dispatch(listSelected(l.id))}
            >
              <span>{l.name}</span>
              <span className="count">{l.items.filter((i) => !i.completed).length}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="main">
        <header className="main-header">
          <h2>{list ? list.name : "Select or create a list"}</h2>
          {list && (
            <div className="list-actions">
              <button className="ghost" onClick={rename}>Rename</button>
              <button className="ghost danger" onClick={remove}>Delete list</button>
            </div>
          )}
        </header>

        {list && (
          <section>
            <form className="item-form" onSubmit={addItem}>
              <input
                type="text" value={text} onChange={(e) => setText(e.target.value)}
                placeholder="What needs to be done?" maxLength={200} required aria-label="New item"
              />
              <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Due date" />
              <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="submit">Add</button>
            </form>

            <div className="toolbar">
              <div className="filters">
                {FILTERS.map((f) => (
                  <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>
                    {f[0].toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <input
                type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…" aria-label="Search items"
              />
            </div>

            <ul className="items">
              {visible.map((item) => <TodoItem key={item.id} item={item} />)}
            </ul>
            {visible.length === 0 && <p className="empty">No items here yet.</p>}

            <footer className="list-footer">
              <span>{remaining} item{remaining === 1 ? "" : "s"} left</span>
              {list.items.some((i) => i.completed) && (
                <button className="ghost" onClick={() => dispatch(completedCleared())}>Clear completed</button>
              )}
            </footer>
          </section>
        )}
      </main>
    </div>
  );
}
