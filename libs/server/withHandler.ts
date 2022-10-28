import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export interface ResponseType {
    ok: boolean;
    [key: string]: any;
}

export default function withHandler(
    method: "GET" | "POST" | "DELETE",
    // fn: (req: NextApiRequest, res: NextApiResponse) => void
    fn: NextApiHandler
): NextApiHandler {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        if (method !== req.method) {
            return res.status(405).end();
        }
        try {
            await fn(req, res);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    };
}
