import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input, Button } from "@features/ui";
import { ISignup, signupSchema } from "@lib/validation";
import { useAuth } from "@features/auth";

export function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ISignup>({
    resolver: zodResolver(signupSchema),
  });
  const { signupMutation } = useAuth(() => router.push("/"));

  const onSubmit: SubmitHandler<ISignup> = (values) => {
    const parsedValues = signupSchema.parse(values);
    signupMutation.mutate(parsedValues);
  };

  const checkErrors = () => {
    return (
      !!errors.email ||
      !!errors.password ||
      !!errors.confirmPassword ||
      !isDirty ||
      signupMutation.isLoading
    );
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white px-4 py-6 shadow-lg shadow-shadow">
      <form
        className="mb-4 flex flex-col gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-bold capitalize text-black">sign up</h1>
        <Input
          label="email"
          type="email"
          register={register("email", { required: true })}
          error={errors.email?.message}
        />
        <Input
          label="password"
          type="password"
          register={register("password", { required: true, minLength: 6 })}
          error={errors.password?.message}
        />
        <Input
          label="confirm password"
          type="password"
          register={register("confirmPassword", {
            required: true,
            minLength: 6,
          })}
          error={errors.confirmPassword?.message}
        />
        <Button type="submit" disabled={checkErrors()}>
          sign up
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="mr-1">Already have an account?</span>
        <Link
          href="/"
          className="text-primary transition-colors hover:text-hover-primary"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
