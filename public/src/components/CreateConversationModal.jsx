import React, { useState } from 'react';
import styled from 'styled-components';
import UserCard from './UserCard';
import { debounce, isEmpty } from 'lodash';
import axios from 'axios';
import { allUsersRoute, createGroupConversation } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import SelectedUser from './SelectedUser';

const CreateConversationModal = ({ isOpen, onClose, onSetConv, onSetType }) => {
  const [userQuery, setUserQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();



  React.useEffect(async () => {
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

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.id === 'modalBackground') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(`${allUsersRoute}/${currentUser.id}?username=${userQuery}`);
      const filteredResults = data.filter(
        (user) => !selectedUsers.some((selectedUser) => selectedUser?.username === user?.username)
      );
      setSearchResults(filteredResults);
    };
    if (userQuery) {
      fetchUsers();
    } else {
      setSearchResults([]);
    }
  }, [userQuery]);

  if (!isOpen) return null;

  const updateQuery = (e) => setUserQuery(e?.target?.value);

  const debounceOnchange = debounce(updateQuery, 1000);

  const handleAddUser = (user) => {
    if (!selectedUsers.some((u) => u.username === user?.username)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchResults(searchResults.filter(u => u.username !== user?.username))
    }
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.username !== user?.username));
  };

  const handleSubmitCreateConversation = async () => {
    if (!isEmpty(selectedUsers)) {
      const data = await axios.post(`${createGroupConversation}`, {
        userId: currentUser.id,
        participants: selectedUsers.map(u => u.id),
      })
      onSetConv(data.data.convId);
      onSetType("group");
      onClose();
      setUserQuery('');
      setSearchResults([]);
      setSelectedUsers([]);
    }
  }

  return (
    <ModalBackground id="modalBackground">
      <ModalContainer>
        <Header>
          <Title>Create Group Chat</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <SearchContainer>
          <Label htmlFor="userName">User Name</Label>
          <Input
            type="text"
            onChange={debounceOnchange}
            required
          />
          <SelectedUsersContainer>
            {selectedUsers.map((user, index) => (
              <SelectedUser key={index} user={user} onRemove={handleRemoveUser} />
            ))}
          </SelectedUsersContainer>
          <SubmitButton type="submit" onClick={handleSubmitCreateConversation}>Create Group</SubmitButton>
          {searchResults.map((user) => <UserCard user={user} onAdd={handleAddUser}/>)}
        </SearchContainer>
      </ModalContainer>
    </ModalBackground>
  );
};

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 15px;
`;

const SelectedUsersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default CreateConversationModal;