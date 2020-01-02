/// <reference types="react-scripts" />

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    REACT_APP_SERVER_HOST: string;
    REACT_APP_FAVICONS_PATH: string;
  }
}
