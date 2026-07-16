import GoogleProvider from "next-auth/providers/google";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: requireEnv('GOOGLE_CLIENT_ID'),
      clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Scopes required to read steps, heart rate, and sleep from Google Fit
          scope: "openid email profile https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.sleep.read"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: requireEnv('NEXTAUTH_SECRET'),
};
