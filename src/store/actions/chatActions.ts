import { ChatMessageData, SelectedChatDetailsData } from "../../types/types";
import { AppDispatch } from "../store";

export enum ChatType {
  DIRECT = "DIRECT",
  GROUP = "GROUP",
}

export const chatActions = {
  SET_CHOSEN_CHAT_DETAILS: "CHAT.SET_CHOSEN_CHAT_DETAILS",
  SET_MESSAGES: "CHAT.SET_MESSAGES",
  SET_CHAT_TYPE: "CHAT.SET_CHAT_TYPE",
};

export const getActions = (dispatch: AppDispatch) => {
  return {
    setSelectedChatDetails: (
      details: SelectedChatDetailsData,
      chatType: ChatType
    ) => {
      dispatch(setSelectedChatDetails(details, chatType));
    },
  };
};

const setSelectedChatDetails = (
  selectedChatDetails: SelectedChatDetailsData,
  chatType: ChatType
) => {
  return {
    type: chatActions.SET_CHOSEN_CHAT_DETAILS,
    payload: {
      chatType,
      selectedChatDetails,
    },
  };
};

export const setMessages = (messages: ChatMessageData[]) => {
  return {
    type: chatActions.SET_MESSAGES,
    payload: {
      messages,
    },
  };
};
