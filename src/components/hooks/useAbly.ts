import { Realtime, Types } from "ably";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { v4 as uuidv4 } from "uuid";

const apiKey = process.env.REACT_APP_ABLY_KEY as string;

export const useAbly = () => {
  const [{ deviceId }, setCookie] = useCookies(["deviceId"]);
  const [ably, setAbly] = useState<Types.RealtimePromise>();

  const joinChannel = (channelId: string) => {
    return ably?.channels.get(channelId);
  };

  useEffect(() => {
    let ablyInstance: Types.RealtimePromise;
    if (!deviceId) {
      const clientId = uuidv4();
      setCookie("deviceId", clientId, { sameSite: "strict" });

      ablyInstance = new Realtime.Promise({ key: apiKey, clientId });
    } else {
      ablyInstance = new Realtime.Promise({ key: apiKey, clientId: deviceId });
    }

    const connectAndSet = async () => {
      try {
        await ablyInstance.connection.once("connected");
        await setAbly(ablyInstance);
      } catch (e) {
        console.error(e);
      }
    };

    connectAndSet();

    return () => ably?.close();
  }, []);

  return { ably, joinChannel, deviceId };
};
