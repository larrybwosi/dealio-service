import { createAuthClient } from 'better-auth/react';
import {
  apiKeyClient,
  customSessionClient,
  usernameClient,
} from 'better-auth/client/plugins';

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  changePassword,
  apiKey,
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    customSessionClient<typeof auth>(),
    apiKeyClient(),
    usernameClient(),
  ],
  fetchOptions:{
    credentials:'include',
  }
});
