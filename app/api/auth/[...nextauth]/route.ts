import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import collection from '../../../../lib/mongo'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // console.log(user);
      const users = await collection('users');
      if (!await users.findOne({ id: user.id })) {
        users.insertOne(user);
      }
      return true;
    }
  }
});

export { handler as GET, handler as POST };
