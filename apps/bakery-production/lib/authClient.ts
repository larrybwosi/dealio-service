import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  apiKeyClient,
  customSessionClient,
  organizationClient,
  usernameClient,
} from 'better-auth/client/plugins';


export const {
  signIn,
  signUp,
  useSession,
  signOut,
  changePassword,
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    customSessionClient(),
    apiKeyClient(),
    organizationClient(),
  ],
  fetchOptions:{
    credentials:'include',
    // headers
  }
});
