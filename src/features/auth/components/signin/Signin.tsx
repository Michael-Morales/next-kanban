import Link from "next/link";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";

import { Input, Button } from "@features/ui";
import { ISignin, signinSchema } from "@lib/validation";

export function Signin() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ISignin>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit: SubmitHandler<ISignin> = (values) => {
    const { email, password } = signinSchema.parse(values);
    signIn("app-signin", {
      email,
      password,
    });
  };

  const checkErrors = () => {
    return !!errors.email || !!errors.password || !isDirty;
  };

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div className="w-full max-w-md rounded-lg bg-white px-4 py-6 shadow-lg shadow-shadow">
      <form
        className="mb-4 flex flex-col gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-bold capitalize text-black">sign in</h1>
        <Input
          label="email"
          type="email"
          register={register("email", { required: true })}
          error={errors.email?.message}
        />
        <Input
          label="password"
          type="password"
          register={register("password", { required: true })}
          error={errors.password?.message}
        />
        <Button type="submit" disabled={checkErrors()}>
          sign in
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="mr-1">Don&apos;t have an account?</span>
        <Link
          href="/sign-up"
          className="text-primary transition-colors hover:text-hover-primary"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
