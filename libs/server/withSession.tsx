import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const options = {
  cookieName: process.env.COOKIE_NAME!,
  password: process.env.IRON_PW!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, options);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, options);
}
