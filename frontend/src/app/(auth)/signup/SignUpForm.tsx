"use client";

import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "./actions";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@/components/WalletSelector";
import { CheckIcon, XIcon } from "lucide-react";

export default function SignUpForm() {
  const [error, setError] = useState<string>();

  const {
    connect,
    account,
    network,
    connected,
    disconnect,
    wallet,
    wallets,
    signAndSubmitTransaction,
    signTransaction,
    signMessage,
    signMessageAndVerify,
    isLoading
  } = useWallet();

  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: ""
    }
  });
  form.watch("wallet");
  form.watch("account");
  console.log(JSON.stringify(wallet, null, 2), "wallet");
  console.log(JSON.stringify(account, null, 2), "account");
  console.log(JSON.stringify(form.getValues(), null, 2), "form");

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    startTransition(async () => {
      if (!account?.address) {
        setError("No wallet connected. Please connect a wallet.");
        return;
      }
      const { error } = await signUp({
        ...values,
        account: account,
        wallet: wallet
      });
      if (error) setError(error);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        {error && <p className="text-left text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wallet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet</FormLabel>
              <FormControl>
                <WalletSelector {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isPending}
          type="submit"
          className="mt-1 w-full"
          disabled={isLoading || !connected || !form.formState.isValid}
        >
          Create Account
        </LoadingButton>
        <p className="mt-2 inline-flex flex-row flex-wrap items-center justify-center gap-2 text-pretty text-sm text-muted-foreground">
          <span>
            {wallet?.name ? (
              <CheckIcon className="-mt-0.5 text-primary" />
            ) : (
              <XIcon className="-mt-0.5 text-destructive" />
            )}
          </span>
          {!wallet?.name
            ? "No Wallet Connected. Please connect a wallet."
            : "Wallet connected successfully."}
        </p>
      </form>
    </Form>
  );
}
