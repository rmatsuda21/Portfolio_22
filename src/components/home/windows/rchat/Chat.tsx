import { Types } from "ably";
import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { useAbly } from "../../../hooks/useAbly";

enum MessageType {
  USER_MESSAGE,
  JOINED_MESSAGE,
  SYSTEM_MESSAGE,
  LEAVE_MESSAGE,
}

interface IMessage {
  message: string;
  type: MessageType;
}

interface IChatProps {
  channelRef: React.MutableRefObject<
    Types.RealtimeChannelCallbacks | undefined
  >;
}

export const Chat = ({ channelRef }: IChatProps) => {
  const channel = channelRef.current;
  const { deviceId } = useAbly();
  const theme = useTheme();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channelMembers, setChannelMembers] = useState<Types.PresenceMessage[]>(
    []
  );

  const updateChannelMembers = () =>
    channel?.presence.get((_, members) => {
      setChannelMembers(members as Types.PresenceMessage[]);
    });

  const onMessageSend: Types.messageCallback<Types.Message> = (foo) => {
    const { data } = foo;
    const newMessage: IMessage = {
      message: data?.message,
      type: data?.type,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const onPresenceEnter: Types.messageCallback<Types.PresenceMessage> = ({
    data,
  }) => {
    updateChannelMembers();
    const newMessage: IMessage = {
      message: `${data?.name} has joined`,
      type: MessageType.JOINED_MESSAGE,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const onPresenceLeave: Types.messageCallback<Types.PresenceMessage> = ({
    data,
  }) => {
    updateChannelMembers();
    const newMessage: IMessage = {
      message: `${data?.name} has left`,
      type: MessageType.LEAVE_MESSAGE,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    updateChannelMembers();

    channel?.subscribe("send", onMessageSend);

    channel?.presence.subscribe("enter", onPresenceEnter);

    channel?.presence.subscribe("leave", onPresenceLeave);

    return () => {
      channel?.unsubscribe("send", onMessageSend);
      channel?.presence.unsubscribe("enter", onPresenceEnter);
      channel?.presence.unsubscribe("leave", onPresenceLeave);
    };
  }, [channel]);

  const onSendMessage = () => {
    channel?.publish("send", {
      message,
      type: MessageType.USER_MESSAGE,
      deviceId,
    });
    setMessage("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") onSendMessage();
  };

  return (
    <>
      <Chat.MemberList>
        {channelMembers?.map((member, indx) => (
          <p key={indx}>{member?.data?.name}</p>
        ))}
      </Chat.MemberList>
      <Chat.Chat>
        {messages.map(({ message, type }, indx) => {
          const style: React.CSSProperties = { color: "" };

          switch (type) {
            case MessageType.USER_MESSAGE:
              style.color = theme.text;
              break;
            case MessageType.JOINED_MESSAGE:
              style.color = "lightblue";
              break;
            case MessageType.LEAVE_MESSAGE:
              style.color = "red";
              break;
            default:
              style.color = theme.text;
          }

          return (
            <p style={style} key={indx}>
              {message}
            </p>
          );
        })}
      </Chat.Chat>
      <Chat.Footer>
        <input
          type="text"
          value={message}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <button onClick={onSendMessage}>SEND</button>
      </Chat.Footer>
    </>
  );
};

Chat.MemberList = styled.div`
  display: flex;
  gap: 1em;
  width: 100%;
  height: 1.5em;
  padding: 0.5em;
  color: ${({ theme }) => theme.text};
`;

Chat.Chat = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 30em;
  max-height: 400px;
  overflow-y: scroll;

  font-size: 1em;
  line-height: 1.25em;

  ${({ theme }) => `
    color: ${theme.text};
    background-color: ${theme.background3};
  `}
`;

Chat.Footer = styled.div`
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
