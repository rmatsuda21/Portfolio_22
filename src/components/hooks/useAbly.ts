import { Realtime } from "ably";
import { useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { v4 as uuidv4 } from "uuid";

const apiKey = process.env.REACT_APP_ABLY_KEY as string;

export const useAbly = () => {
  const [{ deviceId }, setCookie] = useCookies(["deviceId"]);
  const ably = useRef<Realtime>();

  const joinChannel = (channelId: string) => {
    return ably.current?.channels.get(channelId);
  };

  useEffect(() => {
    if (!deviceId) {
      const clientId = uuidv4();
      setCookie("deviceId", clientId, { sameSite: "strict" });

      ably.current = new Realtime({ key: apiKey, clientId });
    } else {
      ably.current = new Realtime({ key: apiKey, clientId: deviceId });
    }
  }, [setCookie, deviceId]);

  useEffect(() => {
    return () => ably.current?.close();
  }, []);

  return { ably, joinChannel, deviceId };
};
