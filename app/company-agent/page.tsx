import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import CompanyStrategyWorkspace from "@/components/CompanyStrategyWorkspace";

export const metadata: Metadata = {
  title: "Company strategy workspace",
  robots: { index: false, follow: false },
};

export default async function CompanyAgentPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Fcompany-agent");

  const allowedUserId = process.env.COMPANY_AGENT_USER_ID;
  if (allowedUserId && userId !== allowedUserId) notFound();

  return <CompanyStrategyWorkspace />;
}
