import SpotifyWebApi from 'spotify-web-api-node';

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'streaming',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-top-read',
  //   'user-library-modify',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-follow-read',
].join(',');

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);

export const LOGIN_URL =
  'https://accounts.spotify.com/authorize?' + queryParamString.toString();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

export default spotifyApi;
