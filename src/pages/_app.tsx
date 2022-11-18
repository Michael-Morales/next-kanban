import type { AppProps } from "next/app";
import { Plus_Jakarta_Sans } from "@next/font/google";

import "@styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-plus-jakarta-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${plusJakartaSans.variable} font-sans`}>
      <Component {...pageProps} />
      <div id="modal" />
    </div>
  );
}
