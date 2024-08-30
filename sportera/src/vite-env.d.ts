/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MAPKIT_TOKEN: string
    // Add other environment variables here if you have any
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }