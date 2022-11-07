import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default () => {
    return (
        <Html lang="ko">
            <Head>
                {/* 
                SEO가능
                        구글 폰트만 사용할것
                        nextjs는 구글폰트를 빌드시 최적화해줌.
                    */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
            {/*
                next/Script는 3가지 strategy가 있다. afterInteractive(default) / beforeInteractive / lazyOnload
                Script는 _app.tsx로 가도되고 _document.tsx로 가도 된다.
                */}
            <Script
                src="https://developers.kaka.com/sdk/js/kakao.js"
                strategy="lazyOnload"
            />
            <Script
                src="https://connect.facebook.net/en_US/sdk.js"
                onLoad={() => {
                    // window.fbAsyncInit = function () {
                    //     FB.init({
                    //         appId: "your-app-id",
                    //         autoLogAppEvents: true,
                    //         xfbml: true,
                    //         version: "v13.0",
                    //     });
                    // };
                }}
            />

            <Script />
        </Html>
    );
};
