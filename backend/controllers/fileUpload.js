import fs from "fs";
import { promisify } from "util";
import fileModel from "../Models/Files.js";

const readFileAsync = promisify(fs.readFile);

/**
 * Saves a new file in the database with the given user ID, file name, type, and content.
 * The function encodes the GeoJSON content into a base64 string and stores it in the database.
 * It returns the saved file document upon successful storage.
 */
const fileSave = async (userId, originalname, fileType, fileContent) => {
  const base64Encoded = Buffer.from(
    JSON.stringify(fileContent.geojson)
  ).toString("base64");

  const newFile = new fileModel({
    // Creating a new file document to store in the database

    name: originalname,
    type: fileType,
    content: base64Encoded,
    user: userId,
  });
  const savedFile = await newFile.save(); // Saving the file document to the database

  console.log(
    // Logging the saved GeoJSON content (decoded from base64)

    "Saved GeoJSON:",
    JSON.parse(Buffer.from(savedFile.content, "base64").toString())
  );
  return savedFile;
};

/**
 * Creates and saves a new file based on the provided request data.
 *
 * The function extracts user ID, file name, and content from the request,
 * saves the file as a GeoJSON in the database, and returns the saved file
 * information in the response.
 *
 * If the file is created successfully, returns a 200 status with the
 * file details. If an error occurs, returns a 500 status with an error
 * message.
 */
const fileCreate = async (req, res) => {
  try {
    const newFile = await fileSave(
      req.user._id,
      req.body.name,
      "geojson",
      req.body.content
    );
    res.status(200).json(newFile);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the file." });
  }
};

/**
 * Handles file uploads, specifically GeoJSON, KML, and Tiff files.
 *
 * If the file type is not supported, returns a 400 error.
 *
 * If the file is uploaded and stored successfully, returns a 200 status with a success message.
 *
 * If an error occurs while processing the file, returns a 500 error with an error message.
 */
const uploadHandler = async (req, res) => {
  try {
    const { originalname, path: filePath } = req.file;
    const fileType = originalname.split(".").pop();

    if (!["geojson", "kml", "tiff"].includes(fileType)) {
      // Checking if the file type is supported
      return res.status(400).json({ error: "File type not supported" });
    }

    const fileContent = await readFileAsync(filePath);
    await fileSave(req.user._id, originalname, fileType, fileContent);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    res.status(200).json({ message: "File uploaded and stored successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the file." });
  }
};

/**
 * Returns a list of files uploaded by the user, including their names and types.
 *
 * Example response:
 * [
 *  { name: "example.geojson", type: "geojson" },
 *  { name: "example.kml", type: "kml" },
 *  { name: "example.tiff", type: "tiff" },
 * ]
 *
 * If an error occurs while retrieving the list of files, returns a 500 error with an error message.
 */
const getUploads = async (req, res) => {
  // Returns a list of files uploaded by the user
  try {
    const files = await fileModel
      .find({ user: req.user._id })
      .select("name type");
    res.status(200).json(files);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the file." });
  }
};
const getContent = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const file = await fileModel.findOne({ _id: fileId }); // Finding the file by its ID in the database
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    const base64Decoded = Buffer.from(file.content, "base64"); // Decoding the file content from base64
    res.setHeader("Content-Type", `${file.type}`);
    res.send(base64Decoded);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the file." });
  }
};

export { uploadHandler, getContent, getUploads, fileCreate };
