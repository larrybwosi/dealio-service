import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  apiKeyClient,
  customSessionClient,
  organizationClient,
  usernameClient,
} from 'better-auth/client/plugins';
import { auth } from './auth';
import { dodopaymentsClient } from '@dodopayments/better-auth';

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  admin,
  changePassword,
  organization,
  apiKey,
} = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    customSessionClient<typeof auth>(),
    apiKeyClient(),
    dodopaymentsClient(),
    usernameClient(),
    organizationClient(),
  ],
});
