import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/company-agent/:path*", "/api/company-agent/:path*"],
};
