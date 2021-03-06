import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

const useSpotify = () => {
  const { data: session, status }: any = useSession();

  useEffect(() => {
    if (session) {
      // If refesh access token fail, direct user to login
      if (session.error === 'RefeshAccessTokenError') {
        signIn();
      }
      spotifyApi.setAccessToken(session?.user?.accessToken);
    }
  }, [session]);
  return spotifyApi;
};

export default useSpotify;
