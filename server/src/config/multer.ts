import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";

const AVATARS_URL = path.resolve(__dirname, "..", "..", "database", "images");
const REPORTS_URL = path.resolve(__dirname, "..", "..", "database", "reports");
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default {
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  destination: AVATARS_URL,
  reports: REPORTS_URL,
  storage: multer.diskStorage({
    destination: (request, _, callback) => {
      switch (request.body.type) {
        case "avatar":
          callback(null, AVATARS_URL);
          break;
        case "report":
          callback(null, REPORTS_URL);
          break;
        default:
          console.warn("Invalid request type.");
          break;
      }
    },
    filename: (request, file, callback) => {
      const hash = crypto.randomBytes(16).toString("hex");
      const fileName = `${hash}-${file.originalname}`;

      callback(null, fileName);

      request.on("aborted", () => {
        fs.unlinkSync(
          path.resolve(__dirname, "..", "..", "database", "images", fileName),
        );
      });
    },
  }),
  fileFilter: (_: any, file: any, callback: any) => {
    const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type."));
    }
  },
};
