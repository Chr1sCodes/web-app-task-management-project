import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLists, selectActiveList, listSelected, listCreated, listRenamed, listDeleted,
  itemCreated, completedCleared,
} from "./todosSlice";
import TodoItem from "./TodoItem";
import Icon from "./Icon";

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
  const [renaming, setRenaming] = useState(false);
  const [listName, setListName] = useState("");

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

  const startRename = () => {
    setListName(list.name);
    setRenaming(true);
  };

  const finishRename = (e) => {
    e?.preventDefault();
    const name = listName.trim();
    if (name && name !== list.name) dispatch(listRenamed({ id: list.id, name }));
    setRenaming(false);
  };

  const remove = () => {
    if (confirm(`Delete list "${list.name}" and all its items?`)) dispatch(listDeleted(list.id));
  };

  const selectList = (id) => {
    setRenaming(false);
    dispatch(listSelected(id));
  };

  const q = search.trim().toLowerCase();
  const items = list?.items ?? [];
  const visible = items.filter((i) => {
    if (filter === "active" && i.completed) return false;
    if (filter === "completed" && !i.completed) return false;
    return !q || i.text.toLowerCase().includes(q);
  });
  const done = items.filter((i) => i.completed).length;
  const remaining = items.length - done;
  const progress = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><Icon name="check" size={16} strokeWidth="3" /></span>
          <span>Tasks</span>
        </div>

        <div className="sidebar-label">My lists</div>
        <ul className="lists">
          {lists.map((l) => {
            const open = l.items.filter((i) => !i.completed).length;
            return (
              <li key={l.id}>
                <button
                  className={`list-link${l.id === list?.id ? " active" : ""}`}
                  onClick={() => selectList(l.id)}
                >
                  <Icon name="list" size={16} />
                  <span className="list-name">{l.name}</span>
                  {open > 0 && <span className="count">{open}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <form className="new-list" onSubmit={addList}>
          <Icon name="plus" size={16} />
          <input
            value={newList} onChange={(e) => setNewList(e.target.value)}
            placeholder="New list" maxLength={60} aria-label="New list name"
          />
        </form>
      </aside>

      <main className="main">
        {!list ? (
          <div className="empty">
            <Icon name="list" size={40} />
            <p>Create a list to get started.</p>
          </div>
        ) : (
          <>
            <header className="main-header">
              {renaming ? (
                <form onSubmit={finishRename} className="rename-form">
                  <input
                    className="title-input" value={listName} autoFocus maxLength={60}
                    aria-label="List name"
                    onChange={(e) => setListName(e.target.value)}
                    onBlur={finishRename}
                    onKeyDown={(e) => e.key === "Escape" && setRenaming(false)}
                  />
                </form>
              ) : (
                <h1 className="title" onDoubleClick={startRename}>{list.name}</h1>
              )}
              <div className="header-actions">
                <button className="icon-btn" title="Rename list" aria-label="Rename list" onClick={startRename}>
                  <Icon name="edit" />
                </button>
                <button className="icon-btn danger" title="Delete list" aria-label="Delete list" onClick={remove}>
                  <Icon name="trash" />
                </button>
              </div>
            </header>

            <div className="progress-row">
              <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-text">{done} of {items.length} done</span>
            </div>

            <form className="composer" onSubmit={addItem}>
              <input
                className="composer-input" type="text" value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Add a task…" maxLength={200} aria-label="New item"
              />
              <div className="composer-row">
                <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Due date" />
                <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>
                <div className="spacer" />
                <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
                  <Icon name="plus" size={16} /> Add task
                </button>
              </div>
            </form>

            <div className="toolbar">
              <div className="segmented" role="tablist">
                {FILTERS.map((f) => (
                  <button
                    key={f} role="tab" aria-selected={filter === f}
                    className={filter === f ? "active" : ""} onClick={() => setFilter(f)}
                  >
                    {f[0].toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <label className="search">
                <Icon name="search" size={16} />
                <input
                  type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search" aria-label="Search items"
                />
              </label>
            </div>

            {visible.length > 0 ? (
              <ul className="items">
                {visible.map((item) => <TodoItem key={item.id} item={item} />)}
              </ul>
            ) : (
              <div className="empty">
                <Icon name="inbox" size={40} />
                <p>
                  {items.length === 0
                    ? "No tasks yet. Add one above."
                    : q ? "No tasks match your search." : `No ${filter} tasks.`}
                </p>
              </div>
            )}

            {items.length > 0 && (
              <footer className="list-footer">
                <span>{remaining} task{remaining === 1 ? "" : "s"} left</span>
                {done > 0 && (
                  <button className="link-btn" onClick={() => dispatch(completedCleared())}>Clear completed</button>
                )}
              </footer>
            )}
          </>
        )}
      </main>
    </div>
  );
}
