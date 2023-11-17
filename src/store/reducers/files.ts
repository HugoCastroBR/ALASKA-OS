import { createSlice } from "@reduxjs/toolkit";

type FileSlice = {
  selectedFiles: string[]
}

export const FileSlice = createSlice({
  name: "FileSlice",
  initialState: {
    selectedFiles: [] as string[]
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
  },
});