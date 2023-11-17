import { configureStore } from "@reduxjs/toolkit"
import { AppSlice } from "./reducers/app";

const store = configureStore({
  reducer:{
    App:AppSlice.reducer,

  }
})

export default store;
export type RootState = ReturnType<typeof store.getState>

export const AppActions = AppSlice.actions

