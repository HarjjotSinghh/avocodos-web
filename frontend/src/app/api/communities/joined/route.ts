import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateRequest } from '@/auth';
import { cache } from 'react';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const CACHE_TTL = 60 * 5; // 5 minutes

async function getCachedJoinedCommunities(username: string) {
    const cacheKey = `user:${username}:joined_communities`;

    const cachedData = await redis.get(cacheKey);
    console.log('Cached Data:', cachedData); // Log cached data for debugging

    if (cachedData) {
        // No need to parse, as Redis client already parses JSON
        return cachedData;
    }

    // Fetch data from the database
    const joinedCommunities = await prisma?.community.findMany({
        where: {
            members: {
                some: {
                    username: username,
                },
            },
        },
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: { members: true },
            },
        },
    });

    // Store the data in Redis without stringifying
    await redis.set(cacheKey, joinedCommunities, { ex: CACHE_TTL });

    return joinedCommunities;
}

export async function GET() {
    try {
        const { user } = await validateRequest();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const joinedCommunities = await getCachedJoinedCommunities(user.username);

        return NextResponse.json(joinedCommunities);
    } catch (error) {
        console.error('Error fetching joined communities:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
