// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { get } from "lodash-es";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserAuth } from "../../Auth/UserProvider";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res
      .status(400)
      .json({ message: "Wrong request method, only Post is allowed" });
  }
  const body = req.body;
  if (body) {
    const inputUser: UserAuth = {
      username: get(body, "username"),
      password: get(body, "password"),
    };

    const user = await prisma.user.findFirst({
      where: {
        username: inputUser.username,
        password: inputUser.password,
      },
    });
    if (user) {
      res.status(200).json({
        message: "Logged in successfully!",
        user: inputUser,
      });
    } else {
      res.status(400).json({
        message: "Username or Password is invalid. Please Try Again",
        userProvided: inputUser,
      });
    }
  } else {
    res.status(400).json({ message: "No body was passed" });
  }
}
