"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import PostEditor from "@/components/posts/editor/PostEditor";
import CommunityRoles from "@/components/CommunityRoles";
import CommunityBadges from "@/components/CommunityBadges";
import { Community, Post as PrismaPost, User } from "@prisma/client";
import Post from "@/components/posts/Post";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Cog, LogIn, LogOut, Wrench } from "lucide-react";
import CommunityPageSkeleton from "@/components/skeletons/CommunityPageSkeleton";

interface ExtendedPost extends PrismaPost {
  user: {
    id: string;
    createdAt: Date;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    followers: { followerId: string }[];
    _count: { posts: number; followers: number };
  };
  likes: any[];
  bookmarks: any[];
  _count: { likes: number; comments: number };
  attachments: any[];
}

interface ExtendedCommunity extends Community {
  members: User[];
  moderators: User[];
}

export default function CommunityPage({
  communityName
}: {
  communityName: string;
}) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [isModDialogOpen, setIsModDialogOpen] = useState(false);

  const { data: community, isLoading: communityLoading } =
    useQuery<ExtendedCommunity>({
      queryKey: ["community", communityName],
      queryFn: () =>
        kyInstance
          .get(`/api/communities/?communityName=${communityName}`)
          .json<ExtendedCommunity>()
    });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["community-posts", communityName],
    queryFn: () =>
      kyInstance
        .get(`/api/communities/${communityName}/posts`)
        .json<{ posts: ExtendedPost[] }>()
  });

  const joinMutation = useMutation({
    mutationFn: () => kyInstance.post(`/api/communities/${communityName}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", communityName] });
    }
  });

  const leaveMutation = useMutation({
    mutationFn: () =>
      kyInstance.delete(`/api/communities/${communityName}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", communityName] });
    }
  });

  if (communityLoading || postsLoading) return <CommunityPageSkeleton />;

  if (!community)
    return (
      <p className="text-left text-sm text-muted-foreground">
        Community not found
      </p>
    );

  const isMember =
    community.members?.some((member) => member.id === user.id) ?? false;
  const isModerator =
    community.moderators?.some((mod) => mod.id === user.id) ?? false;
  const isCreator = community.creatorId === user.id;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row">
        <div className="mb-4 max-w-full shrink grow-0 md:max-w-[70%]">
          <h1 className="pb-2">{community.name}</h1>
          <p className="whitespace-pre-wrap text-sm leading-[1.6] text-foreground/80">
            {community.description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {isMember ? (
            <Button
              className="min-w-fit"
              onClick={() => leaveMutation.mutate()}
            >
              <LogOut className="-mt-0.5 mr-2 size-4" /> Leave Community
            </Button>
          ) : (
            <Button className="min-w-fit" onClick={() => joinMutation.mutate()}>
              <LogIn className="-mt-0.5 mr-2 size-4" /> Join Community
            </Button>
          )}
          {(isModerator || isCreator) && (
            <Dialog open={isModDialogOpen} onOpenChange={setIsModDialogOpen}>
              <DialogTrigger asChild>
                <Button className="min-w-fit" variant="secondary">
                  <Wrench className="mr-2 size-4" /> Moderation Tools
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-[425px] md:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle className="inline-flex items-center gap-3">
                    <Wrench className="size-8" /> Moderation Tools
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex flex-col gap-2">
                    <CommunityRoles communityName={communityName} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <CommunityBadges communityName={communityName} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {isMember && (
        <PostEditor
          communityName={communityName}
          placeholderText={`Share something with the ${community.name} community!`}
        />
      )}
      <div className="flex flex-col gap-8">
        {posts?.posts ? (
          posts.posts.length > 0 &&
          posts.posts?.map((post) => (
            <Post
              key={post.id}
              post={post}
              canModerate={isModerator || isCreator}
              posterIsTheCreator={post.user.id === community.creatorId}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No posts found</p>
        )}
      </div>
    </div>
  );
}
