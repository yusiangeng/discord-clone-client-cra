import { setLocalStream, setRemoteStreams } from "../store/actions/roomActions";
import store from "../store/store";
import Peer from "simple-peer";
import { RemoteStream, SignalData } from "../types/types";
import { signalPeerData } from "./socketConnection";

const getConfiguration = () => {
  const turnIceServers = null;

  if (turnIceServers) {
    // turn server credentials
  } else {
    console.warn("Using STUN server");
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
  }
};

export const getLocalStreamPreview = (audioOnly = false, cb: () => void) => {
  const constraints = {
    audio: true,
    video: true,
  };

  if (audioOnly) {
    constraints.video = false;
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      cb();
    })
    .catch((err) => {
      console.error("Could not get access to local stream:", err);
    });
};

const peers = new Map<string, Peer.Instance>();

export const prepareNewPeerConnection = (
  connUserSocketId: string,
  isInitiator: boolean
) => {
  const localStream = store.getState().room.localStream;

  if (isInitiator) {
    console.log("prep new peer conn as initiator");
  } else {
    console.log("prep new peer conn as NOT initiator");
  }

  peers.set(
    connUserSocketId,
    new Peer({
      initiator: isInitiator,
      config: getConfiguration(),
      stream: localStream ?? undefined,
    })
  );

  peers.get(connUserSocketId)!.on("signal", (data) => {
    console.log("peer instance signal event:", data);
    const signalData: SignalData = {
      signal: data,
      connUserSocketId,
    };

    signalPeerData(signalData);
  });

  peers.get(connUserSocketId)!.on("stream", (remoteStream: RemoteStream) => {
    console.log("remote stream came from other user");
    remoteStream.connUserSocketId = connUserSocketId;
    addNewRemoteStream(remoteStream);
  });
};

export const handleSignalData = (data: SignalData) => {
  const { connUserSocketId, signal } = data;

  if (peers.has(connUserSocketId)) {
    peers.get(connUserSocketId)!.signal(signal);
  }
};

const addNewRemoteStream = (remoteStream: RemoteStream) => {
  const remoteStreams = store.getState().room.remoteStreams;
  store.dispatch(setRemoteStreams([...remoteStreams, remoteStream]));
};

export const closeAllConnections = () => {
  peers.forEach((peer, connUserSocketId) => {
    peer?.destroy();
    peers.delete(connUserSocketId);
  });
};

export const handleParticipantLeftRoom = (data: {
  connUserSocketId: string;
}) => {
  peers.get(data.connUserSocketId)?.destroy();
  peers.delete(data.connUserSocketId);

  const remoteStreams = store.getState().room.remoteStreams;
  store.dispatch(
    setRemoteStreams(
      remoteStreams.filter(
        (stream) => stream.connUserSocketId !== data.connUserSocketId
      )
    )
  );
};

export const switchOutgoingTracks = (stream: MediaStream) => {
  console.log("switching outgoing tracks...", stream);
  console.log("peers:", peers);
  for (let socketId of peers.keys()) {
    console.log("peer tracks:", peers.get(socketId)!.streams[0].getTracks());
    for (let index in peers.get(socketId)!.streams[0].getTracks()) {
      console.log("stream tracks:", stream.getTracks());
      for (let index2 in stream.getTracks()) {
        console.log("checking...");
        if (
          peers.get(socketId)!.streams[0].getTracks()[index].kind ===
          stream.getTracks()[index2].kind
        ) {
          peers
            .get(socketId)!
            .replaceTrack(
              peers.get(socketId)!.streams[0].getTracks()[index],
              stream.getTracks()[index2],
              peers.get(socketId)!.streams[0]
            );
          console.log("switched outgoing tracks!");
          break;
        }
      }
    }
  }
};
