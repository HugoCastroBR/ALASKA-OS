import { createSlice } from "@reduxjs/toolkit";

type SystemProps = {
  globalVolumeMultiplier: number;
}


export const SystemSlice = createSlice({
  name: "SystemSlice",
  initialState: {
    globalVolumeMultiplier: 1,
    
  } as SystemProps,
  reducers: {
    SET_GLOBAL_VOLUME_MULTIPLIER(state,{payload}:{payload:number}){
      state.globalVolumeMultiplier = payload
    },
  },
})