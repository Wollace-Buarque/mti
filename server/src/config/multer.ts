import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";

const destination = path.resolve(__dirname, "..", "..", "database", "images");
const reports = path.resolve(__dirname, "..", "..", "database", "reports");

export default {
  destination,
  reports,
  storage: multer.diskStorage({
    destination: (request, file, callback) => {

      switch (request.body.type) {
        case "avatar":
          callback(null, destination);
          break;
        case "report":
          callback(null, reports);
          break;
        default:
          console.log("Invalid request type.");
          break;
      }
    },
    filename: (request, file, callback) => {
      const hash = crypto.randomBytes(16).toString("hex");
      const fileName = `${hash}-${file.originalname}`;

      callback(null, fileName);

      request.on("aborted", () => {

        fs.unlinkSync(path.resolve(__dirname, "..", "..", "database", "images", fileName));

      });
    }
  }),
  fileFilter: (request: any, file: any, callback: any) => {
    const allowedMimes = [
      // "image/gif",
      "image/jpeg",
      "image/pjpeg",
      "image/png"];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type."));
    }
  }
}