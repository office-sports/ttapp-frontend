/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SOCKET_HOST: string;
  readonly VITE_SOCKET_SUFFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
