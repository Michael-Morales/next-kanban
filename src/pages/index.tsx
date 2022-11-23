import { Signin } from "@features/auth";

export default function Home() {
  return (
    <div className="mx-4 flex h-screen items-center justify-center">
      <Signin />
    </div>
  );
}
