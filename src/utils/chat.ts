import { setMessages } from "../store/actions/chatActions";
import store from "../store/store";
import { ChatMessageData } from "../types/types";

export const updateDirectChatHistoryIfActive = (data: {
  participants: string[];
  messages: ChatMessageData[];
}) => {
  const { participants, messages } = data;

  const receiverId = store.getState().chat.selectedChatDetails?.id;
  const userId = store.getState().auth.userDetails!._id;

  if (receiverId && userId) {
    const usersInConversation: [string, string] = [receiverId, userId];
    updateChatHistoryIfSameConversationActive({
      participants,
      messages,
      usersInConversation,
    });
  }
};

const updateChatHistoryIfSameConversationActive = ({
  participants,
  messages,
  usersInConversation,
}: {
  participants: string[];
  messages: ChatMessageData[];
  usersInConversation: [string, string];
}) => {
  const conversationIsActive = participants.every((participantId) =>
    usersInConversation.includes(participantId)
  );

  if (conversationIsActive) {
    store.dispatch(setMessages(messages));
  }
};
