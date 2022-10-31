import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        body: { question },
        session: { user },
    } = req;
    const post = await client.post.create({
        data: {
            question,
            user: {
                connect: {
                    id: user?.id,
                },
            },
        },
    });
    res.json({ ok: true, post });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
