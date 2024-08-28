"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Courses } from "@/components/Courses";
import CoursesLoadingSkeleton from "@/components/skeletons/CoursesLoadingSkeleton";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import { Loader2 } from "lucide-react";
import { Course } from "@prisma/client";

interface CoursesPage {
  courses: Course[];
  nextCursor: string | null;
}

export default function LearningTab() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["courses"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/courses",
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<CoursesPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });

  const courses = data?.pages.flatMap((page) => page.courses) || [];

  if (status === "pending") {
    return <CoursesLoadingSkeleton />;
  }

  if (status === "success" && !courses.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No courses available at the moment.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading courses.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <Courses courses={courses} loading={isLoading} />
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
