import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body: { message },
    session: { user },
  } = req;

  const newMessage = await client.message.create({
    data: {
      message,
      user: {
        connect: {
          id: user?.id,
        },
      },
      stream: {
        connect: {
          id: +id!.toString(),
        },
      },
    },
  });
  res.json({ ok: true, message: newMessage });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
