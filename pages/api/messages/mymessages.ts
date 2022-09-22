// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type Message = {
  username: string;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const { room } = req.query;
    if (room && typeof room === "string") {
      const dbRoom = await prisma.room.findUnique({
        where: {
          name: room,
        },
      });
      if (dbRoom) {
        const messages = await prisma.message.findMany({
          where: {
            room_name: dbRoom.name,
          },
        });
        res.status(200).json(messages);
      } else {
        res.status(404).json({ message: "That room doesn't exist" });
      }
    } else {
      res.status(400).json({ message: "Make sure to add room query" });
    }
  } else {
    res.status(400).json({ message: "Only Get Method is Accepted" });
  }
}
