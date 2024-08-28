import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CoursesPage } from "@/lib/types";
import { NextRequest } from "next/server";
import { courseSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
    try {
        const { user } = await validateRequest();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = courseSchema.parse(body);

        const newCourse = await prisma.course.create({
            data: {
                ...validatedData,
                startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
                instructorId: user.id,
            },
        });

        return Response.json(newCourse, { status: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
        const pageSize = 10;

        const { user } = await validateRequest();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const courses = await prisma.course.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
            take: pageSize + 1,
            cursor: cursor ? { id: cursor } : undefined,
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                imageUrl: true,
                instructorId: true,
                category: true,
                level: true,
                duration: true,
                enrollmentCount: true,
                rating: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
                instructor: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        const mappedCourses = courses.map(({ instructor, ...course }) => ({
            ...course,
            instructor: {
                id: instructor.id,
                username: instructor.username,
                displayName: instructor.displayName,
                avatarUrl: instructor.avatarUrl,
            },
            startDate: null,
            endDate: null,
        }));

        const nextCursor = courses.length > pageSize ? courses[pageSize].id : null;

        const data: CoursesPage = {
            courses: mappedCourses.slice(0, pageSize),
            nextCursor,
        };
        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}