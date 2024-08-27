"use client";

import { Course, Lesson, User } from "@prisma/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { formatDate } from "date-fns";
import { formatDatePretty, USDToINR } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowUpRight,
  ClockIcon,
  Grid2X2,
  Grid2X2Icon,
  List,
  Users
} from "lucide-react";
import Link from "next/link";
import CourseDetailsSkeleton from "./skeletons/CourseDetailsSkeleton";

interface CourseDetailsProps {
  course: Course & {
    instructor: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
    lessons: Pick<Lesson, "id" | "title" | "order">[];
  };
}

export default function CourseDetails({ course }: CourseDetailsProps) {
  return (
    <div className="flex flex-col gap-8">
      <Link href="/">
        <Button variant="default" className="max-w-fit">
          <ArrowLeft className="mr-2 size-4" />
          Back To Courses
        </Button>
      </Link>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="">
            <img
              src={course.imageUrl}
              alt={course.title}
              width={1200}
              height={675}
              className="w-full rounded-t-lg object-cover"
            />
            <CardHeader className="p-6 md:p-8">
              <CardTitle className="text-pretty text-3xl">
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 !pt-0 md:p-8">
              <p className="mb-4 text-muted-foreground">{course.description}</p>
              <div className="mb-4 flex items-center space-x-2">
                <UserAvatar avatarUrl={course.instructor.avatarUrl} />
                <span>{course.instructor.displayName}</span>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <h4 className="inline-flex items-center gap-2 text-xl font-bold">
                    <Grid2X2Icon className="mt-0.5 size-5" /> Category
                  </h4>
                  <p className="text-pretty capitalize">{course.category}</p>
                </div>
                <div>
                  <h4 className="inline-flex items-center gap-2 text-xl font-bold">
                    <ArrowUpRight className="mt-0.5 size-5" /> Level
                  </h4>
                  <p className="text-pretty capitalize">{course.level}</p>
                </div>
                <div>
                  <h4 className="inline-flex items-center gap-2 text-xl font-bold">
                    <ClockIcon className="mt-0.5 size-5" /> Duration
                  </h4>
                  <p className="text-pretty capitalize">
                    {course.duration} minutes
                  </p>
                </div>
                <div>
                  <h4 className="inline-flex items-center gap-2 text-xl font-bold">
                    <Users className="mt-0.5 size-5" /> Enrolled
                  </h4>
                  <p className="text-pretty capitalize">
                    {course.enrollmentCount} students
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="mb-2 inline-flex items-center gap-2 text-xl font-bold">
                  <List className="mt-0.5 size-5" /> Course Content
                </h4>
                <ul className="list-inside list-disc space-y-1">
                  {course.lessons.map((lesson) => (
                    <li key={lesson.id}>{lesson.title}</li>
                  ))}
                  {course.lessons.length === 0 && <li>No lessons found</li>}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <span className="text-sm text-muted-foreground">
                Get the course now for just
              </span>
              <p className="mb-4 text-3xl font-bold">
                ${course.price} / ₹{USDToINR(course.price).toFixed(0)}
              </p>
              <Button className="mb-4 w-full">Enroll Now</Button>
              <div className="mt-2 space-y-4 text-sm">
                <p className="flex flex-col gap-2">
                  <span className="inline-flex items-center gap-2 text-xl font-bold">
                    <ClockIcon className="mt-0.5 size-5" /> Start Date
                  </span>{" "}
                  {course.startDate
                    ? formatDatePretty(course.startDate)
                    : "Flexible"}
                </p>
                <p className="flex flex-col gap-2">
                  <span className="inline-flex items-center gap-2 text-xl font-bold">
                    <ClockIcon className="mt-0.5 size-5" /> End Date
                  </span>{" "}
                  {course.endDate
                    ? formatDatePretty(course.endDate)
                    : "Flexible"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
