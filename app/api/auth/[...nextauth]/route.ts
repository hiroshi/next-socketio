import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { collection } from '../../../../lib/mongo'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log('signin:', { user });
      const User = await collection('users');
      const uid = user.id;
      if (!await User.findOne({ uid })) {
        const newUser = { ...user, uid };
        delete newUser['id'];
        await User.insertOne(newUser);
      }
      return true;
    },
    async session({ session, token, user }) {
      // console.log('session:', { session, token, user });
      // https://stackoverflow.com/a/71721634/338986
      session.user.id = token.sub
      return session;
    },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
