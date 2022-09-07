import { Chat, VideoCall, Videocam } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import { connect } from "react-redux";
import { createNewRoom, joinRoom } from "../realtime/roomHandler";
import { RootState } from "../store/store";
import { RoomDetailsWithCreatorUsername } from "../types/types";
import Avatar from "./Avatar";

const Sidebar: React.FC<{
  activeRooms: RoomDetailsWithCreatorUsername[];
  isUserInRoom: boolean;
}> = ({ activeRooms, isUserInRoom }) => {
  return (
    <Box
      sx={{
        width: "64px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: grey[900],
        zIndex: 3,
        boxShadow: "0 0 8px 0 rgba(0,0,0,0.5)",
      }}
    >
      <ChatButton />
      <CreateRoomButton isUserInRoom={isUserInRoom} />
      <Box sx={{ backgroundColor: grey[700], width: "100%", height: "1px" }} />
      {activeRooms?.map((room) => (
        <ActiveRoomButton
          key={room.roomId}
          room={room}
          isUserInRoom={isUserInRoom}
        />
      ))}
    </Box>
  );
};

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state.room,
  };
};

export default connect(mapStoreStateToProps)(Sidebar);

const ChatButton = () => {
  return (
    <Tooltip title="Chat" placement="right">
      <Button
        sx={{
          height: "64px",
          color: "white",
          borderRadius: 0,
        }}
      >
        <Chat sx={{ fontSize: "32px" }} />
      </Button>
    </Tooltip>
  );
};

const CreateRoomButton: React.FC<{ isUserInRoom: boolean }> = ({
  isUserInRoom,
}) => {
  return (
    <Tooltip title="Start a video meeting" placement="right">
      <Button
        sx={{
          height: "64px",
          color: "white",
          borderRadius: 0,
        }}
        onClick={() => {
          createNewRoom();
        }}
        disabled={isUserInRoom}
      >
        <VideoCall sx={{ fontSize: "40px" }} />
      </Button>
    </Tooltip>
  );
};

const ActiveRoomButton: React.FC<{
  room: RoomDetailsWithCreatorUsername;
  isUserInRoom: boolean;
}> = ({ room, isUserInRoom }) => {
  const numParticipants = room.participants.length;
  const disabled = numParticipants >= 4;

  const handleJoinRoom = () => {
    if (!disabled) {
      joinRoom(room.roomId);
    }
  };

  const tooltipMessage = disabled
    ? `${room.creatorUsername}'s video meeting (FULL)`
    : `Join ${room.creatorUsername}'s video meeting (${numParticipants} connected)`;

  return (
    <Tooltip title={tooltipMessage} placement="right">
      <div>
        <Button
          disabled={disabled || isUserInRoom}
          onClick={handleJoinRoom}
          sx={{
            height: "64px",
            color: "white",
            borderRadius: 0,
            textTransform: "none",
            position: "relative",
          }}
        >
          <Avatar username={room.creatorUsername} />
          <Videocam
            sx={{
              position: "absolute",
              right: "6px",
              bottom: "8px",
              fontSize: "20px",
            }}
          />
        </Button>
      </div>
    </Tooltip>
  );
};
