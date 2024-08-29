import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import CourseDetails from "@/components/CourseDetails";
import CourseDetailsSkeleton from "@/components/skeletons/CourseDetailsSkeleton";
import Link from "next/link";

interface PageProps {
  params: { courseId: string };
}

async function getCourse(courseId: string) {
  const course = await prisma?.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      lessons: {
        select: {
          id: true,
          title: true,
          order: true
        },
        orderBy: { order: "asc" }
      }
    },
    cacheStrategy: { ttl: 60 }
  });

  if (!course) notFound();

  return course;
}

export async function generateMetadata({
  params: { courseId }
}: PageProps): Promise<Metadata> {
  const course = await getCourse(courseId);

  return {
    title: `${course.title} | Avocodos Learning`,
    description: course.description
  };
}

export default function CoursePage({ params: { courseId } }: PageProps) {
  return (
    <main className="container mx-auto py-8">
      <Suspense fallback={<CourseDetailsSkeleton />}>
        <CourseContent courseId={courseId} />
      </Suspense>
    </main>
  );
}

async function CourseContent({ courseId }: { courseId: string }) {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page. Please{" "}
        <Link href="/login" className="underline">
          login
        </Link>{" "}
        to continue.
      </p>
    );
  }

  const course = await getCourse(courseId);

  return <CourseDetails course={course} />;
}
