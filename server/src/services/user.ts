import express from "express";

import { prisma } from "../server";
import { accountExists, comparePassword, createAccount } from "./account";

const AVATARS_BASE_URL = "http://localhost:3000/avatars";
const REPORTS_BASE_URL = "http://localhost:3000/reports";

async function getUsers(response: express.Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      medic: true,
      report: true,
      avatarUrl: true,
      createdAt: true,
      activities: true,
    }
  });

  users.reduce((current, user) => {
    user.avatarUrl = fixUrl(user.avatarUrl, "avatar");

    if (user.report) user.report.reportUrl = fixUrl(user.report.reportUrl, "report");

    return current;
  }, []);


  return response.json(users);
}

async function getUserByEmail(request: express.Request, response: express.Response) {
  const { email } = request.params;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      report: true,
      avatarUrl: true,
      createdAt: true,
    }
  });

  if (user) {
    user.avatarUrl = fixUrl(user.avatarUrl, "avatar");

    if (user.report) user.report.reportUrl = fixUrl(user.report.reportUrl, "report");
  }

  return response.json({ found: !!user, ...user });
}

async function getUserById(request: express.Request, response: express.Response) {
  const { id } = request.params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      report: true,
      avatarUrl: true,
      createdAt: true,
      activities: {
        select: {
          id: true,
          author: true,
          name: true,
          duration: true,
          createdAt: true,
          updatedAt: true,
          description: true,
        }
      },
    }
  });

  if (user) {
    user.activities.reduce((current: any, activity) => {

      activity.author.avatarUrl = fixUrl(activity.author.avatarUrl, "avatar");
    }, []);

    user.avatarUrl = fixUrl(user.avatarUrl, "avatar");

    if (user.report) user.report.reportUrl = fixUrl(user.report.reportUrl, "report");
  }

  return response.json({ found: !!user, ...user });
}

async function getUserByToken(request: express.Request, response: express.Response) {
  const { token } = request.params;

  const user = await prisma.user.findFirst({
    where: {
      token,
    },
    select: {
      id: true,
      name: true,
      email: true,
      token: true,
      medic: true,
      report: true,
      avatarUrl: true,
      createdAt: true,
      activities: {
        select: {
          id: true,
          author: true,
          name: true,
          duration: true,
          createdAt: true,
          updatedAt: true,
          description: true,
        }
      },
    }
  });

  if (!user) {
    return response.json({ found: false });
  }

  user.activities.reduce((current: any, activity) => {
    activity.author.avatarUrl = fixUrl(activity.author.avatarUrl, "avatar");
  }, []);

  user.avatarUrl = fixUrl(user.avatarUrl, "avatar");

  if (user.report) user.report.reportUrl = fixUrl(user.report.reportUrl, "report");

  return response.status(201).json({ found: !!user, ...user });
}

async function login(request: express.Request, response: express.Response) {
  const { email, password } = request.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      token: true,
      medic: true,
      report: true,
      password: true,
      avatarUrl: true,
      createdAt: true,
      activities: {
        select: {
          author: true,
          name: true,
          duration: true,
          createdAt: true,
          updatedAt: true,
          description: true,
        }
      },
    }
  });

  if (!user) {
    return response.status(200).json({
      message: "Account not exists / Invalid password."
    });
  }

  user.activities.reduce((current: any, activity) => {
    activity.author.avatarUrl = fixUrl(activity.author.avatarUrl, "avatar");
  }, []);

  if (user.report) user.report.reportUrl = fixUrl(user.report.reportUrl, "report");

  const passwordIsValid = comparePassword(password, user.password);

  if (!passwordIsValid) {
    return response.status(200).json({
      message: "Account not exists / Invalid password."
    });
  }

  const token = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      token,
    }
  });

  user.avatarUrl = fixUrl(user.avatarUrl, "avatar");

  return response.status(202).json({
    message: "Logged in.",
    id: user.id,
    name: user.name,
    email: user.email,
    token: token,
    medic: user.medic,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    activities: user.activities,
  });
}

async function register(request: express.Request, response: express.Response) {
  const { name, email, password } = request.body;
  const exists = await accountExists(email);

  if (exists) {
    return response.status(200).json({
      message: "Account already exists."
    });
  }

  await createAccount(name, email, password);

  return response.status(201).json({
    message: "Account created."
  });
}


async function changeAvatar(request: express.Request, response: express.Response) {
  const { email } = request.body;

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      avatarUrl: request.file?.filename,
    }
  });

  if (!user) {
    return response.status(200).json({
      message: "Account not exists."
    });
  }

  response.status(202).json({
    message: "Avatar changed.",
    avatarUrl: `${AVATARS_BASE_URL}/${user.avatarUrl}`
  });
}

function fixUrl(defaultAvatarUrl: string | null, type: "report" | "avatar") {
  if (defaultAvatarUrl && !defaultAvatarUrl.includes("http://") && !defaultAvatarUrl.includes("https://")) {
    return `${type === "report" ? REPORTS_BASE_URL : AVATARS_BASE_URL}/${defaultAvatarUrl}`;
  }

  return defaultAvatarUrl;
}

export {
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByToken,
  login,
  register,
  changeAvatar
}