export type SettingsProps = {
  taskbar: {
    position: "top" | "bottom" | "left" | "right";
    backgroundColor: string;
    showOnHover: boolean;
    hideSoundController: boolean;
    items: {
      color: string;
      backgroundColor: string;
    };
  };
  desktop: {
    backgroundColor: string;
    desktopIcon: {
      textColor: string;
    };
    wallpaper: {
      enabled: boolean;
      image64: string;
    };
  };
  startMenu: {
    background: string;
    ordered: boolean;
    textColor: string;
    searchInput: {
      disabled: boolean;
      background: string;
      textColor: string;
    };
  };
  windowTopBar: {
    color: string;
    items: {
      color: string;
    };
  };
  system: {
    systemBackgroundColor: string;
    systemHighlightColor: string;
    systemTextColor: string;
    clock: {
      disabled: boolean;
      format: "12" | "24";
      showSeconds: boolean;
    };
  };
} & { [key: string]: any }; // Adicionando uma assinatura de índice