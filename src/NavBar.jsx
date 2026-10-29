import Icon from "./Icon";
import { useTheme } from "./useTheme";

export const PAGES = [
  { id: "todo", label: "To Do", icon: "list" },
  { id: "contact", label: "Contact", icon: "mail" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
];

export default function NavBar({ current }) {
  const [theme, toggleTheme] = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <header className="navbar">
      <a className="brand" href="#/todo" aria-label="Tasks home">
        <span className="brand-mark"><Icon name="check" size={16} strokeWidth="3" /></span>
        <span>Tasks</span>
      </a>
      <nav aria-label="Main">
        <ul className="nav-links">
          {PAGES.map((p) => (
            <li key={p.id}>
              <a
                href={`#/${p.id}`}
                className={`nav-link${current === p.id ? " active" : ""}`}
                aria-current={current === p.id ? "page" : undefined}
              >
                <Icon name={p.icon} size={16} />
                <span>{p.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${next} mode`}
        title={`Switch to ${next} mode`}
      >
        <Icon name={theme === "dark" ? "moon" : "sun"} size={16} />
        <span>{theme === "dark" ? "Dark" : "Light"}</span>
      </button>
    </header>
  );
}
