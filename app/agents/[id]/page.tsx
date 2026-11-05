import ComingSoon from "@/components/ComingSoon";

export default async function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return (
    <ComingSoon
      title="Agent Profile"
      description="Public agent profiles with listings and contact details are on the way."
    />
  );
}
