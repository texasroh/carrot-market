import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        query: { id },
        session: { user },
    } = req;

    const post = await client.post.findUnique({
        where: {
            id: +id!.toString(),
        },
    });

    if (!post) res.status(404).end();

    const answer = await client.answer.create({
        data: {
            user: {
                connect: {
                    id: user?.id,
                },
            },
            post: {
                connect: {
                    id: +id!.toString(),
                },
            },
            answer: req.body.answer,
        },
    });
    res.json({ ok: true, answer });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
