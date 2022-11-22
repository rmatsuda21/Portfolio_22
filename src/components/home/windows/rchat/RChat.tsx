import { Types } from "ably";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAbly } from "../../../hooks/useAbly";

export const RChat = () => {
  const [channel, setChannel] = useState<Types.RealtimeChannelPromise>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const { ably, joinChannel, deviceId } = useAbly();

  useEffect(() => {
    const joinChannelAndSubscribe = async () => {
      const channel = await joinChannel("rchat");
      console.log(channel);
      await setChannel(channel);
      await channel?.subscribe("send", ({ data }: Types.Message) => {
        setMessages((prevMessages) => [...prevMessages, data?.message]);
      });
    };

    joinChannelAndSubscribe();

    return () => channel?.detach();
  }, [ably]);

  const onClickHandle = () => {
    channel?.publish("send", {
      message,
      deviceId,
    });
    setMessage("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <RChat.Container>
      <RChat.Chat>
        {messages.map((message, indx) => (
          <p key={indx}>{message}</p>
        ))}
      </RChat.Chat>
      <RChat.Footer>
        <input type="text" value={message} onChange={onChange} />
        <button onClick={onClickHandle}>SEND</button>
      </RChat.Footer>
    </RChat.Container>
  );
};

RChat.Container = styled.div`
  width: 400px;
`;

RChat.Chat = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 400px;
  max-height: 400px;

  ${({ theme }) => `
    color: ${theme.text};
    background-color: ${theme.background3};
  `}
`;

RChat.Footer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  width: 100%;
  font-size: 12px;

  input {
    flex: 1;
    height: 20px;
  }

  button {
    font: inherit;
    padding: 0.5em;
  }
`;
