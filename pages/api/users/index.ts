// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { add, get } from "lodash-es";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserAuth } from "../../../Auth/UserProvider";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const secret = req.headers.authorization;

  if (req.method === "GET") {
    if (secret) {
      if (secret === "Bearer alligator") {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
      } else {
        res.status(401).json({
          message: "Wrong Auth Creds, try again :(",
        });
      }
    } else {
      res.status(401).json({
        message: "No Auth Credentials were Provided",
      });
    }
  } else if (req.method === "POST") {
    const body = req.body;
    if (body) {
      const username = get(body, "username");
      const password = get(body, "password");
      const inputUser: UserAuth = {
        username: username,
        password: password,
      };
      if (username && password && username.length > 0 && password.length > 0) {
        try {
          const user = await prisma.user.create({
            data: {
              username: inputUser.username,
              password: inputUser.password,
            },
          });
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(400).json({ message: "no user found" });
          }
        } catch (error) {
          res.status(500).json({ message: error });
        }
      } else {
        res.status(400).json({
          message: "Either the Username or Password is invalid",
        });
      }
    } else {
      res.status(400).json({
        message: "Not body was sent with the request",
      });
    }
  }
}
