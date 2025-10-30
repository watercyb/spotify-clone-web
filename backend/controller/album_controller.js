import { Album } from "../models/album_model.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    next("Error in album_controller getAllAlbums: " + error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Please input album id." });
    const album = await Album.findById(id).populate("songs");
    if (!album) return res.status(404).json({ error: "Album not found." });
    res.status(200).json(album);
  } catch (error) {
    next("Error in album_controller getAlbumById: " + error);
  }
};
