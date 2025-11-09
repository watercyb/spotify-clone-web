import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import { Song } from "../models/song_model.js";
import { Album } from "../models/album_model.js";

export const createSong = async (req, res, next) => {
  try {
    if (!req.files.audioFile || !req.files.imageFile)
      return res.status(400).json({ error: "Please upload all files." });
    const { title, artist, duration, albumId } = req.body;
    if (!title || !artist || !duration)
      return res.status(400).json({ error: "Please fill all blocks." });
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;
    const audio = await uploadToCloudinary(audioFile.tempFilePath);
    const image = await uploadToCloudinary(imageFile.tempFilePath);

    const song = new Song({
      title,
      artist,
      imageUrl: image.secure_url,
      imageId: image.public_id,
      audioUrl: audio.secure_url,
      audioId: audio.public_id,
      duration,
      albumId: albumId || null,
    });
    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res.status(201).json(song);
  } catch (error) {
    next("Error in admin_controller createSong: " + error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Please input song id." });

    const song = await Song.findById(id);
    if (!song) return res.status(400).json({ error: "Song not found." });

    await Song.findByIdAndDelete(id);

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }
    deleteFromCloudinary(song.imageId);
    deleteFromCloudinary(song.audioId);

    res.status(200).json({ message: "Song deleted successfully." });
  } catch (error) {
    next("Error in admin_controller deleteSong: " + error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile)
      return res.status(400).json({ error: "Please upload image file." });
    const { title, artist, releaseYear, songs } = req.body;
    if (!title || !artist || !releaseYear)
      return res.status(400).json({ error: "Please fill all blocks." });
    const imageFile = req.files.imageFile;
    const image = await uploadToCloudinary(imageFile.tempFilePath);

    const album = new Album({
      title,
      artist,
      imageUrl: image.secure_url,
      imageId: image.public_id,
      releaseYear,
      songs: songs || [],
    });
    await album.save();

    res.status(201).json(album);
  } catch (error) {
    next("Error in admin_controller createAlbum: " + error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Please input album id." });

    const album = await Album.findById(id);
    if (!album) return res.status(400).json({ error: "Album not found." });

    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    deleteFromCloudinary(album.imageId);

    res.status(200).json({ message: "Album deleted successfully.", album });
  } catch (error) {
    next("Error in admin_controller deleteAlbum: " + error);
  }
};

export const checkAdmin = (req, res, next) => {
  res.status(200).json({ admin: true });
};
