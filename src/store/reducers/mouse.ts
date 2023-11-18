import { MouseProps } from "@/types/mouse";
import { createSlice } from "@reduxjs/toolkit";

export const MouseSlice = createSlice({
  name: "MouseSlice",
  initialState: {
    mousePath: "",
    mouseInDesktop: false
  } as MouseProps,
  reducers: {
    SET_MOUSE_PATH(state, { payload }: { payload: string }) {
      state.mousePath = payload;
    },
    SET_MOUSE_IN_DESKTOP(state, { payload }: { payload: boolean }) {
      state.mouseInDesktop = payload;
    }
  }
});