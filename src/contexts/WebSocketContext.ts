import { createContext } from "react";
export const WebSocketContext = createContext(<
  {
    uuid: string;
    shouldFetch: boolean;
    resetFetchTrigger: CallableFunction | null;
  }
>{
  uuid: "",
  shouldFetch: false,
  resetFetchTrigger: null,
});
