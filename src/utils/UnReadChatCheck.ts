import { unReadChat } from '../features/chat/chatroomSlice';
export const UnReadChatCheck = (unReadChats: unReadChat[], dmGroupId: number) => {
  const index = unReadChats.findIndex(unReadChat => unReadChat.dmGroupId === dmGroupId);
  if (index !== -1) return true;
  else return false;
};
