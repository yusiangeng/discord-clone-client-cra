import { Button, InputLabel, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { connect } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import AuthBox from "../components/AuthBox";
import { getActions } from "../store/actions/authActions";
import { AppDispatch } from "../store/store";
import { LoginPostData } from "../types/types";

const Login: React.FC<{
  login: (data: LoginPostData, navigate: NavigateFunction) => Promise<void>;
}> = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  return (
    <AuthBox>
      <Typography variant="h5">Login</Typography>

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
          login({ email, password }, navigate);
        }}
      >
        Login
      </Button>
      <Button
        variant="outlined"
        sx={{ marginTop: "8px" }}
        onClick={() => navigate("/register")}
      >
        Create a new account
      </Button>
    </AuthBox>
  );
};

const mapActionsToProps = (dispatch: AppDispatch) => {
  return {
    ...getActions(dispatch),
  };
};

export default connect(null, mapActionsToProps)(Login);
