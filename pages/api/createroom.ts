// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { add, get } from "lodash-es";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserAuth } from "../../Auth/UserProvider";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const { name } = req.query;
    if (name && name.length > 0 && typeof name === "string") {
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
        message: "Add 'Name' Query",
      });
    }
  } else {
    res.status(400).json({
      message: "Only Post allowed",
    });
  }
}
