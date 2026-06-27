"use client";

import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AuthButtons() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex items-center gap-4">
      {!isSignedIn ? (
        <>
          <SignInButton mode="modal">
            <button className="hover:text-emerald-400 transition px-5 py-2">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-2xl transition">
              Sign Up
            </button>
          </SignUpButton>
        </>
      ) : (
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-9 h-9"
            }
          }}
        />
      )}
    </div>
  );
}