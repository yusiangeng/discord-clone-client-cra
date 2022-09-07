import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { Box } from "@mui/system";
import React from "react";
import { connect } from "react-redux";
import { getActions } from "../store/actions/roomActions";
import { AppDispatch, RootState } from "../store/store";
import { SelectedChatDetailsData } from "../types/types";
import { logout } from "../utils/auth";

const AppBar = () => {
  return (
    <Box
      sx={{
        height: "50px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: blueGrey[800],
        boxShadow: "0 0 12px 0 rgba(0,0,0,0.6)",
        zIndex: 1,
      }}
    >
      <ChosenOptionLabel />
      <BasicMenu />
    </Box>
  );
};

export default AppBar;

const BasicMenuComponent: React.FC<{
  auth: RootState["auth"];
  room: RootState["room"];
  setAudioOnly?: (audioOnly: boolean) => void;
}> = ({ room, auth, setAudioOnly }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!auth.userDetails) return null;

  return (
    <Box>
      <Button
        size="small"
        onClick={(e) => handleClick(e)}
        sx={{ marginRight: "8px", textTransform: "none" }}
      >
        <Typography>
          Logged in as {auth.userDetails.username} ({auth.userDetails.email})
        </Typography>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
        <MenuItem onClick={() => setAudioOnly!(!room.audioOnly)}>
          {room.audioOnly ? "Only audio enabled" : "Video and audio enabled"}
        </MenuItem>
      </Menu>
    </Box>
  );
};

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

const mapRoomActionsToProps = (dispatch: AppDispatch) => {
  return {
    ...getActions(dispatch),
  };
};

const BasicMenu = connect(
  mapStoreStateToProps,
  mapRoomActionsToProps
)(BasicMenuComponent);

const ChosenOptionLabelComponent: React.FC<{
  selectedChatDetails: SelectedChatDetailsData | null;
}> = ({ selectedChatDetails }) => {
  return (
    <Typography
      sx={{ fontSize: "16px", fontWeight: "bold", marginLeft: "16px" }}
    >
      {selectedChatDetails?.name ?? ""}
    </Typography>
  );
};

const mapChatStoreStateToProps = (state: RootState) => {
  return {
    ...state.chat,
  };
};

const ChosenOptionLabel = connect(mapChatStoreStateToProps)(
  ChosenOptionLabelComponent
);
