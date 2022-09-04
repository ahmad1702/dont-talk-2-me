// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { get } from "lodash-es";
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
  if (req.method === "POST") {
    const body = req.body;
    if (body) {
      if (body.username && body.message) {
        const inputMessage: Message = {
          username: get(body, "username"),
          message: get(body, "message"),
        };
        try {
          const { room } = req.query;

          // pusher.trigger(room ? room : "my-channel", "my-event", body);
          const user = await prisma.user.findFirst({
            where: {
              username: inputMessage.username,
            },
          });
          // user ? res.json(user) : res.json({message: 'no user'})
          if (user && typeof room === "string") {
            const dbRoom = await prisma.room.findUnique({
              where: {
                name: room,
              },
            });
            if (dbRoom) {
              // res.status(200).json({ message: "this works" });
              console.log({
                username: inputMessage.username,
                text: inputMessage.message,
                room_id: 1,
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
  } else if (req.method === "GET") {
    const secret = req.headers.authorization;
    if (secret) {
      if (secret === "Bearer alligator") {
        const messages = await prisma.message.findMany();
        res.status(200).json(messages);
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
  } else if (req.method === "DELETE") {
    const id = parseInt(get(req, "query.id"));
    if (id) {
      const deletedMessage = await prisma.message.delete({
        where: {
          id: id as number,
        },
      });
      if (deletedMessage) {
        res.status(200).json(deletedMessage);
      } else {
        res.status(500).json({
          message: "no message found to delete",
        });
      }
    } else {
      res.status(400).json({
        message: "no id query supplied",
      });
    }
  } else {
    res.status(400).json({ message: "Only Post, Get, and Delete is Accepted" });
  }
}

/*
Type: undefined
Message: 
Invalid `prisma.message.create()` invocation:

{
  data: {
    text: 'Hello hello',
    createdBy: {
      connect: {
        id: 3
      }
    },
    room: {
      connect: {
?       id?: Int,
?       name?: String
      },
?     create?: RoomCreateWithoutMessageInput | RoomUncheckedCreateWithoutMessageInput,
?     connectOrCreate?: {
?       where: RoomWhereUniqueInput,
?       create: RoomCreateWithoutMessageInput | RoomUncheckedCreateWithoutMessageInput
?     }
    }
  },
  select: {
    id: true,
    text: true,
    createdAt: true,
    createdBy: true,
    username: true,
    room: true,
    roomName: true
  }
}

Argument data.room.connect of type RoomWhereUniqueInput needs at least one argument. Available args are listed in green.

Note: Lines with ? are optional.


Code: undefined

Query:
[object Object]
*/
