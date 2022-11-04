import { isBot } from "next/dist/server/web/spec-extension/user-agent";
import { NextFetchEvent, NextRequest } from "next/server";

const middleware = (req: NextRequest, ev: NextFetchEvent) => {
  console.log(isBot("hello"));
};
export { middleware };
