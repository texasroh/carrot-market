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
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                },
            },
            _count: {
                select: {
                    answers: true,
                    wonderings: true,
                },
            },
            answers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });
    const isWondering = Boolean(
        await client.wondering.findFirst({
            where: {
                postId: +id!.toString(),
                userId: user?.id,
            },
        })
    );

    res.json({ ok: true, post, isWondering });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
