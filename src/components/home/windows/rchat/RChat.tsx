import { Types } from "ably";
import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AblyContext, IAblyContext } from "../../../hooks/AblyProvider";
import { Chat } from "./Chat";

export const RChat = () => {
  const channelRef = useRef<Types.RealtimeChannelCallbacks>();
  const [inChannel, setInChannel] = useState(false);
  const [channelId, setChannelId] = useState("");
  const [name, setName] = useState("");

  const { getChannel, deviceId } = useContext(AblyContext) as IAblyContext;

  // console.log(Object(ably.current?.channels)["inProgress"]);

  useEffect(() => {
    const channel = channelRef.current;

    return () => channel?.detach();
  }, []);

  const onSubmitHandle: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const _channel = getChannel(`rchat_${channelId}`);

    if (!_channel) {
      alert(`Could not join room with id: ${channelId}`);
      return;
    }

    _channel?.presence.get((_, members) => {
      for (let i = 0; i < (members?.length || 0); ++i)
        if (members?.at(i)?.clientId === deviceId) {
          alert("Already in channel");
          return;
        }

      _channel.presence.enter({ name });
      channelRef.current = _channel;
      setInChannel(true);
    });
  };

  const leaveChat = () => {
    setInChannel(false);
    channelRef.current?.presence.leaveClient(deviceId);
    channelRef.current?.detach();
    delete channelRef.current;
  };

  useEffect(() => {
    return leaveChat;
  }, []);

  return (
    <RChat.Container>
      {!inChannel && (
        <RChat.JoinWindow onSubmit={onSubmitHandle}>
          <RChat.Inputs>
            <input
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="Channel ID"
              required
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
          </RChat.Inputs>
          <button type="submit">Join</button>
        </RChat.JoinWindow>
      )}
      {inChannel && (
        <Chat channelRef={channelRef} leaveChat={leaveChat} name={name} />
      )}
    </RChat.Container>
  );
};

RChat.Container = styled.div`
  width: 400px;
`;

RChat.JoinWindow = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.25em;
  font-size: 1rem;

  button,
  input {
    height: 1.5em;
  }

  button {
    margin-inline: auto;
    width: 8em;
    height: 2em;
    margin-block: 1em;
  }

  button:hover {
    cursor: pointer;
  }
`;

RChat.Inputs = styled.div`
  width: 100%;
  margin-block: 20px;
  display: flex;
  gap: 0.5em;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input {
    width: 80%;
  }
`;
