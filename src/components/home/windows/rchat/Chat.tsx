import { Types } from "ably";
import { ReactElement, useEffect, useState } from "react";
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
  const { deviceId } = useAbly();
  const theme = useTheme();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channelMembers, setChannelMembers] = useState<Types.PresenceMessage[]>(
    []
  );
  const [showMemberList, setShowMemberList] = useState(false);

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
      <div>
        <button onClick={leaveChat}>Leave</button>
        <button onClick={() => setShowMemberList((prev) => !prev)}>
          Member List
        </button>
      </div>
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
              if (senderName)
                sender = (
                  <span
                    style={{
                      color: theme.text,
                      backgroundColor: theme.background,
                      marginRight: "1em",
                      padding: ".25em",
                    }}
                  >
                    {senderName}
                  </span>
                );
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
        <button onClick={onSendMessage}>SEND</button>
      </Chat.Footer>
    </>
  );
};

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
  gap: 0.5em;
  width: calc(100% - 1.5em);
  max-width: calc(100% - 1.5em);
  height: 30em;
  max-height: 400px;
  overflow-y: scroll;

  font-size: 1em;
  line-height: 1.5em;

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
