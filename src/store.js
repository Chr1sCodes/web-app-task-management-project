import { configureStore } from "@reduxjs/toolkit";
import todosReducer, { STORAGE_KEY, stateReplaced, loadState } from "./todosSlice";

export const store = configureStore({
  reducer: { todos: todosReducer },
});

store.subscribe(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().todos));
});

// Keep multiple tabs in sync
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) store.dispatch(stateReplaced(loadState()));
});
