import io, { Socket } from "socket.io-client";
import {
  setFriends,
  setOnlineUsers,
  setPendingFriendsInvitations,
} from "../store/actions/friendsActions";
import store from "../store/store";
import { SignalData, UserDetails } from "../types/types";
import { updateDirectChatHistoryIfActive } from "../utils/chat";
import { saveRoomDetailsToStore, updateActiveRooms } from "./roomHandler";
import {
  handleParticipantLeftRoom,
  handleSignalData,
  prepareNewPeerConnection,
} from "./webRTCHandler";

let socket: Socket;

export const connectToSocketServer = (userDetails: UserDetails) => {
  socket = io("http://localhost:8000", {
    auth: {
      token: userDetails.token,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to socket.io server:", socket.id);
  });

  socket.on("friends-invitations", (data) => {
    store.dispatch(setPendingFriendsInvitations(data.pendingInvitations));
  });

  socket.on("friends-list", (data) => {
    store.dispatch(setFriends(data.friends));
  });

  socket.on("online-users", (data) => {
    store.dispatch(setOnlineUsers(data.onlineUsers));
  });

  socket.on("direct-chat-history", (data) => {
    updateDirectChatHistoryIfActive(data);
  });

  socket.on("create-room", (data) => {
    saveRoomDetailsToStore(data);
  });

  socket.on("active-rooms", (data) => {
    updateActiveRooms(data);
  });

  socket.on("conn-prepare", (data) => {
    console.log("conn-prepare event:", data);
    prepareNewPeerConnection(data.connUserSocketId, false);
    socket.emit("conn-init", { connUserSocketId: data.connUserSocketId });
  });

  socket.on("conn-init", (data) => {
    console.log("conn-init event:", data);
    prepareNewPeerConnection(data.connUserSocketId, true);
  });

  socket.on("conn-signal", (data) => {
    console.log("conn-signal event:", data);
    handleSignalData(data);
  });

  socket.on("room-participant-left", (data) => {
    console.log("room-participant-left event:", data);
    handleParticipantLeftRoom(data);
  });
};

export const sendDirectMessage = (data: {
  receiverUserId: string;
  content: string;
}) => {
  socket.emit("direct-message", data);
};

export const getDirectChatHistory = (data: { receiverUserId: string }) => {
  socket.emit("direct-chat-history", data);
};

export const createNewRoom = () => {
  socket.emit("create-room");
};

export const joinRoom = (data: { roomId: string }) => {
  socket.emit("join-room", data);
};

export const leaveRoom = (data: { roomId: string }) => {
  socket.emit("leave-room", data);
};

export const signalPeerData = (data: SignalData) => {
  socket.emit("conn-signal", data);
};
