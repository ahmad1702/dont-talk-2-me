import { get } from "lodash-es";
import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import prisma from "../../lib/prisma";

const pusher_app_id = process.env.NEXT_PUBLIC_PUSHER_APP_ID;
const pusher_app_key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const pusher_secret = process.env.NEXT_PUBLIC_PUSHER_SECRET;

// }
export const pusher = new Pusher({
  appId: pusher_app_id || "",
  key: pusher_app_key || "",
  secret: pusher_secret || "",
  cluster: "us2",
  useTLS: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const body = req.body;
  if (body) {
    if (body.username && body.message) {
      const inputMessage: any = {
        username: get(body, "username"),
        message: get(body, "message"),
        room: get(body, "room"),
      };
      try {
        const user = await prisma.user.findFirst({
          where: {
            username: inputMessage.username,
          },
        });
        if (user && typeof inputMessage.room === "string") {
          const dbRoom = await prisma.room.findUnique({
            where: {
              name: inputMessage.room,
            },
          });
          if (dbRoom) {
            console.log({
              username: inputMessage.username,
              text: inputMessage.message,
              room_id: inputMessage.room,
            });
            const message = await prisma.message.create({
              data: {
                username: inputMessage.username,
                text: inputMessage.message,
                room_name: dbRoom.name,
              },
            } as any);
            console.log({ message: message });
            if (message) {
              const response = await pusher.trigger(
                "chat",
                "chat-event",
                JSON.stringify(message)
              );
              res
                .status(200)
                .json({ message: "success", createdMessage: message });
            }
          } else {
            res.status(404).json({ message: "Room not found in DB" });
          }
        } else {
          res.status(404).json({ messsage: "User not found in DB" });
        }
      } catch (error) {
        res.status(500).json({
          error: error,
          message: "prisma be wack asl",
          body: req.body,
          query: req.query,
        });
      }
    } else {
      res.status(400).json({ message: "Incorrect body supplied" });
    }
  }
}
