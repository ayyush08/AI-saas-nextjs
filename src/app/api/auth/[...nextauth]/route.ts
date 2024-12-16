import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);//must name it handler 

export {handler as GET, handler as POST} // Get and Post are verbs as per NextAuth docs
