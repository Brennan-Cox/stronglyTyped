import NextAuth, { User } from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User
  }
}

declare module "next-auth" {
  interface User {
    id: string,
    username: string
  }
}
