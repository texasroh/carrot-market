import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "GET") {
        const streams = await client.stream.findMany({
            take: 10,
        });
        res.json({ ok: true, streams });
    } else if (req.method === "POST") {
        const {
            body: { name, price, description },
            session: { user },
        } = req;
        const stream = await client.stream.create({
            data: {
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
                name,
                price,
                description,
            },
        });
        res.json({ ok: true, stream });
    }
}

export default withApiSession(
    withHandler({ methods: ["GET", "POST"], handler })
);
