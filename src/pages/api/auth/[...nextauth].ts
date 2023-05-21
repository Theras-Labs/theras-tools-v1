import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
// import EmailProvider from "next-auth/providers/email"
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";
// import { db } from "../../../../firebase.config";
import { setSession } from "next-auth/client";
// import * as firestoreFunctions from "firebase/firestore";

export const authOptions: NextAuthOptions = {
  // // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID as any,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET as any,
    // }),
    // AppleProvider({
    //   clientId: process.env.GITHUB_ID as any,
    //   clientSecret: process.env.GITHUB_SECRET as any,
    // }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as any,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET as any,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // theme: {
  //   colorScheme: "light",
  // },
  // callbacks: {
  //   async jwt({ token }) {
  //     token.userRole = "admin";
  //     return token;
  //   },

  // },
  // callbacks: {
  // async jwt(token, user, account, profile, isNewUser) {
  //   console.log("Session:", user, account, profile, isNewUser);

  //   if (user) {
  //     // Store the Firebase UID in the JWT token
  //     token.uid = user.uid;
  //   }

  //   return token;
  // },

  // async signIn(user, account, profile) {
  //   console.log("signIn:", user, account, profile);

  //   const email = user.email;
  //   const userDoc = await db.collection("users").doc(user.uid).get();
  //   if (!userDoc.exists) {
  //     // Create a new user document if it doesn't exist
  //     await db.collection("users").doc(user.uid).set({
  //       email: email,
  //       createdAt: new Date(),
  //     });
  //   }
  //   return true;
  // },

  // async session(session, token) {
  //   console.log("session:", session, token);

  //   // Add the Firebase UID to the session object
  //   session.user.uid = token.uid;

  //   return session;
  // },
  // },
  // adapter: FirestoreAdapter(db),
  ////////////////////////////////////////////////////////////////////////////
  // callbacks: {
  //   async session(session, user) {
  //     // Add properties to the session object, for example:
  //     console.log(session, user, "CHECKER");

  //     // Set the cookie options
  //     const cookieOpts = {
  //       maxAge: 30 * 24 * 60 * 60, // 30 days
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "lax",
  //     };

  //     // Set the cookie
  //     await NextAuth?.setSession({ ...session, ...user }, cookieOpts);

  //     return session;
  //   },
  // },
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
        ? process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/gm, "\n")
        : undefined,
    }),
  }),
};

export default NextAuth(authOptions);
