import { PayloadAction } from "@reduxjs/toolkit";
import {
  RemoteStream,
  RoomDetails,
  RoomDetailsWithCreatorUsername,
} from "../../types/types";
import { roomActions } from "../actions/roomActions";

const initialState: {
  isUserInRoom: boolean;
  isUserRoomCreator: boolean;
  roomDetails: RoomDetails | null;
  activeRooms: RoomDetailsWithCreatorUsername[];
  localStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  audioOnly: boolean;
  screenSharingStream: MediaStream | null;
  isScreenSharingActive: boolean;
  didUserJoinWithAudioOnly: boolean;
} = {
  isUserInRoom: false,
  isUserRoomCreator: false,
  roomDetails: null,
  activeRooms: [],
  localStream: null,
  remoteStreams: [],
  audioOnly: false,
  screenSharingStream: null,
  isScreenSharingActive: false,
  didUserJoinWithAudioOnly: false,
};

const reducer = (
  state = initialState,
  action: PayloadAction<typeof initialState>
) => {
  switch (action.type) {
    case roomActions.OPEN_ROOM:
      return {
        ...state,
        isUserRoomCreator: action.payload.isUserRoomCreator,
        isUserInRoom: action.payload.isUserInRoom,
      };
    case roomActions.SET_ROOM_DETAILS:
      return {
        ...state,
        roomDetails: action.payload.roomDetails,
      };
    case roomActions.SET_ACTIVE_ROOMS:
      return {
        ...state,
        activeRooms: action.payload.activeRooms,
      };
    case roomActions.SET_LOCAL_STREAM:
      return {
        ...state,
        localStream: action.payload.localStream,
      };
    case roomActions.SET_AUDIO_ONLY:
      return {
        ...state,
        audioOnly: action.payload.audioOnly,
      };
    case roomActions.SET_REMOTE_STREAMS:
      return {
        ...state,
        remoteStreams: action.payload.remoteStreams,
      };
    case roomActions.SET_SCREEN_SHARE_STREAM:
      return {
        ...state,
        isScreenSharingActive: action.payload.isScreenSharingActive,
        screenSharingStream: action.payload.screenSharingStream,
      };
    case roomActions.SET_DID_USER_JOIN_WITH_AUDIO_ONLY:
      return {
        ...state,
        didUserJoinWithAudioOnly: action.payload.didUserJoinWithAudioOnly,
      };
    default:
      return state;
  }
};

export default reducer;
