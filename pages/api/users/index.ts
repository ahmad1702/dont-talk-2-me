// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { add, get } from "lodash-es";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserAuth } from "../../../Auth/UserProvider";
const fs = require("fs");
const usersPath = "Auth/users.json";

type addUserToJsonReturnType = "success" | "username exists" | "error";

const addUserToJson = (inputUser: UserAuth): addUserToJsonReturnType => {
  let message: addUserToJsonReturnType | null = null;
  try {
    const data = JSON.parse(fs.readFileSync(usersPath));
    if (
      data.filter((item: UserAuth) => item.username === inputUser.username)
        .length > 0
    ) {
      message = "username exists";
    } else {
      message = "success";
      data.push(inputUser);
      fs.writeFile(usersPath, JSON.stringify(data), (err: any, result: any) => {
        if (err) {
          console.error(err);
          message = "error";
        }
      });
    }
  } catch (error) {
    message = "error";
  }
  console.log({ message: message });
  return message || "error";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const secret = req.headers.authorization;

  if (req.method === "GET") {
    if (secret) {
      if (secret === "Bearer alligator") {
        let rawdata = fs.readFileSync(usersPath);
        let users = JSON.parse(rawdata);
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
          const addAction = await addUserToJson(inputUser);
          if (addAction) {
            if (addAction === "success") {
              res.status(200).json(inputUser);
            } else if (addAction === "username exists") {
              res.status(400).json({ message: "Username already exists" });
            } else if (addAction === "error") {
              res.status(500).json({ message: "Something went wrong" });
            }
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
