import { PayloadAction } from "@reduxjs/toolkit";
import { FriendData, InvitationData, OnlineUserData } from "../../types/types";
import { friendsActions } from "../actions/friendsActions";

const initialState: {
  friends: FriendData[];
  pendingFriendsInvitations: InvitationData[];
  onlineUsers: OnlineUserData[];
} = {
  friends: [],
  pendingFriendsInvitations: [],
  onlineUsers: [],
};

const reducer = (
  state = initialState,
  action: PayloadAction<typeof initialState>
) => {
  switch (action.type) {
    case friendsActions.SET_PENDING_FRIENDS_INVITATIONS:
      return {
        ...state,
        pendingFriendsInvitations: action.payload.pendingFriendsInvitations,
      };
    case friendsActions.SET_FRIENDS:
      return {
        ...state,
        friends: action.payload.friends,
      };
    case friendsActions.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.payload.onlineUsers,
      };
    default:
      return state;
  }
};

export default reducer;
