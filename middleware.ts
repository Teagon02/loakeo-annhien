import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/api/webhook",
  "/api/webhook(.*)",
  "/api/payos",
  "/api/payos(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const authResult = await auth();
  if (!authResult.userId) {
    return authResult.redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
