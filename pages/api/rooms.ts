// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { add, get } from "lodash-es";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserAuth } from "../../Auth/UserProvider";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const secret = req.headers.authorization;

  if (req.method === "GET") {
    if (secret) {
      if (secret === "Bearer alligator") {
        const rooms = await prisma.room.findMany();
        res.status(200).json(rooms);
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
      const name: any = get(body, "name");
      if (name && name.length > 0) {
        try {
          const room = await prisma.room.create({
            data: {
              name: name,
            },
          });
          if (room) {
            res.status(200).json(room);
          } else {
            res.status(400).json({ message: "no room found" });
          }
        } catch (error) {
          res.status(500).json({
            message: error ? error : "prisma said some 🤢 ",
          });
          console.error(error);
        }
      } else {
        res.status(400).json({
          message: "Invalid body.",
        });
      }
    } else {
      res.status(400).json({
        message: "No body was sent with the request",
      });
    }
  }
}
