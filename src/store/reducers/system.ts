import { createSlice } from "@reduxjs/toolkit";

type SystemProps = {
  globalVolumeMultiplier: number;
  isSystemLoaded: boolean;
}


export const SystemSlice = createSlice({
  name: "SystemSlice",
  initialState: {
    globalVolumeMultiplier: 1,
    isSystemLoaded: false,
  } as SystemProps,
  reducers: {
    SET_GLOBAL_VOLUME_MULTIPLIER(state,{payload}:{payload:number}){
      state.globalVolumeMultiplier = payload
    },
    SET_IS_SYSTEM_LOADED(state,{payload}:{payload:boolean}){
      state.isSystemLoaded = payload
    },
  },
})