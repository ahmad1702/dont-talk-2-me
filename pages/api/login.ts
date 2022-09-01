// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { get } from "lodash-es";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserAuth } from "../../Auth/UserProvider";
const fs = require("fs");
const usersPath = "Auth/users.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res
      .status(400)
      .json({ message: "Wrong request method, only Post is allowed" });
  }
  const data = JSON.parse(fs.readFileSync(usersPath));
  if (data) {
    const body = req.body;
    if (body) {
      const inputUser: UserAuth = {
        username: get(body, "username"),
        password: get(body, "password"),
      };

      const matchedByUsername = data.filter(
        (item: UserAuth) => item.username == inputUser.username
      );
      if (
        matchedByUsername.length > 0 &&
        inputUser.password === matchedByUsername[0].password
      ) {
        res.status(200).json({
          message: "Logged in successfully!",
          user: inputUser,
        });
      } else {
        res.status(400).json({
          message: "Username or Password is invalid. Please Try Again",
          userProvided: inputUser,
          data: data,
        });
      }
    } else {
      res.status(400).json({ message: "No body was passed" });
    }
  } else {
    res.status(500).json({ message: "Json not found" });
  }
}
