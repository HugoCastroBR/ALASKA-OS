import { configureStore } from "@reduxjs/toolkit"
import { AppSlice } from "./reducers/app";
import { WindowsSlice } from "./reducers/windows";

const store = configureStore({
  reducer:{
    App:AppSlice.reducer,
    Windows:WindowsSlice.reducer,
  }
})

export default store;
export type RootState = ReturnType<typeof store.getState>

export const AppActions = AppSlice.actions
export const WindowsActions = WindowsSlice.actions

