import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// Handle GET requests
export async function GET(
    req: NextRequest,
) {
    try {
        const { user } = await validateRequest();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const communityName = req.nextUrl.searchParams.get('communityName');

        if (communityName) {
            // Fetch a specific community by name
            const community = await prisma?.community.findUnique({
                where: { name: communityName },
                include: {
                    members: true,
                    posts: {
                        include: {
                            user: true,
                            _count: {
                                select: { comments: true, likes: true }
                            }
                        }
                    },
                    _count: {
                        select: { members: true, posts: true }
                    },
                    badges: true,
                    moderators: true,
                    roles: true,
                    creator: true,
                },
                cacheStrategy: { ttl: 60 },

            });

            if (!community) {
                return Response.json({ error: "Community not found" }, { status: 404 });
            }

            return Response.json(community);
        } else {
            // Fetch all communities
            const communities = await prisma?.community.findMany({
                include: {
                    _count: {
                        select: { members: true, posts: true }
                    }
                },
                cacheStrategy: { ttl: 60 },

            });

            return Response.json(communities);
        }
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Handle POST requests
export async function POST(req: NextRequest) {
    try {
        const { user } = await validateRequest();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description } = await req.json();

        const community = await prisma?.community.create({
            data: {
                name,
                description,
                creatorId: user.id,
                members: {
                    connect: { id: user.id }
                },
                moderators: {
                    connect: { id: user.id }
                }
            }
        });

        return Response.json(community);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
) {
    try {
        const { user } = await validateRequest();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { communityName } = await req.json();
        await prisma?.community.update({
            where: { name: communityName },
            data: {
                members: {
                    connect: { id: user.id }
                }
            }
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
) {
    try {
        const { user } = await validateRequest();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { communityName } = await req.json();

        await prisma?.community.update({
            where: { name: communityName },
            data: {
                members: {
                    disconnect: { id: user.id }
                }
            }
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}