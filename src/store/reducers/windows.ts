import type { tabStateProps, windowStateProps } from "@/types/windows";
import { createSlice } from "@reduxjs/toolkit";

export const WindowsSlice = createSlice({
  name: "WindowsSlice",
  initialState: {
    windows: [
      {
        title: "Console",
        icon: "/assets/icons/console-icon.png",
        tabs: [] as tabStateProps[],
        showOnDesktop: true
      },
      {
        title: "Explorer",
        icon: "/assets/icons/folder.png",
        tabs: [] as tabStateProps[],
        showOnDesktop: true
      },
      {
        title: "Browser",
        icon: "/assets/icons/browser.png",
        tabs: [] as tabStateProps[],
        showOnDesktop: true
      },
      {
        title: "Image Reader",
        icon: "/assets/icons/image.png",
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: "Pokemon Fire Red",
        icon: "/assets/icons/pokemonFR.png",
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: "Notepad",
        icon: "/assets/icons/txt.png",
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: 'Markdown Editor',
        icon: '/assets/icons/md.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: 'Rich Text Editor',
        icon: '/assets/icons/rtf.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: 'PDF Reader',
        icon: '/assets/icons/pdf.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: 'Code Editor',
        icon: '/assets/icons/vscode.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: true
      },
      {
        title: 'Calendar',
        icon: '/assets/icons/calendar.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: 'My Musics',
        icon: '/assets/icons/music.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: true
      },
      {
        title: 'Video Player',
        icon: '/assets/icons/video.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: 'Calculator',
        icon: '/assets/icons/calculator.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: 'Classic Paint',
        icon: '/assets/icons/paintClassic.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: 'Music Player',
        icon: '/assets/icons/musicPlayer.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: false
      },
      {
        title: 'SpreadSheet',
        icon: '/assets/icons/spreadsheet.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: true
      },
      {
        title: 'Settings',
        icon: '/assets/icons/config.png',
        tabs: [] as tabStateProps[],
        showOnDesktop: true
      }
    ] as windowStateProps[]
  
  },    
  reducers: {
    ADD_WINDOW(state, { payload }: { payload: windowStateProps }) {
      state.windows.push(payload);
    },
    REMOVE_WINDOW(state, { payload }: { payload: string }) {
      state.windows = state.windows.filter((window) => window.title !== payload);
    },
    ADD_TAB(state, { payload }: { payload: { title: string; tab: tabStateProps } }) {
      const window = state.windows.find((window) => window.title === payload.title);
      if (window) {
        window.tabs.push(payload.tab);
      }
    },
    REMOVE_TAB(state, { payload }: { payload: { title: string; uuid: string } }) {
      const window = state.windows.find((window) => window.title === payload.title);
      if (window) {
        const tabToClose = window.tabs.find((tab) => tab.uuid === payload.uuid);
        if (tabToClose) {
          window.tabs = window.tabs.filter((tab) => tab.uuid !== payload.uuid);
        }
        // window.tabs = window.tabs.filter((tab) => tab.uuid === payload.uuid);
      }
    },
    TOGGLE_MAXIMIZE_TAB(state, { payload }: { payload: { title: string; uuid: string } }) {
      const window = state.windows.find((window) => window.title === payload.title);
      if (window) {
        const tab = window.tabs.find((tab) => tab.uuid === payload.uuid);
        if (tab) {
          tab.maximized = !tab.maximized;
        }
      }
    },
    TOGGLE_MINIMIZE_TAB(state, { payload }: { payload: { title: string; uuid: string } }) {
      const window = state.windows.find((window) => window.title === payload.title);
      if (window) {
        const tab = window.tabs.find((tab) => tab.uuid === payload.uuid);
        if (tab) {
          tab.minimized = !tab.minimized;
        }
      }
    },
    SET_TAB_TITLE(state, { payload }: { payload: { title: string; uuid: string; newTitle: string } }) {
      const window = state.windows.find((window) => window.title === payload.title);
      if (window) {
        const tab = window.tabs.find((tab) => tab.uuid === payload.uuid);
        if (tab) {
          tab.title = payload.newTitle;
        }
      }
    },
    SET_TAB_FOCUSED(state, { payload }: { payload: { title: string; uuid: string } }) {
      const window = state.windows.find((window) => window.title === payload.title);
      if (window) {
        window.tabs.forEach((tab) => {
          tab.focused = tab.uuid === payload.uuid;
        });
      }
    },
    CLEAR_ALL_FOCUSED_TABS(state) {
      state.windows.forEach((window) => {
        window.tabs.forEach((tab) => {
          tab.focused = false;
        });
      });
    },
    CLOSE_ALL_TABS_FROM_ALL_WINDOWS(state) {
      state.windows.forEach((window) => {
        window.tabs = [];
      });
    }
  }
});