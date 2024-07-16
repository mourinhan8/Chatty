import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { BiConversation } from "react-icons/bi";
import axios from "axios";
import { getAllGroupOfUser } from "../utils/APIRoutes";

export default function Contacts({ contacts, changeChat, handleOpenCreateConversation, onSetType, onSetConv }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [tab, setTab] = useState('single');
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data?.username);
      setCurrentUserImage(data?.avatarImage);
    };
    getData();
  }, []);

  const handleChangeTabToGroup = async () => {
    if (tab === 'single') {
      setTab('group');
      setCurrentSelected(undefined);
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const convsData = await axios.post(getAllGroupOfUser, { userId: data.id });
      setGroups(convsData.data.convs);
    }
  };

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const changeGroupChat = (index, convId) => {
    setCurrentSelected(index);
    onSetConv(convId);
  };

  // Filter contacts based on the current tab
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Chatty</h3>
          </div>
          <div className="tabs">
            <TabButton
              className={tab === 'single' ? 'active' : ''}
              onClick={() => setTab('single')}
            >
              Single
            </TabButton>
            <TabButton
              className={tab === 'group' ? 'active' : ''}
              onClick={handleChangeTabToGroup}
            >
              Group
            </TabButton>
          </div>
          <div className="contacts">
            {tab === 'single' && contacts.map((contact, index) => (
              <div
                key={contact.id}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => {
                  changeCurrentChat(index, contact);
                  onSetType(tab);
                }}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                  />
                </div>
                <div className="username">
                  <h3>{contact?.username}</h3>
                </div>
              </div>
            ))}
            {tab === 'group' && groups.map((group, index) => (
              <div
                key={group.id}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => {
                  changeGroupChat(index, group.id);
                  onSetType(tab);
                }}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${group.img}`}
                    alt=""
                  />
                </div>
                <div className="username">
                  <h3>{group.name}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="create-conversation">
            <Button onClick={handleOpenCreateConversation}>
              <BiConversation />
            </Button>
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 0.5rem 0;
  border: none;
  background-color: #ffffff;
  color: #000;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  &.active {
    background-color: #8190a4;
  }
  &:hover {
    background-color: #c5daf7;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 10% 60% 10% 10%;
  overflow: hidden;
  background-color: rgb(41 36 36);
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: AliceBlue;
      text-transform: uppercase;
    }
  }
  .tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background-color: #2c2c2c;
    padding: 0 5px;
    margin-bottom: 5px;
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: AliceBlue;
        }
      }
    }
    .selected {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
  .create-conversation {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: AliceBlue;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
