// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const Pusher = require("pusher");

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const body = req.body;
    if (body) {
      if (body.username && body.message && body.time) {
        try {
          const pusher = new Pusher({
            appId: "1471406",
            key: "49d47e2ad5cd2baff292",
            secret: "377e68a33529233e4b38",
            cluster: "us2",
            useTLS: true,
          });
          console.log("API CALL TO PUSHER");
          const { room } = req.query;
          pusher.trigger(room ? room : "my-channel", "my-event", body);
          res.status(200).json({ success: "success" });
        } catch (error) {
          res.status(500).json({ error: error });
        }
      } else {
        res.status(400).json({ message: "Incorrect body supplied" });
      }
    }
  } else {
    res.status(400).json({ message: "Only Post is Accepted" });
  }

  //   res.status(200).json({ name: "John Doe" });
}
