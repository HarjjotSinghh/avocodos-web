import { Suspense } from "react";
import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";
import LearningTab from "./LearningTab";
import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0">
        <Tabs defaultValue="socialize">
          <TabsList className="mb-4 rounded-2xl">
            <TabsTrigger value="socialize" className="rounded-2xl">
              Socialize
            </TabsTrigger>
            <TabsTrigger value="learning" className="rounded-2xl">
              Learning
            </TabsTrigger>
          </TabsList>
          <TabsContent value="socialize" className="rounded-2xl">
            <Tabs defaultValue="for-you">
              <PostEditor />
              <TabsList className="mb-4 mt-2 rounded-2xl">
                <TabsTrigger value="for-you" className="rounded-xl">
                  For you
                </TabsTrigger>
                <TabsTrigger value="following" className="rounded-xl">
                  Following
                </TabsTrigger>
              </TabsList>
              <TabsContent value="for-you">
                <ForYouFeed />
              </TabsContent>
              <TabsContent value="following">
                <FollowingFeed />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="learning">
            <Suspense
              fallback={<Loader2 className="mx-auto my-3 animate-spin" />}
            >
              <LearningTab />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
