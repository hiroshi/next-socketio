import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { collection } from '../../../../lib/mongo';

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log('signin:', { user });
      const User = await collection('users');
      const uid = user.id;
      if (!await User.findOne({ uid })) {
        // const newUser = { ...user, uid };
        // delete newUser.id;
        const { id, ...newUser } = { ...user, uid };
        await User.insertOne(newUser);
      }
      return true;
    },
    async session({ session, token, user }) {
      // console.log('session:', { session, token, user });
      // https://stackoverflow.com/a/71721634/338986
      // if (session.user) {
      //   session.user.id = token.sub;
      // }
      // return session;
      const uid = token.sub
      const User = await collection('users');
      const userDoc = await User.findOne({ uid })
      const _id = userDoc._id;

      return { ...session, user: { ...session.user, uid, _id }};
    },
  }
};
export default authOptions;
