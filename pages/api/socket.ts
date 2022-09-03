import { get } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

const ioHandler = (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (!(res.socket as any).server.io) {
    // if (true) {
    console.log("*First use, starting socket.io");

    const io = new Server((res.socket as any).server);

    io.on("connection", async (socket) => {
      const roomquery = socket.handshake.query.room as string;
      if (!roomquery) {
        // Handle this as required
        console.log("No Room name was supplied");
        return;
      }
      const roomName = roomquery.replace("%20", " ");
      // socket.join(roomName);
      // socket.to(roomName).emit("connectToRoom", "You are in room: " + roomName);
      // .in(roomName)
      // console.log({ roomName });
      // socket.join(roomName as string);
      // socket.emit("notif", `${roomName} connected`);

      socket.on(roomName, (msg) => {
        console.log(`New user connected to ${roomName}`);
        socket.broadcast.emit(roomName, `no ${msg} room for u boi!`);
      });

      socket.on("hello", (msg) => {
        console.log({ msg: msg });
        socket.emit("hello", "world!");
      });
      socket.on("messages", (msg) => {
        console.log({ newRoom: msg });
        socket.broadcast.emit("newRoom", `no ${msg} room for u boi!`);
      });
      socket.on("newMessage", async (msg) => {
        const req = JSON.parse(msg);
        const inputMessage: any = {
          username: get(req, "username"),
          message: get(req, "message"),
          room: get(req, "room"),
        };
        console.log({ input: inputMessage });
        if (req) {
          const user = await prisma.user.findFirst({
            where: {
              username: inputMessage.username,
            },
          });
          const dbRoom = await prisma.room.findUnique({
            where: {
              name: inputMessage.room,
            },
          });
          if (!user) console.log("user doesn't exist");
          if (!dbRoom) console.log("no room found");
          if (user && dbRoom && typeof inputMessage.room === "string") {
            const message = await prisma.message.create({
              data: {
                username: user.username,
                text: inputMessage.message,
                room_name: dbRoom.name,
              },
            });
            if (message) {
              io.to(dbRoom.name).emit(
                inputMessage.room,
                JSON.stringify(inputMessage)
              );
            } else {
              console.log("Message create failed");
            }
          }
        }
      });
    });

    (res.socket as any).server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
