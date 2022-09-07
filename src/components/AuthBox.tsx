import { Box } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { ReactNode } from "react";

const AuthBox: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box width="100vw" display="flex" justifyContent="center">
      <Box
        width="400px"
        bgcolor={blueGrey[900]}
        display="flex"
        flexDirection="column"
        mt="64px"
        pt="40px"
        pb="24px"
        px="24px"
        boxShadow="0 2px 10px 0 rgb(0 0 0 / 50%)"
        borderRadius="4px"
      >
        <img
          src="/parrot_logo.png"
          alt="parrot logo"
          style={{
            width: "40%",
            margin: "auto",
            marginBottom: "16px",
            objectFit: "contain",
          }}
        />
        {children}
      </Box>
    </Box>
  );
};
export default AuthBox;
