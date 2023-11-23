import { configureStore } from "@reduxjs/toolkit"
import { AppSlice } from "./reducers/app";
import { WindowsSlice } from "./reducers/windows";
import { FileSlice } from "./reducers/files";
import { MouseSlice } from "./reducers/mouse";
import { MusicsSlice } from "./reducers/musics";
import { SystemSlice } from "./reducers/system";

const store = configureStore({
  reducer:{
    App:AppSlice.reducer,
    Windows:WindowsSlice.reducer,
    File:FileSlice.reducer,
    Mouse:MouseSlice.reducer,
    Musics:MusicsSlice.reducer,
    System:SystemSlice.reducer,
  }
})

export default store;
export type RootState = ReturnType<typeof store.getState>

export const AppActions = AppSlice.actions
export const WindowsActions = WindowsSlice.actions
export const FileActions = FileSlice.actions
export const MouseActions = MouseSlice.actions
export const MusicsActions = MusicsSlice.actions
export const SystemActions = SystemSlice.actions
