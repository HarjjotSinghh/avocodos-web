import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import authImage from "@/assets/auth.webp";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export const metadata: Metadata = {
  title: "Sign Up"
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-background">
        <div className="w-full max-w-lg space-y-10 overflow-y-auto p-4 md:p-16">
          <div className="flex flex-col items-start justify-start space-y-1 text-left">
            {/* <Image
              src={"/logo-text-black.svg"}
              alt="Avocodos"
              width={800}
              height={200}
              className="!mb-6 block h-10 w-auto dark:hidden"
            />
            <Image
              src={"/logo-text-white.svg"}
              alt="Avocodos"
              width={800}
              height={200}
              className="!mb-6 hidden h-10 w-auto dark:block"
            /> */}
            <h1 className="text-3xl font-bold capitalize">Create an account</h1>
            <p className="max-w-[400px] text-pretty text-left text-muted-foreground">
              Welcome to Avocodos, a completly web3-based social media and
              learning platform.
            </p>
          </div>
          <div className="space-y-2">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        <div className="relative hidden w-full md:block">
          <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-l from-transparent from-60% to-background"></div>
          <Image
            src={"/auth.webp"}
            alt=""
            width={1280}
            height={720}
            draggable={false}
            className="hidden h-screen w-full flex-1 select-none object-cover md:block"
          />
        </div>
      </div>
    </main>
  );
}
