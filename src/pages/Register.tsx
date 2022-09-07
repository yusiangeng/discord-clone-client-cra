import { Button, InputLabel, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { connect } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import AuthBox from "../components/AuthBox";
import { getActions } from "../store/actions/authActions";
import { AppDispatch } from "../store/store";
import { RegisterPostData } from "../types/types";

const Register: React.FC<{
  register: (
    data: RegisterPostData,
    navigate: NavigateFunction
  ) => Promise<void>;
}> = ({ register }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  return (
    <AuthBox>
      <Typography variant="h5">Register</Typography>

      <InputLabel
        sx={{ color: grey[500], marginTop: "12px", marginBottom: "4px" }}
      >
        Email
      </InputLabel>
      <TextField
        size="small"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputLabel
        sx={{ color: grey[500], marginTop: "12px", marginBottom: "4px" }}
      >
        Username
      </InputLabel>
      <TextField
        size="small"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <InputLabel
        sx={{ color: grey[500], marginTop: "12px", marginBottom: "4px" }}
      >
        Password
      </InputLabel>
      <TextField
        size="small"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ marginTop: "24px" }}
        onClick={() => {
          register(
            {
              email,
              username,
              password,
            },
            navigate
          );
        }}
      >
        Register
      </Button>
      <Button
        variant="outlined"
        sx={{ marginTop: "8px" }}
        onClick={() => navigate("/login")}
      >
        Login to existing account
      </Button>
    </AuthBox>
  );
};

const mapActionsToProps = (dispatch: AppDispatch) => {
  return {
    ...getActions(dispatch),
  };
};

export default connect(null, mapActionsToProps)(Register);
