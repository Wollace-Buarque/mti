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
      type: true,
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
      type: true,
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
      type: true,
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
      type: true,
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
    type: user.type,
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

async function changeType(request: express.Request, response: express.Response) {
  const { patientEmail, adminEmail, type } = request.body;

  if (type !== "patient" && type !== "medic") {
    return response.status(200).json({
      message: "Invalid type."
    });
  }

  const admin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!admin) {
    return response.status(200).json({
      message: "Admin not exists."
    });
  }

  if (admin.type !== "admin") {
    return response.status(200).json({
      message: "User is not an admin."
    });
  }

  const patient = await prisma.user.findUnique({
    where: {
      email: patientEmail,
    },
  });

  if (!patient) {
    return response.status(200).json({
      message: "Patient not exists."
    });
  }

  if (patient.type === type) {
    return response.status(200).json({
      message: "Patient already has this type."
    });
  }

  await prisma.user.update({
    where: {
      email: patientEmail,
    },
    data: {
      type,
    }
  });

  response.status(202).json({
    message: "Type changed.",
  });
}

function fixUrl(avatarUrl: string | null, type: "report" | "avatar") {
  if (avatarUrl && !avatarUrl.includes("http://") && !avatarUrl.includes("https://")) {

    switch (type) {
      case "report":
        return `${REPORTS_BASE_URL}/${avatarUrl}`;
      case "avatar":
        return `${AVATARS_BASE_URL}/${avatarUrl}`;
    }
  }

  return avatarUrl;
}

export {
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByToken,
  login,
  register,
  changeAvatar,
  changeType
}