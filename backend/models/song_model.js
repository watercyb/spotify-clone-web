import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imageId: { type: String, required: true },
    audioUrl: { type: String, required: true },
    audioId: { type: String, required: true },
    duration: { type: Number, required: true },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
  },
  { timestamps: true }
);
export const Song = mongoose.model("Song", schema);
