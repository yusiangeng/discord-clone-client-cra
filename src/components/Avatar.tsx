import { teal } from "@mui/material/colors";
import { Box } from "@mui/system";

const Avatar: React.FC<{ username: string; large?: boolean }> = ({
  username,
  large = false,
}) => {
  return (
    <Box
      sx={{
        height: large ? "80px" : "36px",
        width: large ? "80px" : "36px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: large ? "42px" : "18px",
        fontWeight: 700,
        color: "white",
        borderRadius: "50%",
        backgroundColor: teal[500],
      }}
    >
      {username.substring(0, 2)}
    </Box>
  );
};
export default Avatar;
