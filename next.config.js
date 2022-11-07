/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["imagedelivery.net", "videodelivery.net"],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
        // prependData: `@import "styles/_variables.scss"; @import "styles/_mixins.scss";`,   // 두 파일에서 선언한 변수를 모든 파일에서 사용할 수 있다.
    },
    // experimental: {    // server Components를 위한 옵션
    //     reactRoot: true,
    //     runtime: "nodejs",
    //     concurrentFeatures: true,
    //     serverComponents: true,
    //     appDir: "./pages",
    // },
};

module.exports = nextConfig;
