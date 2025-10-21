import { createAuthClient } from 'better-auth/react';
import {
} from 'better-auth/client/plugins';


export const { signIn, signUp, useSession, signOut, changePassword } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: 'include',
    advanced: {
      cookiePrefix: 'dealio',
      useSecureCookies: true,
    },
  },
});
