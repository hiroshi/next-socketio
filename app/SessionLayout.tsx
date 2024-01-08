'use client'

import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

function CurrentUser() {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <>
        <img src={ session?.user?.image || undefined } width="32" />
        {session?.user?.email}<br/>
        <button onClick={ () => signOut() }>Sign out</button>
      </>
    );
  } else {
    return (
      <>
        <button onClick={ () => signIn() }>Sign in</button>
      </>
    );
  }
}

export default function SessionLayout({ children }) {
  return (
    <SessionProvider>
      <CurrentUser />
      <hr/>
      { children }
    </SessionProvider>
  );
}
