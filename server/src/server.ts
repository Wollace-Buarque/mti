import cors from "cors";
import express from "express";
import multer from "multer";

import { PrismaClient } from "@prisma/client";

import multerConfig from "./config/multer";
import { createActivity, deleteActivity } from "./services/activity.js";
import { changeReport } from "./services/reports";
import {
    changeAvatar, getUserByEmail, getUserById, getUserByToken, getUsers, login, register
} from "./services/user";

const app = express();
export const prisma = new PrismaClient();

app.use(cors({ origin: "http://127.0.0.1:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/avatars", express.static(multerConfig.destination));
app.use("/reports", express.static(multerConfig.reports));

app.get("/users", (request: express.Request, response: express.Response) => getUsers(response));
app.get("/users/:email", (request: express.Request, response: express.Response) => getUserByEmail(request, response));
app.get("/token/:token", (request: express.Request, response: express.Response) => getUserByToken(request, response));
app.get("/id/:id", (request: express.Request, response: express.Response) => getUserById(request, response));

app.post("/login", (request: express.Request, response: express.Response) => login(request, response));
app.post("/register", (request: express.Request, response: express.Response) => register(request, response));
app.post("/activity", (request: express.Request, response: express.Response) => createActivity(request, response));

app.post("/avatar", multer(multerConfig).single("file"), (request: express.Request, response: express.Response) => changeAvatar(request, response));
app.post("/report", multer(multerConfig).single("file"), (request: express.Request, response: express.Response) => changeReport(request, response));

app.delete("/activity/:id", (request: express.Request, response: express.Response) => deleteActivity(request, response));

app.listen(3000, () => console.log("Servidor rodando na porta 3000!"));