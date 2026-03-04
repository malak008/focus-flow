/// <reference types="react-scripts" />
  export {};

  declare global {
    interface Window {
      electronAPI?: {
        closeApp: () => void;
      };
    }
  }