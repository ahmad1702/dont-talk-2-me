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
        const appId: string | undefined = process.env.NEXT_PUBLIC_PUSHER_APP_ID;
        const key: string | undefined = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
        const secret: string | undefined =
          process.env.NEXT_PUBLIC_PUSHER_SECRET;
        if (appId && key && secret) {
          try {
            const pusher = new Pusher({
              appId: appId,
              key: key,
              secret: secret,
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
          res.status(500).json({ message: "Env not working" });
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
