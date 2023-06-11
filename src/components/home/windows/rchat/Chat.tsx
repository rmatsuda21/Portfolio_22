import { Types } from "ably";
import { ReactElement, useContext, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { AblyContext, IAblyContext } from "../../../hooks/AblyProvider";

enum MessageType {
  USER_MESSAGE,
  JOINED_MESSAGE,
  SYSTEM_MESSAGE,
  LEAVE_MESSAGE,
}

interface IMessage {
  message: string;
  type: MessageType;
  name?: string;
}

interface IChatProps {
  channelRef: React.MutableRefObject<
    Types.RealtimeChannelCallbacks | undefined
  >;
  leaveChat: () => void;
  name: string;
}

export const Chat = ({ channelRef, leaveChat, name }: IChatProps) => {
  const channel = channelRef.current;
  const { deviceId } = useContext(AblyContext) as IAblyContext;
  const theme = useTheme();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channelMembers, setChannelMembers] = useState<Types.PresenceMessage[]>(
    []
  );
  const [showMemberList, setShowMemberList] = useState(false);

  useEffect(() => {
    const updateChannelMembers = () =>
      channel?.presence.get((_, members) => {
        setChannelMembers(members as Types.PresenceMessage[]);
      });

    const onMessageSend: Types.messageCallback<Types.Message> = (foo) => {
      const { data } = foo;
      const newMessage: IMessage = {
        message: data?.message,
        type: data?.type,
        name: data?.name,
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
    if (message.trim() === "") return;

    channel?.publish("send", {
      message,
      type: MessageType.USER_MESSAGE,
      deviceId,
      name,
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
      <Chat.Header>
        <Chat.Button onClick={leaveChat}>Leave</Chat.Button>
        <Chat.Button onClick={() => setShowMemberList((prev) => !prev)}>
          Member List
        </Chat.Button>
      </Chat.Header>
      {showMemberList && (
        <Chat.MemberList>
          {channelMembers?.map((member, indx) => (
            <p key={indx}>{member?.data?.name}</p>
          ))}
        </Chat.MemberList>
      )}
      <Chat.Chat>
        {messages.map(({ message, type, name: senderName }, indx) => {
          const style: React.CSSProperties = { color: "" };
          let sender: ReactElement = <></>;

          switch (type) {
            case MessageType.USER_MESSAGE:
              style.color = theme.text;
              if (senderName) sender = <Chat.Sender>{senderName}</Chat.Sender>;
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
              {sender}
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
        <Chat.Button onClick={onSendMessage}>
          <span>SEND</span>
        </Chat.Button>
      </Chat.Footer>
    </>
  );
};

Chat.Header = styled.div`
  display: flex;
  gap: 0.5em;
  height: 1.5em;
`;

Chat.MemberList = styled.div`
  position: absolute;
  right: 0;

  display: flex;
  flex-direction: column;
  width: 10em;
  color: ${({ theme }) => theme.text};
  font-size: 1em;
  max-height: 6em;
  overflow-y: scroll;

  p {
    padding: 0.5em;
  }
  p:nth-child(even) {
    background-color: ${({ theme }) => theme.background};
  }
  p:nth-child(odd) {
    background-color: ${({ theme }) => theme.background2};
  }
`;

Chat.Chat = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75em;
  gap: 1em;
  width: calc(100% - 1.5em);
  max-width: calc(100% - 1.5em);
  height: 30em;
  max-height: 400px;
  overflow-y: scroll;

  ${({ theme }) => `
    color: ${theme.text};
    background-color: ${theme.background3};
  `}
`;

Chat.Sender = styled.span`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  margin-right: 0.75em;
  padding: 0.25em;
  border-radius: 0.15em;
  line-height: 0.5em;
`;

Chat.Footer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  font-size: 12px;
  height: 24px;

  input {
    flex: 1;
    font-size: 12px;
    height: 100%;
    border: none;
    padding-block: 0;
    padding-inline: 3px;
  }

  input:focus-visible {
    outline: none;
    background-color: rgb(210, 210, 210);
  }
`;

Chat.Button = styled.div`
  border-radius: 0;
  padding-inline: 0.25em;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.accent2};

  &:hover {
    cursor: pointer;
    filter: brightness(1.1);
  }
`;
