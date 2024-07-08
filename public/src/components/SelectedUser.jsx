import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  background: #e0e0e0;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 15px;
`;

const UserName = styled.span`
  margin-right: 10px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff0000;
  cursor: pointer;
  font-size: 1rem;
`;

const SelectedUser = ({ user, onRemove }) => {
  return (
    <UserContainer>
      <UserName>{user?.username}</UserName>
      <RemoveButton onClick={() => onRemove(user)}>
        <FaTimes />
      </RemoveButton>
    </UserContainer>
  );
};

export default SelectedUser;