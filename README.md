# To-Do List Web App

A front-end app for managing to-do lists, built with React, Redux Toolkit, and Vite. Data persists in the browser via `localStorage`.

## Features

- **Navigation bar** with three pages: To Do, Contact, and Calendar (hash routes `#/todo`, `#/contact`, `#/calendar`)
- **Calendar:** month view of every task with a due date across all lists; click a task to jump to its list
- **Contact:** validated contact form (front end only; no messages are sent yet)
- **Lists:** create, switch between, rename (inline), and delete multiple to-do lists
- **Items:** create, view, edit inline (edit icon or double-click), complete, and delete items
- Optional due dates (shown as "Today" / "Overdue") and color-coded priority levels
- Progress bar showing completed vs. total tasks
- Filter by All / Incomplete / Completed, search, and clear completed items
- Responsive layout with a light/dark mode toggle in the navigation bar (defaults to your system setting, remembers your choice); syncs across open browser tabs

## Running

Requires Node.js.

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Deploying to GitHub Pages

The app is deployed automatically by [.github/workflows/deploy.yml](.github/workflows/deploy.yml) on every push to `main`.

One-time setup: in the repository on GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

The site is then available at `https://<username>.github.io/<repo-name>/`. The build uses relative asset paths (`base: "./"` in `vite.config.js`) and hash-based routes (`#/todo`, `#/calendar`, `#/contact`), so it works from a repository subpath without any 404 fallbacks.

## Structure

- `src/todosSlice.js` – Redux slice with list/item CRUD reducers and selectors
- `src/store.js` – store setup, `localStorage` persistence, cross-tab sync
- `src/App.jsx` – top-level layout and hash-based page routing
- `src/NavBar.jsx` – top navigation bar with theme toggle
- `src/useTheme.js` – light/dark theme state and persistence
- `src/TodoPage.jsx` – lists sidebar, item form, filters, search
- `src/CalendarPage.jsx` – monthly calendar of tasks by due date
- `src/ContactPage.jsx` – contact form
- `src/TodoItem.jsx` – single item with inline editing
- `src/Icon.jsx` – inline SVG icon set
- `.github/workflows/deploy.yml` – builds and deploys to GitHub Pages

## Project Overview

Christine Bharosi
Overview: Task Management Web App
Technologies Used: HTML, React, Redux, Javascript.
Ways to improve: API for school/university learning platforms. Mobile app access, More themes.
