import { v2 as cloudinary } from "cloudinary";

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
};

export const uploadToCloudinary = async (path) => {
  return await cloudinary.uploader.upload(path, {
    resource_type: "auto",
    folder: "spotify_clone/songs",
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (publicId === "null") return;
  return await cloudinary.uploader.destroy(publicId);
};
