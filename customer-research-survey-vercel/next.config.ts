import path from "node:path";
import type { NextConfig } from "next";

// Which country this deployment is for. Set NEXT_PUBLIC_MARKET=br on the Brazil
// Vercel project; anything else (or unset) builds the UK survey.
const market = process.env.NEXT_PUBLIC_MARKET === "br" ? "br" : "uk";
const marketContent = path.join(__dirname, "content", `${market}.ts`);

const nextConfig: NextConfig = {
  // Alias "@market" to a single country's content file so the other country's
  // questions are never included in the build.
  webpack(config) {
    config.resolve.alias["@market"] = marketContent;
    return config;
  },
  turbopack: { resolveAlias: { "@market": `./content/${market}.ts` } },
};
export default nextConfig;
