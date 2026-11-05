import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-6 py-12">
      <SignUp />
    </div>
  );
}
