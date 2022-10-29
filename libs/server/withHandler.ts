import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

interface ConfigType {
  method: "GET" | "POST" | "DELETE";
  // fn: (req: NextApiRequest, res: NextApiResponse) => void
  handler: NextApiHandler;
  isPrivate?: boolean;
}

export default function withHandler({
  method,
  handler,
  isPrivate = true,
}: ConfigType): NextApiHandler {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (method !== req.method) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: "Please log in" });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
