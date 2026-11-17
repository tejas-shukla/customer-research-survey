// "@market" is aliased in next.config.ts to the content file for NEXT_PUBLIC_MARKET.
declare module "@market" {
  const content: import("./types").MarketContent;
  export default content;
}
