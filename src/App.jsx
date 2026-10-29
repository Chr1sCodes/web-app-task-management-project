import { useEffect, useState } from "react";
import NavBar, { PAGES } from "./NavBar";
import TodoPage from "./TodoPage";
import ContactPage from "./ContactPage";
import CalendarPage from "./CalendarPage";

const DEFAULT_PAGE = "todo";

function pageFromHash() {
  const id = window.location.hash.replace(/^#\/?/, "");
  return PAGES.some((p) => p.id === id) ? id : DEFAULT_PAGE;
}

export default function App() {
  const [page, setPage] = useState(pageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const label = PAGES.find((p) => p.id === page).label;
    document.title = `${label} · Tasks`;
  }, [page]);

  return (
    <div className="app">
      <NavBar current={page} />
      {page === "todo" && <TodoPage />}
      {page === "contact" && <ContactPage />}
      {page === "calendar" && <CalendarPage onOpenTodo={() => (window.location.hash = "#/todo")} />}
    </div>
  );
}
