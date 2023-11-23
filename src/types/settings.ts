export type SettingsProps = {
  taskbar: {
    position: "top" | "bottom" | "left" | "right";
    color: string;
    showOnHover: boolean;
    hideSoundController: boolean;
    clockFormat: "12" | "24";
  }
  desktop: {
    background: string;
  }
  windowTopBar: {
    color: string;
    items:{
      color: string;
    }
  }
  window: {
    background: string;
  }
}
