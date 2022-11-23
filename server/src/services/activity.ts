import express from "express";

import { prisma } from "../server.js";

async function createActivity(request: express.Request, response: express.Response) {
  const { name, duration, description, authorEmail, patientEmail } = request.body;

  if (!name || !authorEmail || !duration || !description || !patientEmail) {
    response.status(400).send("Missing parameters");
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: patientEmail,
    }
  });

  if (!user) {
    response.status(401).send("Invalid patient email");
    return;
  }

  const author = await prisma.user.findUnique({
    where: {
      email: authorEmail,
    }
  });

  if (!author) {
    response.status(401).send("Invalid author email");
    return;
  }

  if (!author.medic) {
    response.status(401).send("Author is not a medic");
    return;
  }

  const activity = await prisma.activity.create({
    data: {
      name,
      description,
      duration,
      user: {
        connect: {
          email: user.email,
        }
      },
      author: {
        connect: {
          email: author.email,
        }
      }
    }
  });

  return response.status(200).send({
    message: "Activity created",
    activityId: activity.id,
  });
}

async function deleteActivity(request: express.Request, response: express.Response) {
  const { id } = request.params;

  const activity = await prisma.activity.findUnique({
    where: {
      id: parseInt(id),
    }
  });

  if (!activity) {
    return response.status(200).send("Activity not found");
  }

  await prisma.activity.delete({
    where: {
      id: activity.id,
    },
  });

  return response.status(202).send("Activity deleted");
}

export {
  createActivity,
  deleteActivity
}