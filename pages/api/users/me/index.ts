import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "GET") {
        const profile = await client.user.findUnique({
            where: {
                id: req.session.user?.id,
            },
        });
        res.json({ ok: true, profile });
    } else if (req.method === "POST") {
        const {
            session: { user },
            body: { email, phone, name },
        } = req;
        const currentUser = await client.user.findUnique({
            where: {
                id: user?.id,
            },
        });
        if (email && email !== currentUser?.email) {
            const emailExist = Boolean(
                await client.user.findUnique({
                    where: {
                        email,
                    },
                    select: {
                        id: true,
                    },
                })
            );
            if (emailExist) {
                return res.json({ ok: false, error: "Email already taken" });
            }
            await client.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    email,
                },
            });
        }
        if (phone && phone !== currentUser?.phone) {
            const phoneExist = Boolean(
                await client.user.findUnique({
                    where: {
                        phone,
                    },
                    select: {
                        id: true,
                    },
                })
            );
            if (phoneExist) {
                return res.json({ ok: false, error: "Phone already taken" });
            }
            await client.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    phone,
                },
            });
        }
        if (name) {
            await client.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    name,
                },
            });
        }

        res.json({ ok: true });
    }
}

export default withApiSession(
    withHandler({ methods: ["GET", "POST"], handler })
);
