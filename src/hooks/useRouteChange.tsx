import { useEffect } from "react";
import { useRouter } from "next/router";

export function useRouteChange(callback: () => void) {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeComplete", callback);

    return () => {
      router.events.off("routeChangeComplete", callback);
    };
  }, [router, callback]);
}
