import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import createError from "http-errors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      transformation: [
        { width: 200, height: 200, crop: "fill" }, // Crop the image to 200x200 pixels
      ],
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};
const destroyOnCloudinary = async (public_id) => {
  try {
    const response = await cloudinary.uploader.destroy(public_id);
    console.log("Old avatar deleted successfully:", response);
    return response; // This returns the success result.
  } catch (error) {
    console.error("Error deleting old avatar:", error);
    throw createError.BadRequest("Error deleting old image.");
  }
};

export { uploadOnCloudinary, destroyOnCloudinary };
