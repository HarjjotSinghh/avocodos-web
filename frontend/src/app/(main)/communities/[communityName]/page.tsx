import CommunityPage from "./CommunityPage";

export default function Community({
  params: { communityName }
}: {
  params: { communityName: string };
}) {
  return <CommunityPage communityName={communityName} />;
}
