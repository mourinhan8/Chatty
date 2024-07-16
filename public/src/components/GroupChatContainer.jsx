import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  sendMessageRoute,
  recieveMessageRoute,
  getGroupConversation
} from "../utils/APIRoutes";
import GroupMemberModal from "./GroupMemberModal";

export default function GroupChatContainer({ convId, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [convData, setConvData] = useState();
  const [members, setMembers] = useState([]);
  const [isOpenGroupMembers, setIsOpenGroupMembers] = useState(false);

  const handleOpenGroupMembers = () => {
    setIsOpenGroupMembers(true);
  };
  const handleCloseGroupMembers = useCallback(() => {
    setIsOpenGroupMembers(false);

  }, []);

  const fetchChatData = async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const conversationData = await axios.post(getGroupConversation, {
      userId: data.id,
      convId
    });
    setConvData(conversationData.data.convData);
    setMembers(conversationData.data.users);
    const id = conversationData.data.convData.id;
    socket.current.emit("join-Conv", { convId: id, userId: data.id });
    const messages = await axios.post(recieveMessageRoute, {
      from: data.id,
      convId: id,
    });
    setMessages(messages.data);
  };

  useEffect(() => {
    fetchChatData();
  }, [convId]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    if (convId) {
      socket.current.emit("send-msg", {
        to: convId,
        from: data.id,
        msg,
      });
      await axios.post(sendMessageRoute, {
        from: data.id,
        to: convId,
        message: msg,
      });
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setMessages((prev) => [...prev, { fromSelf: false, message: msg }]);
      });
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${convData?.img}`}
              alt={`avt`}
            />
          </div>
          <div className="username">
            <h3>{convData?.name}</h3>
          </div>
          <p className="group-members" onClick={handleOpenGroupMembers}>
            see group members
          </p>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
      <GroupMemberModal
        isOpen={isOpenGroupMembers}
        onClose={handleCloseGroupMembers}
        members={members}
      />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        color: white;
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: AliceBlue;
        }
      }
      .group-members {
        color: #a4a4f3;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #7FFFD4;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
