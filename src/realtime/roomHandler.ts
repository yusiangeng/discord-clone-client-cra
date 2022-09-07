import {
  setActiveRooms,
  setDidUserJoinWithAudioOnly,
  setLocalStream,
  setOpenRoom,
  setRemoteStreams,
  setRoomDetails,
  setScreenSharingStream,
} from "../store/actions/roomActions";
import store from "../store/store";
import { RoomDetails, RoomDetailsWithCreatorUsername } from "../types/types";
import * as socketConnection from "./socketConnection";
import { closeAllConnections, getLocalStreamPreview } from "./webRTCHandler";

export const createNewRoom = () => {
  const audioOnly = store.getState().room.audioOnly;

  const onSuccess = () => {
    store.dispatch(setOpenRoom(true, true));
    store.dispatch(setDidUserJoinWithAudioOnly(audioOnly));
    socketConnection.createNewRoom();
  };

  getLocalStreamPreview(audioOnly, onSuccess);
};

export const saveRoomDetailsToStore = ({
  roomDetails,
}: {
  roomDetails: RoomDetails;
}) => {
  store.dispatch(setRoomDetails(roomDetails));
};

export const updateActiveRooms = (data: { activeRooms: RoomDetails[] }) => {
  const friends = store.getState().friends.friends;
  const rooms: RoomDetailsWithCreatorUsername[] = [];
  const userId = store.getState().auth.userDetails?._id;

  data.activeRooms.forEach((room) => {
    if (room.roomCreator.userId === userId) {
      rooms.push({
        ...room,
        creatorUsername: "Me",
      });
    } else {
      friends.forEach((friend) => {
        if (friend.id === room.roomCreator.userId) {
          rooms.push({
            ...room,
            creatorUsername: friend.username,
          });
        }
      });
    }
  });

  store.dispatch(setActiveRooms(rooms));
};

export const joinRoom = (roomId: string) => {
  const audioOnly = store.getState().room.audioOnly;

  const onSuccess = () => {
    store.dispatch(setRoomDetails({ roomId } as RoomDetails));
    store.dispatch(setOpenRoom(false, true));
    store.dispatch(setDidUserJoinWithAudioOnly(audioOnly));
    socketConnection.joinRoom({ roomId });
  };

  getLocalStreamPreview(audioOnly, onSuccess);
};

export const leaveRoom = () => {
  const localStream = store.getState().room.localStream;
  if (localStream) {
    store.dispatch(setLocalStream(null));
    localStream.getTracks().forEach((track) => track.stop());
  }

  const screenSharingStream = store.getState().room.screenSharingStream;
  if (screenSharingStream) {
    store.dispatch(setScreenSharingStream(null));
    screenSharingStream.getTracks().forEach((track) => track.stop());
  }

  store.dispatch(setRemoteStreams([]));
  closeAllConnections();

  const roomId = store.getState().room.roomDetails?.roomId;
  if (roomId) {
    socketConnection.leaveRoom({ roomId });
  }
  store.dispatch(setRoomDetails(null));
  store.dispatch(setOpenRoom(false, false));
};
