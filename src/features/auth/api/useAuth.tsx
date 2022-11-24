import { useMutation } from "@tanstack/react-query";

import type { ISignup } from "@lib/validation";
import axios from "@lib/axios";

export function useAuth(callback?: () => void) {
  const signupMutation = useMutation({
    mutationFn: (values: ISignup) => axios.post("/users", values),
    onSuccess: () => callback && callback(),
  });

  return { signupMutation };
}
