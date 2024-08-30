import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = Redis.fromEnv();

const CACHE_TTL = 60; // Cache TTL in seconds
const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a unique cache key
    const cacheKey = `for-you:${user.id}:${cursor || 'initial'}`;

    // Try to get data from Redis cache
    const cachedData = await redis.get<PostsPage>(cacheKey);
    if (cachedData) {
      return Response.json(cachedData);
    }
    if (!prisma) {
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
    // If not in cache, fetch from database
    const posts = await prisma.post.findMany({
      where: {
        communityName: null,
        id: cursor ? { lt: cursor } : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE + 1,
      include: {
        ...getPostDataInclude(user.id),
        user: {
          include: {
            _count: {
              select: {
                posts: true,
                followers: true,
              },
            },
          },
        },
      },
    });

    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: "No posts found." }, { status: 404 });
    }

    const nextCursor = posts.length > PAGE_SIZE ? posts[PAGE_SIZE].id : null;

    // Use double type assertion
    const postsForResponse = posts.slice(0, PAGE_SIZE) as unknown as PostsPage['posts'];

    const data: PostsPage = {
      posts: postsForResponse,
      nextCursor,
    };

    // Cache the result in Redis
    await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL });

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
