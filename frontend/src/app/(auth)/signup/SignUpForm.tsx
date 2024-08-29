"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { WalletSelector } from "@/components/WalletSelector";
import { CheckIcon, XIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { signUp, verifyOTP } from "./actions";
import OTPDialog from "@/components/OTPDialog";

export default function SignUpForm() {
  const [error, setError] = useState<string>();
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpError, setOtpError] = useState<string>();
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [userId, setUserId] = useState<string>();

  const { account, wallet, connected, isLoading } = useWallet();

  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: ""
    }
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    startTransition(async () => {
      if (!account?.address) {
        setError("No wallet connected. Please connect a wallet.");
        return;
      }
      const { error, userId } = await signUp({
        ...values,
        account: account,
        wallet: wallet
      });
      if (error) {
        setError(error);
      } else if (userId) {
        setUserId(userId);
        setShowOTPDialog(true);
      }
    });
  }

  async function handleOTPSubmit(otp: string) {
    if (!userId) return;

    const { success, error } = await verifyOTP(userId, otp);
    if (success) {
      // Redirect to main page or show success message
      window.location.href = "/";
    } else {
      setOtpError(error || "Invalid OTP");
      setOtpAttempts((prev) => prev + 1);
      if (otpAttempts >= 2) {
        setOtpError("Failed to verify email. Please try again later.");
      }
    }
  }

  return (
    <>
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
          <p className="mt-2 inline-flex flex-row flex-wrap items-center justify-center gap-2 text-pretty text-sm text-foreground/80">
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

      <OTPDialog
        open={showOTPDialog}
        onOpenChange={setShowOTPDialog}
        onSubmit={handleOTPSubmit}
        error={otpError}
        attemptsLeft={3 - otpAttempts}
        isPending={isPending}
      />
    </>
  );
}
