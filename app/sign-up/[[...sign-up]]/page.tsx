import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/AuthShell";

export const metadata: Metadata = { title: "Create your account", robots: { index: false } };

export default function SignUpPage() {
  return (
    <AuthShell title="Create your free account">
      <SignUp />
    </AuthShell>
  );
}
