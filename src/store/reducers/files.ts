import { createSlice } from "@reduxjs/toolkit";

type FileSlice = {
  selectedFiles: string[]
  copiedFiles: string[]
  setIsRename: boolean,
  setIsNewFile: boolean
  setIsNewFolder: boolean
}

export const FileSlice = createSlice({
  name: "FileSlice",
  initialState: {
    selectedFiles: [] as string[],
    copiedFiles: [] as string[],
    setIsRename: false,
    setIsNewFile: false,
    setIsNewFolder: false
    
  } as FileSlice,
  reducers: {
    ADD_SELECTED_FILE(state,{payload}:{payload:string}){
      state.selectedFiles.push(payload)
    },
    REMOVE_SELECTED_FILE(state,{payload}:{payload:string}){
      state.selectedFiles = state.selectedFiles.filter((file) => file !== payload);
    },
    CLEAR_FILES(state){
      state.selectedFiles = []
    },
    SET_IS_RENAME(state,{payload}:{payload:boolean}){
      state.setIsRename = payload
    },
    SET_IS_NEW_FILE(state,{payload}:{payload:boolean}){
      state.setIsNewFile = payload
    },
    SET_IS_NEW_FOLDER(state,{payload}:{payload:boolean}){
      state.setIsNewFolder = payload
    },
    SET_COPIED_FILES(state){
      state.copiedFiles = state.selectedFiles
    }
  },
});