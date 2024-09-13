import express, { response } from "express";
import fs from "fs";
import path from "path";

import { prisma } from "../server";
import { accountExists, comparePassword, createAccount } from "./account";

const AVATARS_BASE_URL = "http://localhost:3000/avatars";
const REPORTS_BASE_URL = "http://localhost:3000/reports";

async function getUsers(request: express.Request, response: express.Response) {
  const { sub } = request;

  const user = await prisma.user.findUnique({
    where: {
      id: sub,
    },
  });

  if (!user) {
    return response.status(400).json({
      message: "Invalid credentials.",
    });
  }

  const isMedic = user.type === "medic";
  const isAdmin = user.type === "admin";
  const filterOption = isMedic
    ? ["patient"]
    : isAdmin
      ? ["patient", "medic"]
      : [];

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
    },
    where: {
      type: {
        in: filterOption,
      },
    },
    orderBy: {
      activities: {
        _count: "desc",
      },
    },
  });

  users.reduce((current, user) => {
    user.avatarUrl = fixUrl(user.avatarUrl, "avatar");

    if (user.report)
      user.report.reportUrl = fixUrl(user.report.reportUrl, "report");

    return current;
  }, []);

  return response.json(users);
}

async function getUserById(
  request: express.Request,
  response: express.Response,
) {
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
        include: {
          author: true,
        },
      },
    },
  });

  if (user) {
    user.activities.reduce((_: any, activity) => {
      activity.author.avatarUrl = fixUrl(activity.author.avatarUrl, "avatar");
    }, []);

    user.avatarUrl = fixUrl(user.avatarUrl, "avatar");

    if (user.report)
      user.report.reportUrl = fixUrl(user.report.reportUrl, "report");
  }

  return response.json({ found: !!user, ...user });
}

async function getUserByToken(
  request: express.Request,
  response: express.Response,
) {
  const { sub } = request;

  const user = await prisma.user.findUnique({
    where: {
      id: sub,
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
        include: {
          author: true,
        },
      },
    },
  });

  if (!user) {
    return response.status(404).send();
  }

  user.activities?.reduce((_: any, activity) => {
    activity.author.avatarUrl = fixUrl(activity.author.avatarUrl, "avatar");
  }, []);

  user.avatarUrl = fixUrl(user.avatarUrl, "avatar");

  if (user.report)
    user.report.reportUrl = fixUrl(user.report.reportUrl, "report");

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
        },
      },
    },
  });

  if (!user) {
    return response.status(200).json({
      message: "Account not exists / Invalid password.",
    });
  }

  user.activities.reduce((_: any, activity) => {
    activity.author.avatarUrl = fixUrl(activity.author.avatarUrl, "avatar");
  }, []);

  if (user.report)
    user.report.reportUrl = fixUrl(user.report.reportUrl, "report");

  const passwordIsValid = comparePassword(password, user.password);

  if (!passwordIsValid) {
    return response.status(404).json({
      message: "Account not exists / Invalid password.",
    });
  }

  const token =
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      token,
    },
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
    return response.status(400).json({
      message: "Account already exists.",
    });
  }

  await createAccount(name, email, password);

  return response.status(201).json({
    message: "Account created.",
  });
}

async function changeAvatar(
  request: express.Request,
  response: express.Response,
) {
  const { sub } = request;

  const user = await prisma.user.findUnique({
    where: {
      id: sub,
    },
    select: {
      avatarUrl: true,
    },
  });

  if (!user) {
    return response.status(404).json({
      message: "Account not exists.",
    });
  }

  const oldAvatar = user.avatarUrl;

  try {
    await prisma.user.update({
      where: {
        id: sub,
      },
      data: {
        avatarUrl: request.file?.filename,
      },
    });

    if (oldAvatar)
      fs.unlinkSync(
        path.resolve(__dirname, "..", "..", "database", "images", oldAvatar),
      );
  } catch (error) {
    return response.status(400).json({
      message: "Error while tried to change avatar!",
    });
  }

  return response.status(200).json({
    message: "Avatar changed.",
    avatarUrl: `${AVATARS_BASE_URL}/${request.file?.filename}`,
  });
}

async function changeType(
  request: express.Request,
  response: express.Response,
) {
  const { sub } = request;
  const { patientEmail, newType } = request.body;

  if (newType !== "patient" && newType !== "medic") {
    return response.status(400).json({
      message: "Invalid type.",
    });
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: sub,
    },
  });

  if (!admin || admin?.type !== "admin") {
    return response.status(401).send();
  }

  const patient = await prisma.user.findUnique({
    where: {
      email: patientEmail,
    },
  });

  if (!patient) {
    return response.status(404).json({
      message: "Patient not exists.",
    });
  }

  if (patient.type === newType) {
    return response.status(200).json({
      message: "Type changed.",
    });
  }

  await prisma.user.update({
    where: {
      email: patientEmail,
    },
    data: {
      type: newType,
    },
  });

  response.status(200).json({
    message: "Type changed.",
  });
}

function fixUrl(
  url: string | null | undefined,
  type: "report" | "avatar",
): string | null {
  if (url && !url.includes("http://") && !url.includes("https://")) {
    switch (type) {
      case "report":
        return `${REPORTS_BASE_URL}/${url}`;
      case "avatar":
        return `${AVATARS_BASE_URL}/${url}`;
    }
  }

  return url || null;
}

export {
  getUsers,
  getUserById,
  getUserByToken,
  login,
  register,
  changeAvatar,
  changeType,
};
