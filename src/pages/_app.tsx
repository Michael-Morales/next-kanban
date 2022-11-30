import type { AppProps } from "next/app";
import { useState } from "react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Plus_Jakarta_Sans } from "@next/font/google";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";

import { useDarkMode } from "@hooks/useDarkMode";

import "@styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-plus-jakarta-sans",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  useDarkMode();

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <div className={`${plusJakartaSans.variable} h-full font-sans`}>
            <NextNProgress color="#635fc7" options={{ showSpinner: false }} />
            <Component {...pageProps} />
            <div id="modal" />
          </div>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}
