"use client";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import Link from "next/link";
import { Community } from "@prisma/client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatDatePretty } from "@/lib/utils";
import { ArrowUpRight, Eye } from "lucide-react";
import CommunitiesPageSkeleton from "./skeletons/CommunitiesPageSkeleton";
import CommunityCard, { CommunityWithCounts } from "./CommunityCard";

export default function CommunityList() {
  const {
    data: communities,
    isLoading,
    error
  } = useQuery({
    queryKey: ["communities"],
    queryFn: () =>
      kyInstance.get("/api/communities").json<CommunityWithCounts[]>()
  });

  if (isLoading) return <CommunitiesPageSkeleton />;
  if (error) return <div>Error loading communities</div>;

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
      {communities?.map(
        (community) =>
          !community.isPrivate && (
            <CommunityCard key={community.id} community={community} />
          )
      )}
      {communities?.length === 0 && <div>No communities found</div>}
    </div>
  );
}
