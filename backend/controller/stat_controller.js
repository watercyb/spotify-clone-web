import { User } from "../models/user_model.js";
import { Song } from "../models/song_model.js";
import { Album } from "../models/album_model.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalSongs, totalUsers, totalAlbums, uniqueArtists] =
      await Promise.all([
        Song.countDocuments(),
        await User.countDocuments(),
        await Album.countDocuments(),
        Song.aggregate([
          {
            $unionWith: { coll: "albums", pipeline: [] },
          },
          {
            $group: { _id: "$artist" },
          },
          {
            $count: "count",
          },
        ]),
      ]);

    res.status(200).json({
      totalSongs,
      totalUsers,
      totalAlbums,
      totalArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    next("Error in stat_controller getStats: " + error);
  }
};
