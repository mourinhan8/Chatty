// UserCard.js
import React from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';

const UserCard = ({ user, onAdd }) => {
  return (
    <CardContainer>
      <Avatar src={user?.avatar} alt={`${user?.name}'s avatar`} />
      <UserInfo>
        <UserName>{user?.username}</UserName>
      </UserInfo>
      <AddButton onClick={() => onAdd(user)}>
        <FaPlus />
      </AddButton>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f9f9f9;
  padding: 5px 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const AddButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1.5rem;
`;

export default UserCard;
