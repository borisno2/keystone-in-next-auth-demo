import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
  }
)

export const config = { matcher: ["/admin"] }