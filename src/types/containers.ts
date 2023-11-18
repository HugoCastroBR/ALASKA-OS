import { windowStateProps, tabStateProps } from "./windows";

export type DefaultWindowProps = {
  title: string;
  children: React.ReactNode;
  currentWindow: windowStateProps;
  currentTab: tabStateProps;
  uuid: string;
  resizable?: boolean;
  className?: string;
  preventDefaultClose?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
};
