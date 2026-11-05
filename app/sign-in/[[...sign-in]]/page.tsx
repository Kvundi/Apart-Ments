import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-6 py-12">
      <SignIn />
    </div>
  );
}
