import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import AppBar from "../components/AppBar";
import FriendsSidebar from "../components/FriendsSidebar";
import Messenger from "../components/Messenger";
import Room from "../components/Room";
import Sidebar from "../components/Sidebar";
import { connectToSocketServer } from "../realtime/socketConnection";
import { getActions } from "../store/actions/authActions";
import { AppDispatch, RootState } from "../store/store";
import { UserDetails } from "../types/types";
import { logout } from "../utils/auth";

const Dashboard: React.FC<{
  setUserDetails: (userDetails: UserDetails) => void;
  isUserInRoom: boolean;
}> = ({ setUserDetails, isUserInRoom }) => {
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;

    const userString = localStorage.getItem("user");

    if (!userString) {
      logout();
      return;
    }

    const userDetails = JSON.parse(userString) as UserDetails;
    setUserDetails(userDetails);
    connectToSocketServer(userDetails);

    return () => {
      effectRan.current = true;
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <FriendsSidebar />
      <Box
        sx={{
          flexGrow: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar />
        <Messenger />
      </Box>
      {isUserInRoom && <Room />}
    </Box>
  );
};

const mapActionsToProps = (dispatch: AppDispatch) => {
  return {
    ...getActions(dispatch),
  };
};

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state.room,
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(Dashboard);
