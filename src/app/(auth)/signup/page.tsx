import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import authImage from "@/assets/auth.webp";

export const metadata: Metadata = {
  title: "Sign Up"
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="avocodos-shadow-lg flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-bold">Sign up to Avocodos</h1>
            <p className="max-w-[400px] text-pretty text-muted-foreground">
              A completly web3-based social media and learning platform.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        <Image
          src={"/auth.webp"}
          alt=""
          width={1280}
          height={720}
          draggable={false}
          className="hidden w-1/2 select-none object-cover md:block"
        />
      </div>
    </main>
  );
}
