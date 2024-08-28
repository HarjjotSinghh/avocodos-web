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

type CommunityWithCounts = Community & {
  _count: { members: number; posts: number };
};

function CommunityCard({ community }: { community: CommunityWithCounts }) {
  return (
    <div className="flex h-full flex-col items-stretch justify-between overflow-hidden rounded-2xl border-2 border-muted bg-card avocodos-transition avocodos-shadow-lg hover:border-primary/40">
      <div className="relative">
        <div className="absolute inset-0 z-[1] h-full w-full bg-gradient-to-b from-transparent from-40% to-card" />
        <Image
          src="/auth.webp"
          alt={community.name}
          width={300}
          height={200}
          className="-z-[1] aspect-video h-auto w-full select-none object-cover dark:mix-blend-color-dodge dark:brightness-150 dark:contrast-125"
          draggable={false}
        />
      </div>
      <div className="p-6 lg:p-8">
        <h3 className="line-clamp-1 text-xl font-bold">{community.name}</h3>
        <p className="mb-4 line-clamp-3 whitespace-pre-wrap text-foreground/80">
          {community.description}
        </p>
        <Badge
          variant={"secondary"}
          className="mb-4 min-w-fit border-2 border-muted bg-secondary/50 text-sm font-normal text-foreground/80"
        >
          Created on {formatDatePretty(new Date(community.createdAt))}
        </Badge>
        <div className="grid grid-cols-2 gap-4 text-sm text-foreground/80">
          <span className="inline-flex flex-col-reverse items-center justify-center gap-2 rounded-lg border-2 border-muted p-2">
            <span className="text-base font-semibold">Members</span>{" "}
            <span className="text-3xl font-bold">
              {community._count.members}
            </span>
          </span>
          <span className="inline-flex flex-col-reverse items-center justify-center gap-2 rounded-lg border-2 border-muted p-2">
            <span className="text-base font-semibold">Posts</span>{" "}
            <span className="text-3xl font-bold">{community._count.posts}</span>
          </span>
        </div>
        <hr className="my-4 border-2 border-muted/60" />
        <Link className="" href={`/communities/${community.name}`}>
          <Button
            variant={"shine"}
            className="inline-flex w-full gap-1.5"
            iconSize={12}
          >
            <Eye className="size-4" /> View Community
          </Button>
        </Link>
      </div>
    </div>
  );
}

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
      {communities?.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
      {communities?.length === 0 && <div>No communities found</div>}
    </div>
  );
}
