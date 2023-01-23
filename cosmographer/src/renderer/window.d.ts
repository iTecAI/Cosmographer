declare global {
  interface Window {
    require: (libr: string) => any;
  }
}

export {};
