import React, { Suspense } from "react";
import CommunityList from "@/components/CommunityList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import CommunitiesPageSkeleton from "@/components/skeletons/CommunitiesPageSkeleton";
import Spinner from "@/components/Spinner";

export default function CommunitiesPage() {
  return (
    <Suspense fallback={<CommunitiesPageSkeleton />}>
      <main className="mt-2 w-full">
        <div className="mb-8 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1>Communities</h1>
          <Link href="/communities/create">
            <Button
              variant="default"
              size={"sm"}
              className="inline-flex h-9 items-center justify-center gap-1.5 px-5 py-1.5"
            >
              <PlusCircle className="-mt-0.5 size-4" /> Create A New Community
            </Button>
          </Link>
        </div>
        <Suspense fallback={<Spinner />}>
          <CommunityList />
        </Suspense>
      </main>
    </Suspense>
  );
}
