import Ably from 'ably';

// Ensure the API key is accessed safely on the server
const ABLY_API_KEY = process.env.ABLY_API_KEY;

if (!ABLY_API_KEY) {
  throw new Error('Missing ABLY_API_KEY environment variable');
}

/**
 * REST client for server-side operations (e.g., in API routes).
 * This uses the full API key and should only be used on the server.
 */
export const ably = new Ably.Rest({ key: ABLY_API_KEY });

/**
 * Realtime client for client-side operations.
 * This should be used in React components. It relies on an authUrl
 * to securely authenticate clients without exposing the main API key.
 */
export const ablyRealtime = new Ably.Realtime({
  authUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/ably-auth`,
  authMethod: 'POST',
});
