import express from "express";

import { prisma } from "../server";

const REPORTS_BASE_URL = "http://localhost:3000/reports";

async function changeReport(request: express.Request, response: express.Response) {
  const { email } = request.body;

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      report: {
        upsert: {
          create: {
            reportUrl: request.file?.filename ?? "",
          },
          update: {
            reportUrl: request.file?.filename ?? "",
            updatedAt: new Date(),
          }
        }
      },
    }
  });

  const report = await prisma.report.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!user) {
    return response.status(200).json({
      message: "Account not exists."
    });
  }

  if (!report) {
    return response.status(200).json({
      message: "Could not change report."
    });
  }

  report.reportUrl = `${REPORTS_BASE_URL}/${report?.reportUrl}`;

  response.status(202).json({
    message: "Report changed.",
    report
  });
}

export {
  changeReport
}