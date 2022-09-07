import {
  RemoteStream,
  RoomDetails,
  RoomDetailsWithCreatorUsername,
} from "../../types/types";
import { AppDispatch } from "../store";

export const roomActions = {
  OPEN_ROOM: "ROOM.OPEN_ROOM",
  SET_ROOM_DETAILS: "ROOM.SET_ROOM_DETAILS",
  SET_ACTIVE_ROOMS: "ROOM.SET_ACTIVE_ROOMS",
  SET_LOCAL_STREAM: "ROOM.SET_LOCAL_STREAM",
  SET_REMOTE_STREAMS: "ROOM.SET_REMOTE_STREAMS",
  SET_AUDIO_ONLY: "ROOM.SET_AUDIO_ONLY",
  SET_SCREEN_SHARE_STREAM: "ROOM.SET_SCREEN_SHARE_STREAM",
  SET_DID_USER_JOIN_WITH_AUDIO_ONLY: "ROOM.SET_DID_USER_JOIN_WITH_AUDIO_ONLY",
};

export const getActions = (dispatch: AppDispatch) => {
  return {
    setAudioOnly: (audioOnly: boolean) => dispatch(setAudioOnly(audioOnly)),
    setScreenSharingStream: (stream: MediaStream | null) =>
      dispatch(setScreenSharingStream(stream)),
  };
};

export const setOpenRoom = (
  isUserRoomCreator = false,
  isUserInRoom = false
) => {
  return {
    type: roomActions.OPEN_ROOM,
    payload: {
      isUserRoomCreator,
      isUserInRoom,
    },
  };
};

export const setRoomDetails = (roomDetails: RoomDetails | null) => {
  return {
    type: roomActions.SET_ROOM_DETAILS,
    payload: {
      roomDetails,
    },
  };
};

export const setActiveRooms = (
  activeRooms: RoomDetailsWithCreatorUsername[]
) => {
  return {
    type: roomActions.SET_ACTIVE_ROOMS,
    payload: {
      activeRooms,
    },
  };
};

export const setLocalStream = (localStream: MediaStream | null) => {
  return {
    type: roomActions.SET_LOCAL_STREAM,
    payload: {
      localStream,
    },
  };
};

export const setAudioOnly = (audioOnly: boolean) => {
  return {
    type: roomActions.SET_AUDIO_ONLY,
    payload: {
      audioOnly,
    },
  };
};

export const setRemoteStreams = (remoteStreams: RemoteStream[]) => {
  return {
    type: roomActions.SET_REMOTE_STREAMS,
    payload: {
      remoteStreams,
    },
  };
};

export const setScreenSharingStream = (stream: MediaStream | null) => {
  return {
    type: roomActions.SET_SCREEN_SHARE_STREAM,
    payload: {
      isScreenSharingActive: !!stream,
      screenSharingStream: stream,
    },
  };
};

export const setDidUserJoinWithAudioOnly = (
  didUserJoinWithAudioOnly: boolean
) => {
  return {
    type: roomActions.SET_DID_USER_JOIN_WITH_AUDIO_ONLY,
    payload: {
      didUserJoinWithAudioOnly,
    },
  };
};
