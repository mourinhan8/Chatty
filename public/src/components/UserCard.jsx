// UserCard.js
import React from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';

const UserCard = ({ user, onAdd }) => {
  return (
    <CardContainer>
      <Avatar
        src={`data:image/svg+xml;base64,${user?.avatarImage}`}
        alt={`${user?.name}'s avatar`}
      />
      <StatusDot
        status={user?.status}
        isSetAvt={user?.isAvatarImageSet}
      />
      <UserInfo>
        <UserName>{user?.username}</UserName>
      </UserInfo>
      {
        onAdd !== undefined &&
        <AddButton onClick={() => onAdd(user)}>
          <FaPlus />
        </AddButton>
      }

    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  position: relative;
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

const StatusDot = styled.div`
  position: absolute;
  bottom: ${({ isSetAvt }) => isSetAvt ? '5px' : '0px'};
  right: ${({ isSetAvt }) => isSetAvt ? '2px' : '0px'};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ status }) => {
    switch (status) {
      case 'online':
        return 'green';
      case 'offline':
        return 'gray';
      default:
        return 'gray';
    }
  }};
  border: 2px solid white;
`;

export default UserCard;
