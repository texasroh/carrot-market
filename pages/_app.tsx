import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";

function CheckLogin() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  console.log("_app", router.pathname, user, isLoading);
  useEffect(() => {
    if (!isLoading && user && router.pathname === "/enter") {
      router.replace("/profile");
    } else if (!isLoading && !user && router.pathname !== "/enter") {
      router.replace("/enter");
    }
  }, [router, user, isLoading]);

  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 60000,
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      {/* <CheckLogin /> */}
      <div className="mx-auto w-full max-w-xl">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
