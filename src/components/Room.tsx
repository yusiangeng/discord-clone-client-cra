import {
  Close,
  CloseFullscreen,
  Mic,
  MicOff,
  OpenInFull,
  ScreenShare,
  StopScreenShare,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { grey, teal } from "@mui/material/colors";
import { Box } from "@mui/system";
import { useState } from "react";
import { connect } from "react-redux";
import { leaveRoom } from "../realtime/roomHandler";
import { switchOutgoingTracks } from "../realtime/webRTCHandler";
import { getActions } from "../store/actions/roomActions";
import { AppDispatch, RootState } from "../store/store";
import { RemoteStream } from "../types/types";
import Video from "./Video";

const Room = () => {
  const [isRoomMinimized, setIsRoomMinimized] = useState(true);

  return (
    <Box
      sx={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: grey[900],
        width: isRoomMinimized ? "400px" : "100%",
        height: isRoomMinimized ? "320px" : "100%",
        bottom: isRoomMinimized ? "0px" : undefined,
        right: isRoomMinimized ? "0px" : undefined,
        zIndex: 4,
        boxShadow: "0 0 8px 0 rgba(0,0,0,0.5)",
      }}
    >
      <VideosContainer />
      <RoomButtons />
      <FullscreenButton
        isRoomMinimized={isRoomMinimized}
        handleResize={() => setIsRoomMinimized(!isRoomMinimized)}
      />
    </Box>
  );
};
export default Room;

const FullscreenButton: React.FC<{
  isRoomMinimized: boolean;
  handleResize: () => void;
}> = ({ isRoomMinimized, handleResize }) => {
  return (
    <IconButton
      title="Toggle fullscreen"
      onClick={handleResize}
      sx={{ position: "absolute", bottom: "4px", right: "4px" }}
    >
      {isRoomMinimized ? <OpenInFull /> : <CloseFullscreen />}
    </IconButton>
  );
};

const VideosContainerComponent: React.FC<{
  localStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  screenSharingStream: MediaStream | null;
}> = ({ localStream, remoteStreams, screenSharingStream }) => {
  return (
    <Box
      sx={{
        height: "calc(100% - 48px)",
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Video stream={screenSharingStream ?? localStream} isLocalStream />
      {remoteStreams.map((stream) => (
        <Video key={stream.id} stream={stream} isLocalStream={false} />
      ))}
    </Box>
  );
};

const mapRoomStoreStateToProps = (state: RootState) => {
  return {
    ...state.room,
  };
};

const VideosContainer = connect(mapRoomStoreStateToProps)(
  VideosContainerComponent
);

const RoomButtonsComponent: React.FC<{
  localStream: MediaStream | null;
  screenSharingStream: MediaStream | null;
  isScreenSharingActive: boolean;
  setScreenSharingStream: (stream: MediaStream | null) => void;
  didUserJoinWithAudioOnly: boolean;
}> = ({
  localStream,
  screenSharingStream,
  isScreenSharingActive,
  setScreenSharingStream,
  didUserJoinWithAudioOnly,
}) => {
  return (
    <Box
      sx={{
        height: "48px",
        width: "100%",
        backgroundColor: teal[500],
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!didUserJoinWithAudioOnly && <VideoButton localStream={localStream} />}
      <MicButton localStream={localStream} />
      {!didUserJoinWithAudioOnly && (
        <ScreenShareButton
          localStream={localStream}
          screenSharingStream={screenSharingStream}
          isScreenSharingActive={isScreenSharingActive}
          setScreenSharingStream={setScreenSharingStream}
        />
      )}
      <CloseRoomButton />
    </Box>
  );
};

const mapRoomActionsToProps = (dispatch: AppDispatch) => {
  return {
    ...getActions(dispatch),
  };
};

const RoomButtons = connect(
  mapRoomStoreStateToProps,
  mapRoomActionsToProps
)(RoomButtonsComponent);

const VideoButton: React.FC<{
  localStream: MediaStream | null;
}> = ({ localStream }) => {
  const [videoEnabled, setVideoEnabled] = useState(true);

  const handleToggle = () => {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = !videoEnabled;
    }
    setVideoEnabled(!videoEnabled);
  };

  return (
    <IconButton title="Toggle video camera" onClick={handleToggle}>
      {videoEnabled ? <Videocam /> : <VideocamOff />}
    </IconButton>
  );
};

const MicButton: React.FC<{
  localStream: MediaStream | null;
}> = ({ localStream }) => {
  const [micEnabled, setMicEnabled] = useState(true);

  const handleToggle = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = !micEnabled;
    }
    setMicEnabled(!micEnabled);
  };

  return (
    <IconButton title="Toggle microphone" onClick={handleToggle}>
      {micEnabled ? <Mic /> : <MicOff />}
    </IconButton>
  );
};

const CloseRoomButton = () => {
  return (
    <IconButton
      title="Close room"
      onClick={leaveRoom}
      sx={{ marginLeft: "32px" }}
    >
      <Close />
    </IconButton>
  );
};

const ScreenShareButton: React.FC<{
  localStream: MediaStream | null;
  screenSharingStream: MediaStream | null;
  isScreenSharingActive: boolean;
  setScreenSharingStream: (stream: MediaStream | null) => void;
}> = ({
  localStream,
  screenSharingStream,
  isScreenSharingActive,
  setScreenSharingStream,
}) => {
  const handleToggle = async () => {
    if (!isScreenSharingActive) {
      let stream;
      try {
        const constraints = {
          audio: false,
          video: true,
        };

        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } catch (err) {
        console.error("Could not access screen share stream:", err);
      }

      if (stream) {
        setScreenSharingStream(stream);
        switchOutgoingTracks(stream);
      }
    } else {
      switchOutgoingTracks(localStream!);
      const copy = screenSharingStream;
      setScreenSharingStream(null);
      copy?.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <IconButton title="Share screen" onClick={handleToggle}>
      {isScreenSharingActive ? <StopScreenShare /> : <ScreenShare />}
    </IconButton>
  );
};
