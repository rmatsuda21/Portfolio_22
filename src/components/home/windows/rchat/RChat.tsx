import { Types } from "ably";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useAbly } from "../../../hooks/useAbly";
import { Chat } from "./Chat";

export const RChat = () => {
  const channelRef = useRef<Types.RealtimeChannelCallbacks>();
  const [inChannel, setInChannel] = useState(false);
  const [channelId, setChannelId] = useState("");
  const [name, setName] = useState("");

  const { joinChannel, ably } = useAbly();

  console.log(Object(ably.current?.channels)["inProgress"]);

  useEffect(() => {
    const channel = channelRef.current;

    return () => channel?.detach();
  }, []);

  const onSubmitHandle: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const _channel = joinChannel(`rchat_${channelId}`);

    if (!_channel) {
      alert(`Could not join room with id: ${channelId}`);
      return;
    }

    _channel.presence.enter({ name });
    channelRef.current = _channel;
    setInChannel(true);
  };

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
      {inChannel && <Chat channelRef={channelRef} />}
    </RChat.Container>
  );
};

RChat.Container = styled.div`
  width: 400px;
  font-size: 12px;
`;

RChat.JoinWindow = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.25em;
  font-size: 12px;
  height: 150px;

  button,
  input {
    height: 1.5em;
    font: inherit;
  }

  button {
    margin-inline: auto;
    width: 8em;
    height: 4em;
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
