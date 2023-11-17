
import { createSlice } from "@reduxjs/toolkit";



type IAppSlice = {
	isNotificationOpen: boolean;
	notificationMessage: string;
	notificationTitle: string;
}


export const AppSlice = createSlice({
	name: "AppSlice",
	initialState: {
		isNotificationOpen: false,
		notificationMessage: '',
		notificationTitle: '',
		
	} as IAppSlice,
	reducers: {
		SET_NOTIFICATION(state,{payload}:{payload:boolean}){
			state.isNotificationOpen = payload
		},
		SET_NOTIFICATION_MESSAGE(state,{payload}:{payload:string}){
			state.notificationMessage = payload
		},
		SET_NOTIFICATION_TITLE(state,{payload}:{payload:string}){
			state.notificationTitle = payload
		},
		HANDLER_NOTIFICATION(state,{payload}:{payload: {title:string,message:string}}){
			state.isNotificationOpen = true
			state.notificationMessage = payload.message
			state.notificationTitle = payload.title
		},
	},
});