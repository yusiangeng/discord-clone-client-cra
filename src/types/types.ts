import Peer from "simple-peer";
import { ChatType } from "../store/actions/chatActions";

// ------------------
// auth
// ------------------
export interface LoginPostData {
  email: string;
  password: string;
}

export interface RegisterPostData extends LoginPostData {
  username: string;
}

export interface UserDetails {
  _id: string;
  username: string;
  email: string;
  token: string;
}

// ------------------
// online users
// ------------------
export interface OnlineUserData {
  socketId: string;
  userId: string;
}

// ------------------
// friends
// ------------------
export interface InvitePostData {
  targetEmail: string;
}

export interface FriendDataWithOnline extends FriendData {
  isOnline: boolean;
}

export interface FriendData {
  id: string;
  username: string;
  email: string;
}

export interface InvitationData {
  _id: string;
  receiverId: string;
  senderId: {
    _id: string;
    email: string;
    username: string;
  };
}

// ------------------
// chat
// ------------------
export interface ChatMessageData {
  _id: string;
  authorId: {
    username: string;
    _id: string;
  };
  content: string;
  date: string;
  type: ChatType;
}

export interface SelectedChatDetailsData {
  id: string;
  name: string;
}

// ------------------
// rooms
// ------------------
export interface RoomDetails {
  roomId: string;
  roomCreator: OnlineUserData;
  participants: OnlineUserData[];
}

export interface RoomDetailsWithCreatorUsername extends RoomDetails {
  creatorUsername: string;
}

export interface SignalData {
  signal: Peer.SignalData;
  connUserSocketId: string;
}

export interface RemoteStream extends MediaStream {
  connUserSocketId: string;
}
