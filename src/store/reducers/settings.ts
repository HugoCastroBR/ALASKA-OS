import { SettingsProps } from "@/types/settings";
import { createSlice } from "@reduxjs/toolkit";


export const SettingsSlice = createSlice({
  name: "SettingsSlice",
  initialState: {
    settings:{
      taskbar: {
        position: "bottom",
        showOnHover: false,
        hideSoundController: false,
        backgroundColor: "transparent",
        items: {
          color: "white",
          backgroundColor: "transparent",
        }
      },
      desktop: {
        backgroundColor: "transparent",
        desktopIcon:{
          textColor: "white",
        
      
        },
        wallpaper: {
          enabled: false,
          image64: "",
        }
      },
      startMenu: {
        background: 'rgba(24, 171, 255, 0.1)',
        ordered: true,
        textColor: "black",
        searchInput : {
          disabled: true,
          background: "white",
          textColor: "black"
        }
      },
      windowTopBar: {
        color: "transparent",
        items:{
          color: "black"
        }
      },
      system: {
        systemBackgroundColor: "rgba(24, 171, 255, 0.5)",
        systemHighlightColor: "rgba(123, 215, 232, 0.7  )",
        systemTextColor: "black",
        clock: {
          disabled: false,
          format: "12",
        }
      },
    }as SettingsProps,
  },
  reducers: {
    SET_SETTINGS(state,{payload}:{payload:SettingsProps}){
      state.settings = payload
    },
    SET_TASKBAR_POSITION(state,{payload}:{payload:"top" | "bottom" | "left" | "right"}){
      state.settings.taskbar.position = payload
    },
  
    SET_TASKBAR_SHOW_ON_HOVER(state,{payload}:{payload:boolean}){
      state.settings.taskbar.showOnHover = payload
    },
    SET_WINDOW_TOP_BAR_COLOR(state,{payload}:{payload:string}){
      state.settings.windowTopBar.color = payload
    },
    SET_WINDOW_TOP_BAR_ITEMS_COLOR(state,{payload}:{payload:string}){
      state.settings.windowTopBar.items.color = payload
    },
    SET_TASKBAR_HIDE_SOUND_CONTROLLER(state,{payload}:{payload:boolean}){
      state.settings.taskbar.hideSoundController = payload
    },
    SET_START_MENU_BACKGROUND(state,{payload}:{payload:string}){
      state.settings.startMenu.background = payload
    },
    SET_START_MENU_ORDERED(state,{payload}:{payload:boolean}){
      state.settings.startMenu.ordered = payload
    },
    SET_START_MENU_SEARCH_INPUT_DISABLED(state,{payload}:{payload:boolean}){
      state.settings.startMenu.searchInput.disabled = payload
    },
    SET_START_MENU_SEARCH_INPUT_BACKGROUND(state,{payload}:{payload:string}){
      state.settings.startMenu.searchInput.background = payload
    },
    SET_START_MENU_SEARCH_INPUT_TEXT_COLOR(state,{payload}:{payload:string}){
      state.settings.startMenu.searchInput.textColor = payload
    },
    SET_SYSTEM_CLOCK_DISABLED(state,{payload}:{payload:boolean}){
      state.settings.system.clock.disabled = payload
    },
    SET_SYSTEM_CLOCK_SHOW_SECONDS(state,{payload}:{payload:boolean}){
      state.settings.system.clock.showSeconds = payload
    },
    SET_SYSTEM_CLOCK_FORMAT(state,{payload}:{payload:"12" | "24"}){
      state.settings.system.clock.format = payload
    },
  },
});