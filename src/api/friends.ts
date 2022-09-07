import { AxiosError } from "axios";
import { InvitePostData } from "../types/types";
import { checkResponseCode } from "../utils/auth";
import apiClient from "./api";

export const sendFriendInvitation = async (data: InvitePostData) => {
  try {
    return await apiClient.post("/friend-invitation/invite", data);
  } catch (err) {
    checkResponseCode(err as AxiosError);
    throw err;
  }
};

export const acceptFriendInvitation = async (invitationId: string) => {
  try {
    return await apiClient.post("/friend-invitation/accept", {
      id: invitationId,
    });
  } catch (err) {
    checkResponseCode(err as AxiosError);
    throw err;
  }
};

export const rejectFriendInvitation = async (invitationId: string) => {
  try {
    return await apiClient.post("/friend-invitation/reject", {
      id: invitationId,
    });
  } catch (err) {
    checkResponseCode(err as AxiosError);
    throw err;
  }
};
