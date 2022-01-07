import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from '~/atoms/trackAtom';
import useSpotify from './useSpotify';

const useTrackInfo = () => {
  const spotifyApi = useSpotify();
  const [trackId, setTrackId] = useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState<any>(null);
  useEffect(() => {
    const getTrackInfo = async () => {
      if (trackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${trackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        setSongInfo(trackInfo);
      }
    };
    getTrackInfo();
  }, [trackId, spotifyApi]);

  return songInfo;
};

export default useTrackInfo;
