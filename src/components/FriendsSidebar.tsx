import {
  Check,
  Clear,
  FiberManualRecord,
  PersonAdd,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { blueGrey, green, grey, red } from "@mui/material/colors";
import { Box } from "@mui/system";
import { useState } from "react";
import { connect } from "react-redux";
import * as chatActions from "../store/actions/chatActions";
import * as friendsActions from "../store/actions/friendsActions";
import { AppDispatch, RootState } from "../store/store";
import {
  SelectedChatDetailsData,
  FriendData,
  FriendDataWithOnline,
  InvitationData,
  InvitePostData,
  OnlineUserData,
} from "../types/types";
import Avatar from "./Avatar";

const FriendsSidebar = () => {
  return (
    <Box
      sx={{
        minWidth: "260px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: blueGrey[900],
        boxShadow: "0 0 8px 0 rgba(0,0,0,0.5)",
        zIndex: 2,
      }}
    >
      <FriendsTitle title="Direct Messages" />
      <FriendsList />
      <FriendsTitle title="Friend Invitations" />
      <PendingInvitationsList />
      <AddFriendButton />
    </Box>
  );
};
export default FriendsSidebar;

// access to friends reducer
const mapFriendsActionsToProps = (dispatch: AppDispatch) => {
  return {
    ...friendsActions.getActions(dispatch),
  };
};
const mapFriendsStoreStateToProps = (state: RootState) => {
  return {
    ...state.friends,
  };
};

// access to chat reducer
const mapChatActionsToProps = (dispatch: AppDispatch) => {
  return {
    ...chatActions.getActions(dispatch),
  };
};

const AddFriendButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        sx={{
          marginBottom: "16px",
          width: "90%",
        }}
        size="small"
        onClick={() => {
          setIsDialogOpen(true);
        }}
      >
        <PersonAdd sx={{ marginRight: 1 }} />
        Add Friend
      </Button>
      <AddFriendDialog
        isDialogOpen={isDialogOpen}
        handleCloseDialog={() => setIsDialogOpen(false)}
      />
    </>
  );
};

const FriendsTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Typography
      sx={{
        textTransform: "uppercase",
        fontSize: "14px",
        marginTop: "16px",
        marginBottom: "4px",
        color: grey[500],
      }}
    >
      {title}
    </Typography>
  );
};

const checkOnlineUsers = (
  friends: FriendData[] = [],
  onlineUsers: OnlineUserData[] = []
) => {
  const friendsWithOnline: FriendDataWithOnline[] = [];

  friends.forEach((friend) => {
    const isUserOnline = onlineUsers.find(
      (onlineUser) => onlineUser.userId === friend.id
    );

    friendsWithOnline.push({
      ...friend,
      isOnline: isUserOnline !== undefined,
    });
  });

  return friendsWithOnline;
};

const FriendsListComponent: React.FC<{
  friends?: FriendData[];
  onlineUsers?: OnlineUserData[];
}> = ({ friends, onlineUsers }) => {
  return (
    <Box sx={{ width: "100%", flexGrow: 1 }}>
      {checkOnlineUsers(friends, onlineUsers).map((friend) => (
        <FriendsListItem key={friend.id} friend={friend}></FriendsListItem>
      ))}
    </Box>
  );
};

const FriendsList = connect(mapFriendsStoreStateToProps)(FriendsListComponent);

const FriendsListItemComponent: React.FC<{
  friend: FriendDataWithOnline;
  setSelectedChatDetails?: (
    details: SelectedChatDetailsData,
    chatType: chatActions.ChatType
  ) => void;
}> = ({ friend, setSelectedChatDetails }) => {
  return (
    <Button
      onClick={() => {
        setSelectedChatDetails!(
          { id: friend.id, name: friend.username },
          chatActions.ChatType.DIRECT
        );
      }}
      sx={{
        width: "100%",
        height: "42px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        textTransform: "none",
        color: "white",
        position: "relative",
        borderRadius: 0,
        paddingY: "24px",
      }}
    >
      <Box sx={{ marginLeft: "8px" }}>
        <Avatar username={friend.username} />
      </Box>
      <Typography sx={{ marginLeft: "8px" }}>{friend.username}</Typography>

      <Box
        sx={{
          color: friend.isOnline ? green[500] : red[600],
          display: "flex",
          alignItems: "center",
          position: "absolute",
          right: "12px",
        }}
      >
        <Tooltip
          title={friend.isOnline ? "online" : "offline"}
          placement="right"
        >
          <FiberManualRecord sx={{ fontSize: "16px" }} />
        </Tooltip>
      </Box>
    </Button>
  );
};

const FriendsListItem = connect(
  null,
  mapChatActionsToProps
)(FriendsListItemComponent);

const PendingInvitationsListComponent: React.FC<{
  pendingFriendsInvitations?: InvitationData[];
  acceptFriendInvitation?: (invitationId: string) => void;
  rejectFriendInvitation?: (invitationId: string) => void;
}> = ({
  pendingFriendsInvitations,
  acceptFriendInvitation,
  rejectFriendInvitation,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "256px",
      }}
    >
      {pendingFriendsInvitations?.map((invitation) => (
        <PendingInvitationsListItem
          key={invitation._id}
          id={invitation._id}
          email={invitation.senderId.email}
          username={invitation.senderId.username}
          handleAcceptInvitation={() => acceptFriendInvitation!(invitation._id)}
          handleRejectInvitation={() => rejectFriendInvitation!(invitation._id)}
        />
      ))}
    </Box>
  );
};

const PendingInvitationsList = connect(
  mapFriendsStoreStateToProps,
  mapFriendsActionsToProps
)(PendingInvitationsListComponent);

const PendingInvitationsListItem: React.FC<{
  id: string;
  username: string;
  email: string;
  handleAcceptInvitation: () => void;
  handleRejectInvitation: () => void;
}> = ({
  id,
  username,
  email,
  handleAcceptInvitation,
  handleRejectInvitation,
}) => {
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  return (
    <Tooltip title={email} placement="right">
      <Box
        sx={{
          height: "36px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          textTransform: "none",
          color: "white",
          position: "relative",
          borderRadius: 0,
          marginLeft: "16px",
          marginRight: "8px",
          marginY: "6px",
        }}
      >
        <Avatar username={username} />
        <Typography
          variant="subtitle1"
          sx={{
            marginLeft: "8px",
            flexGrow: 1,
            maxWidth: "120px",
            overflow: "hidden",
          }}
        >
          {username}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Accept">
            <IconButton
              sx={{ color: grey[400], height: "36px", width: "36px" }}
              disabled={buttonsDisabled}
              onClick={() => {
                handleAcceptInvitation();
                setButtonsDisabled(true);
              }}
            >
              <Check />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton
              sx={{ color: grey[400], height: "36px", width: "36px" }}
              disabled={buttonsDisabled}
              onClick={() => {
                handleRejectInvitation();
                setButtonsDisabled(true);
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Tooltip>
  );
};

const AddFriendDialogComponent: React.FC<{
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  sendFriendInvitation: (
    data: InvitePostData,
    closeDialogHandler: () => void
  ) => Promise<void>;
}> = ({ isDialogOpen, handleCloseDialog, sendFriendInvitation }) => {
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setEmail("");
    handleCloseDialog();
  };

  const handleSubmit = async () => {
    sendFriendInvitation({ targetEmail: email }, handleClose);
  };

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setEmail("");
          handleCloseDialog();
        }}
      >
        <DialogTitle variant="h6">Invite a Friend</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Friend's email address"
            sx={{
              width: "400px",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ margin: "16px" }} onClick={handleSubmit}>
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const AddFriendDialog = connect(
  null,
  mapFriendsActionsToProps
)(AddFriendDialogComponent);
