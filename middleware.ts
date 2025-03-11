
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home"
])

const isPublicApiRoute = createRouteMatcher ([
  "/api/videos",

])


export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()
    const currentUrl = new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api") 

    // if the user in logged in and accessing a public route but not the dashboard
    if(userId && isPublicRoute(req) && !isAccessingDashboard) {
      return NextResponse.redirect(new URL("/home", req.url))
    }

    // not loggedin
    if(!userId){

      // if user is not logged in and trying to access a protected route
      if(!isPublicRoute(req) && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in", req.url))
      }

      // if the request is for a protected api and the user is not logged in
      if(isApiRequest && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in", req.url))
      }
    }

    return NextResponse.next()

    const isHomePage = currentUrl.pathname === "/home";

})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)","/","/(api|trpc)(.*)"],
};
export interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: any;
}
