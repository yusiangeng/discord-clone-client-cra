import { PayloadAction } from "@reduxjs/toolkit";
import { ChatMessageData, SelectedChatDetailsData } from "../../types/types";
import { chatActions, ChatType } from "../actions/chatActions";

const initialState: {
  selectedChatDetails: SelectedChatDetailsData | null;
  chatType: ChatType | null;
  messages: ChatMessageData[];
} = {
  selectedChatDetails: null,
  chatType: null,
  messages: [],
};

const reducer = (
  state = initialState,
  action: PayloadAction<typeof initialState>
) => {
  switch (action.type) {
    case chatActions.SET_CHOSEN_CHAT_DETAILS:
      return {
        ...state,
        selectedChatDetails: action.payload.selectedChatDetails,
        chatType: action.payload.chatType,
        messages: [],
      };
    case chatActions.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload.messages,
      };
    default:
      return state;
  }
};

export default reducer;
