import { Realtime, Types } from "ably";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useCookies } from "react-cookie";
import { v4 as uuidv4 } from "uuid";

export interface IAblyContext {
  ably: Realtime | undefined;
  getChannel: (channelId: string) => Types.RealtimeChannelCallbacks | undefined;
  getChannelPresence: (
    channelId: string
  ) => Types.RealtimePresenceCallbacks | undefined;
  deviceId: string;
}

const apiKey = process.env.REACT_APP_ABLY_KEY as string;
export const AblyContext = createContext<IAblyContext | null>(null);

export const AblyProvider = ({ children }: { children: ReactNode }) => {
  const [{ deviceId }, setCookie] = useCookies(["deviceId"]);
  const ably = useRef<Realtime>();

  const getChannel = useCallback((channelId: string) => {
    return ably.current?.channels.get(channelId);
  }, []);

  const getChannelPresence = useCallback((channelId: string) => {
    return ably.current?.channels.get(channelId).presence;
  }, []);

  const closeAblyConnection = () => {
    ably.current?.close();
    delete ably.current;
    console.log("Closed Connection");
  };

  // const joinChannelWi

  useEffect(() => {
    closeAblyConnection();

    if (deviceId) {
      console.log("Creating Ably");
      ably.current = new Realtime({ key: apiKey, clientId: deviceId });
    }
  }, [deviceId]);

  useEffect(() => {
    if (!deviceId) {
      const clientId = uuidv4();
      setCookie("deviceId", clientId, { sameSite: "strict" });
    }

    return () => {
      closeAblyConnection();
    };
  }, []);

  const context: IAblyContext = {
    ably: ably.current,
    getChannel,
    getChannelPresence,
    deviceId,
  };

  return (
    <AblyContext.Provider value={context}>{children}</AblyContext.Provider>
  );
};
