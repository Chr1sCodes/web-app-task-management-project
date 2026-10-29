import { createSlice, nanoid } from "@reduxjs/toolkit";

export const STORAGE_KEY = "todo-app-state-v1";

export function loadState() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && Array.isArray(data.lists)) return data;
  } catch {
    /* fall through to default */
  }
  const id = nanoid();
  return { activeListId: id, lists: [{ id, name: "My Tasks", items: [] }] };
}

const findActive = (state) => state.lists.find((l) => l.id === state.activeListId);

const todosSlice = createSlice({
  name: "todos",
  initialState: loadState,
  reducers: {
    stateReplaced: (_state, action) => action.payload,

    listSelected(state, action) {
      state.activeListId = action.payload;
    },
    listCreated: {
      reducer(state, action) {
        state.lists.push(action.payload);
        state.activeListId = action.payload.id;
      },
      prepare: (name) => ({ payload: { id: nanoid(), name, items: [] } }),
    },
    listRenamed(state, action) {
      const list = state.lists.find((l) => l.id === action.payload.id);
      if (list) list.name = action.payload.name;
    },
    listDeleted(state, action) {
      state.lists = state.lists.filter((l) => l.id !== action.payload);
      if (state.activeListId === action.payload) state.activeListId = state.lists[0]?.id ?? null;
    },

    itemCreated: {
      reducer(state, action) {
        findActive(state)?.items.unshift(action.payload);
      },
      prepare: ({ text, due, priority }) => ({
        payload: { id: nanoid(), text, due: due || "", priority, completed: false, createdAt: Date.now() },
      }),
    },
    itemUpdated(state, action) {
      const { id, ...changes } = action.payload;
      const item = findActive(state)?.items.find((i) => i.id === id);
      if (item) Object.assign(item, changes);
    },
    itemDeleted(state, action) {
      const list = findActive(state);
      if (list) list.items = list.items.filter((i) => i.id !== action.payload);
    },
    completedCleared(state) {
      const list = findActive(state);
      if (list) list.items = list.items.filter((i) => !i.completed);
    },
  },
});

export const {
  stateReplaced, listSelected, listCreated, listRenamed, listDeleted,
  itemCreated, itemUpdated, itemDeleted, completedCleared,
} = todosSlice.actions;

export const selectLists = (state) => state.todos.lists;
export const selectActiveList = (state) =>
  state.todos.lists.find((l) => l.id === state.todos.activeListId) || null;

export default todosSlice.reducer;
