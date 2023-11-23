import { SettingsProps } from "@/types/settings";
import { createSlice } from "@reduxjs/toolkit";


export const SettingsSlice = createSlice({
  name: "SettingsSlice",
  initialState: {
    taskbar: {
      position: "bottom",
      color: "transparent",
      showOnHover: false,
      clockFormat: "12",
      hideSoundController: false
    },
    desktop: {
      background: ""
    },
    windowTopBar: {
      color: "transparent",
      items:{
        color: "black"
      }
    },
  } as SettingsProps,
  reducers: {
    SET_TASKBAR_POSITION(state,{payload}:{payload:"top" | "bottom" | "left" | "right"}){
      state.taskbar.position = payload
    },
    SET_TASKBAR_COLOR(state,{payload}:{payload:string}){
      state.taskbar.color = payload
    },
    SET_TASKBAR_SHOW_ON_HOVER(state,{payload}:{payload:boolean}){
      state.taskbar.showOnHover = payload
    },
    SET_DESKTOP_BACKGROUND(state,{payload}:{payload:string}){
      state.desktop.background = payload
    },
    SET_WINDOW_TOP_BAR_COLOR(state,{payload}:{payload:string}){
      state.windowTopBar.color = payload
    },
    SET_WINDOW_TOP_BAR_ITEMS_COLOR(state,{payload}:{payload:string}){
      state.windowTopBar.items.color = payload
    },
    SET_WINDOW_BACKGROUND(state,{payload}:{payload:string}){
      state.window.background = payload
    },
    SET_TASKBAR_CLOCK_FORMAT(state,{payload}:{payload:"12" | "24"}){
      state.taskbar.clockFormat = payload
    },
    SET_TASKBAR_HIDE_SOUND_CONTROLLER(state,{payload}:{payload:boolean}){
      state.taskbar.hideSoundController = payload
    },
    
  },
});