import { AxiosError } from "axios";
import toast from "react-hot-toast";
import * as friendsApi from "../../api/friends";
import {
  FriendData,
  InvitationData,
  InvitePostData,
  OnlineUserData,
} from "../../types/types";
import { AppDispatch } from "../store";

export const friendsActions = {
  SET_FRIENDS: "FRIENDS.SET_FRIENDS",
  SET_PENDING_FRIENDS_INVITATIONS: "FRIENDS.SET_PENDING_FRIENDS_INVITATIONS",
  SET_ONLINE_USERS: "FRIENDS.SET_ONLINE_USERS",
};

export const getActions = (dispatch: AppDispatch) => {
  return {
    sendFriendInvitation: (
      data: InvitePostData,
      closeDialogHandler: () => void
    ) => dispatch(sendFriendInvitation(data, closeDialogHandler)),
    acceptFriendInvitation: (invitationId: string) => {
      dispatch(acceptFriendInvitation(invitationId));
    },
    rejectFriendInvitation: (invitationId: string) => {
      dispatch(rejectFriendInvitation(invitationId));
    },
  };
};

export const setPendingFriendsInvitations = (
  pendingFriendsInvitations: InvitationData[]
) => {
  return {
    type: friendsActions.SET_PENDING_FRIENDS_INVITATIONS,
    payload: { pendingFriendsInvitations },
  };
};

export const setFriends = (friends: FriendData[]) => {
  return {
    type: friendsActions.SET_FRIENDS,
    payload: { friends },
  };
};

export const setOnlineUsers = (onlineUsers: OnlineUserData) => {
  return {
    type: friendsActions.SET_ONLINE_USERS,
    payload: { onlineUsers },
  };
};

const sendFriendInvitation = (
  data: InvitePostData,
  closeDialogHandler: () => void
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const res = await friendsApi.sendFriendInvitation(data);
      toast.success(res.data);
      closeDialogHandler();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      }
    }
  };
};

const acceptFriendInvitation = (invitationId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const res = await friendsApi.acceptFriendInvitation(invitationId);
      toast.success(res.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      }
    }
  };
};

const rejectFriendInvitation = (invitationId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const res = await friendsApi.rejectFriendInvitation(invitationId);
      toast.success(res.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      }
    }
  };
};
