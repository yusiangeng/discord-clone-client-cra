import { TextField, Typography } from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getDirectChatHistory,
  sendDirectMessage,
} from "../realtime/socketConnection";
import { RootState } from "../store/store";
import Avatar from "./Avatar";
import { ChatMessageData, SelectedChatDetailsData } from "../types/types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.guess();
dayjs.tz.setDefault("Singapore");

const mapStoreStateToProps = (state: RootState) => {
  return { ...state.chat };
};

const MessengerComponent: React.FC<{
  selectedChatDetails: SelectedChatDetailsData | null;
}> = ({ selectedChatDetails }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        backgroundColor: blueGrey[800],
      }}
    >
      {!selectedChatDetails ? (
        <WelcomeMessage />
      ) : (
        <MessengerContent selectedChatDetails={selectedChatDetails} />
      )}
    </Box>
  );
};

const Messenger = connect(mapStoreStateToProps)(MessengerComponent);
export default Messenger;

const WelcomeMessage = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ color: grey[500] }}>
        Select a user to start chatting!
      </Typography>
    </Box>
  );
};

const MessengerContent: React.FC<{
  selectedChatDetails: SelectedChatDetailsData;
}> = ({ selectedChatDetails }) => {
  useEffect(() => {
    getDirectChatHistory({
      receiverUserId: selectedChatDetails.id,
    });
  }, [selectedChatDetails]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Messages />
      <NewMessageInput />
    </Box>
  );
};

const NewMessageInputComponent: React.FC<{
  selectedChatDetails: SelectedChatDetailsData | null;
}> = ({ selectedChatDetails }) => {
  const [message, setMessage] = useState("");

  if (!selectedChatDetails) {
    return null;
  }

  const handleSendMessage = () => {
    if (!message.length) return;

    sendDirectMessage({
      receiverUserId: selectedChatDetails.id,
      content: message,
    });

    setMessage("");
  };

  return (
    <Box
      sx={{
        height: "60px",
        widht: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextField
        size="small"
        sx={{ width: "100%", marginX: "16px" }}
        placeholder={`Write messsage to ${selectedChatDetails.name}...`}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
    </Box>
  );
};

const NewMessageInput = connect(mapStoreStateToProps)(NewMessageInputComponent);

const MessagesComponent: React.FC<{
  selectedChatDetails: SelectedChatDetailsData | null;
  messages: ChatMessageData[];
}> = ({ selectedChatDetails, messages }) => {
  if (!selectedChatDetails) {
    return null;
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 110px)",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MessagesHeader name={selectedChatDetails?.name} />
      {messages.map((message, idx) => {
        const sameAuthor =
          idx > 0 && message.authorId._id === messages[idx - 1].authorId._id;
        const sameDay =
          idx > 0 &&
          dayjs(message.date).isSame(dayjs(messages[idx - 1].date), "day");

        return (
          <Box key={message._id}>
            {(!sameDay || idx === 0) && (
              <DateSeparator
                date={dayjs(message.date).format("dddd, D MMM YYYY")}
              />
            )}
            <Message
              message={message}
              sameAuthor={sameAuthor}
              sameDay={sameDay}
            />
          </Box>
        );
      })}
    </Box>
  );
};

const Messages = connect(mapStoreStateToProps)(MessagesComponent);

const DateSeparator: React.FC<{ date: string }> = ({ date }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        marginTop: "16px",
        marginBottom: "8px",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: grey[500],
          height: "1px",
          marginLeft: "16px",
        }}
      />
      <Box
        sx={{
          backgroundColor: blueGrey[800],
          color: grey[500],
          marginX: "16px",
          fontSize: "14px",
        }}
      >
        {date}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: grey[500],
          height: "1px",
          marginRight: "16px",
        }}
      />
    </Box>
  );
};

const MessagesHeader: React.FC<{ name: string }> = ({ name }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "24px",
      }}
    >
      <Avatar large username={name} />
    </Box>
  );
};

const Message: React.FC<{
  message: ChatMessageData;
  sameAuthor: boolean;
  sameDay: boolean;
}> = ({ message, sameAuthor, sameDay }) => {
  if (sameAuthor && sameDay) {
    return (
      <Box
        sx={{
          color: grey[400],
          maxWidth: "calc(100vw - 400px)",
          wordWrap: "break-word",
          marginLeft: "64px",
          marginBottom: "12px",
          lineHeight: "100%",
        }}
      >
        {message.content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        marginX: "16px",
        marginBottom: "12px",
      }}
    >
      <Box sx={{ marginRight: "12px", marginTop: "4px" }}>
        <Avatar username={message.authorId.username} />
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {message.authorId.username}
          </Box>

          <Box style={{ fontSize: "14px", color: grey[500] }}>
            {dayjs(message.date).format("HH:mm")}
          </Box>
        </Box>

        <Box
          sx={{
            color: grey[400],
            maxWidth: "calc(100vw - 400px)",
            wordWrap: "break-word",
            lineHeight: "100%",
          }}
        >
          {message.content}
        </Box>
      </Box>
    </Box>
  );
};
