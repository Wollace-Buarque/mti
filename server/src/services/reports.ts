import express from "express";

import { prisma } from "../server";
import fs from "fs";
import path from "path";

const REPORTS_BASE_URL = "http://localhost:3000/reports";

async function changeReport(
  request: express.Request,
  response: express.Response,
) {
  const bearer = request.headers.authorization;
  const token = bearer?.split(" ")[1];

  if (!token) {
    return response.status(400).json({
      message: "Invalid credentials.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
      report: true,
    },
  });

  if (!user) {
    return response.status(404).json({
      message: "Account not exists.",
    });
  }

  const oldReport = user.report?.reportUrl;
  const fileName = request.file?.filename;

  if (!fileName) {
    return response.status(400).json({
      message: "File sent not found.",
    });
  }

  try {
    await prisma.report.upsert({
      where: {
        userId: user.id,
      },
      update: {
        reportUrl: fileName,
      },
      create: {
        reportUrl: fileName,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    if (oldReport)
      fs.unlinkSync(
        path.resolve(__dirname, "..", "..", "database", "reports", oldReport),
      );
  } catch (error) {
    return response.status(400).json({
      message: "Error while tried to change report!",
    });
  }

  const report = await prisma.report.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!user) {
    return response.status(404).json({
      message: "Account not exists.",
    });
  }

  if (!report) {
    return response.status(400).json({
      message: "Could not change report.",
    });
  }

  report.reportUrl = `${REPORTS_BASE_URL}/${report?.reportUrl}`;

  response.status(200).json({
    message: "Report changed.",
    report,
  });
}

export { changeReport };
