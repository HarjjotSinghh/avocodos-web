"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { User } from "@prisma/client";

// New client-side component for NFT minting
export default function ClientSideNFTButton({
  courseId,
  userData
}: {
  courseId: string;
  userData: User;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetNFT = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/nft/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ courseId })
      });

      if (!response.ok) {
        throw new Error("Failed to mint NFT: " + response.statusText);
      }

      const data = await response.json();
      console.log("NFT minted and transferred:", data.nft);
      toast({
        title: "NFT minted successfully!",
        description: `You can now view your NFT in your wallet (${userData.walletAddress}).`
      });
    } catch (error) {
      toast({
        title: "Failed to mint NFT.",
        description: (error as Error).message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="inline-flex w-full items-center justify-center gap-2"
      onClick={handleGetNFT}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? "Minting..." : "Get Your NFT Now"}
    </Button>
  );
}
