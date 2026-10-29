# To-Do List Web App

A front-end app for managing to-do lists, built with React, Redux Toolkit, and Vite. Data persists in the browser via `localStorage`.

## Features

- **Lists:** create, switch between, rename, and delete multiple to-do lists
- **Items:** create, view, edit (✏️ or double-click), complete, and delete items
- Optional due dates (overdue items are highlighted) and priority levels
- Filter by All / Active / Completed, search, and clear completed items
- Responsive layout; syncs across open browser tabs

## Running

Requires Node.js.

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Structure

- `src/todosSlice.js` – Redux slice with list/item CRUD reducers and selectors
- `src/store.js` – store setup, `localStorage` persistence, cross-tab sync
- `src/App.jsx` – lists sidebar, item form, filters, search
- `src/TodoItem.jsx` – single item with inline editing
