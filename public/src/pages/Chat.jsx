import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import SingleChatContainer from "../components/SingleChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import CreateConversationModal from "../components/CreateConversationModal";
import GroupChatContainer from "../components/GroupChatContainer";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [openCreateConversation, setOpenCreateConversation] = useState(false);
  const [convId, setConvId] = useState(undefined);
  const [type, setType] = useState(undefined);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const usersWithStatus = useMemo(() => {
    return contacts.map((user) => ({
      ...user,
      status: onlineUsers.includes(user.id) ? "online" : "offline",
    }));
  }, [contacts, onlineUsers]);

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser.id);
      socket.current.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser.id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  const handleOpenCreateConversation = () => {
    setOpenCreateConversation(true);
  };
  const handleCloseCreateConversation = useCallback(() => {
    setOpenCreateConversation(false);
  }, []);
  const handleSetConversation = (data) => {
    setConvId(data);
  };
  const handleSetType = (type) => {
    setType(type);
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={usersWithStatus}
            socket={socket}
            changeChat={handleChatChange}
            handleOpenCreateConversation={handleOpenCreateConversation}
            onSetType={handleSetType}
            onSetConv={handleSetConversation}
          />
          {currentChat === undefined && convId === undefined ? (
            <Welcome />
          ) : (
            type === 'single' ?
              (<SingleChatContainer currentChat={currentChat} socket={socket} />) :
              (<GroupChatContainer convId={convId} socket={socket} />)
          )}
          <CreateConversationModal
            isOpen={openCreateConversation}
            onClose={handleCloseCreateConversation}
            onSetConv={handleSetConversation}
            onSetType={handleSetType}
          />
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
