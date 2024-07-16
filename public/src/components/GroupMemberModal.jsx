import React from 'react';
import styled from 'styled-components';
import UserCard from './UserCard';

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

const listUser = [
    {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://i.pravatar.cc/300?img=1',
    },
    {
        id: 2,
        name: 'Jane Doe',
        username: 'janedoe',
        avatar: 'https://i.pravatar.cc/300?img=2',
    },
];

const GroupMemberModal = ({ isOpen, onClose, members }) => {

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

    if (!isOpen) return null;

    return (
        <ModalBackground>
            <ModalContainer>
                <Header>
                    <Title>Group's members</Title>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </Header>
                {members.map((member) => <UserCard user={member} />)}
            </ModalContainer>
        </ModalBackground>
    );
};

export default GroupMemberModal;