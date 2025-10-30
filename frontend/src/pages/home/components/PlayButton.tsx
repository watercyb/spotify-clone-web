import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import type { Song } from "@/types/Song";
import { Pause, Play } from "lucide-react";

const PlayButton = ({ song }: { song: Song }) => {
  const { isPlaying, currentSong, updatePlayList, togglePlay } =
    usePlayerStore();

  const handlePlay = () => {
    if (song._id === currentSong?._id) {
      togglePlay();
    } else {
      updatePlayList([song], 0);
    }
  };

  return (
    <Button
      size={"icon"}
      onClick={handlePlay}
      className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
          song._id === currentSong?._id
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
    >
      {song._id === currentSong?._id && isPlaying ? (
        <Pause className="size-5 text-black" />
      ) : (
        <Play className="size-5 text-black" />
      )}
    </Button>
  );
};

export default PlayButton;
