import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '../../../utils/spotify';

async function refeshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refeshedToken } = await spotifyApi.refreshAccessToken();
    console.log('Refeshed Token is', refeshedToken);

    return {
      ...token,
      accessToken: refeshedToken.access_token,
      accessTokenExpires: Date.now() + refeshedToken.expires_in * 1000, // convert to milliseconds
      refeshToken: refeshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: 'Error refreshing access token',
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        };
      }
      // Return previous token if it exists
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      // Refresh token
      console.log('Token expires, refreshing...');
      return await refeshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
