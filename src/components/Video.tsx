import { Box } from "@mui/system";
import { useEffect, useRef } from "react";

const Video: React.FC<{
  stream: MediaStream | null;
  isLocalStream: boolean;
}> = ({ stream, isLocalStream }) => {
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    const video = videoRef.current!;
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();
    };
  }, [stream]);

  return (
    <Box
      sx={{
        width: "50%",
        height: "50%",
        backgroundColor: "black",
      }}
    >
      <Box
        component="video"
        sx={{
          width: "100%",
          height: "100%",
        }}
        ref={videoRef}
        autoPlay
        muted={isLocalStream}
      />
    </Box>
  );
};
export default Video;
