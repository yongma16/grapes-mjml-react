import Tiktok from "./tiktok";
import Youtube from "./youtube";
const VideoCover = () => {
  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <Youtube />
      <Tiktok />
    </div>
  );
};

export default VideoCover;
