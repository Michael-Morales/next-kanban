import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { Input, Button } from "@features/ui";
import { ISignin, signinSchema } from "@lib/validation";

export function Signin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
  } = useForm<ISignin>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signinSchema),
  });

  const onSubmit: SubmitHandler<ISignin> = (values) => {
    setIsLoading(true);
    const { email, password } = signinSchema.parse(values);
    signIn("app-signin", {
      email,
      password,
      redirect: false,
    }).then((res) => {
      if (res?.ok) {
        router.push("/dashboard");
      } else {
        setError("email", { type: "login", message: "Wrong credentials" });
        setIsLoading(false);
      }
    });
  };

  const checkErrors = () => {
    return !!errors.email || !!errors.password || !isDirty || isLoading;
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white px-4 py-6 shadow-lg shadow-shadow dark:bg-theme-dark">
      <form
        className="mb-4 flex flex-col gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-bold capitalize text-black dark:text-white">
          sign in
        </h1>
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
        <Button type="submit" disabled={checkErrors()} loading={isLoading}>
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
