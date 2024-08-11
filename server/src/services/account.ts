import bcrypt from "bcryptjs";

import { prisma } from "../server.js";

async function createAccount(name: string, email: string, password: string) {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    },
  });

  return user;
}

async function accountExists(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return !!user;
}

export function comparePassword(password: string, userPassword: string) {
  return bcrypt.compareSync(password, userPassword);
}

export { createAccount, accountExists };
