import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        body: { question, latitude, longitude },
        session: { user },
    } = req;
    if (req.method === "POST") {
        const post = await client.post.create({
            data: {
                question,
                latitude,
                longitude,
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
            },
        });
        res.json({ ok: true, post });
    } else if (req.method === "GET") {
        const posts = await client.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        wonderings: true,
                        answers: true,
                    },
                },
            },
        });
        res.json({ ok: true, posts });
    }
}

export default withApiSession(
    withHandler({ methods: ["POST", "GET"], handler })
);
