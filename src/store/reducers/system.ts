import { SystemNotificationType } from "@/types/system";
import { createSlice } from "@reduxjs/toolkit";

type SystemProps = {
  globalVolumeMultiplier: number;
  isSystemLoaded: boolean;
  notification: null | SystemNotificationType;
}


export const SystemSlice = createSlice({
  name: "SystemSlice",
  initialState: {
    globalVolumeMultiplier: 1,
    isSystemLoaded: false,
    notification: null,
  } as SystemProps,
  reducers: {
    SET_GLOBAL_VOLUME_MULTIPLIER(state,{payload}:{payload:number}){
      state.globalVolumeMultiplier = payload
    },
    SET_IS_SYSTEM_LOADED(state,{payload}:{payload:boolean}){
      state.isSystemLoaded = payload
    },
    SET_NOTIFICATION(state,{payload}:{payload:SystemNotificationType}){
      state.notification = payload
    },
    CLEAR_NOTIFICATION(state){
      state.notification = null
    },
  },
})

