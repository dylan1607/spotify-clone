import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '~/atoms/trackAtom';
import useSpotify from '~/hooks/useSpotify';
import useTrackInfo from '~/hooks/useTrackInfo';
import { debounce } from 'lodash';
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import {
  RewindIcon,
  PlayIcon,
  PauseIcon,
  VolumeUpIcon,
  ReplyIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
} from '@heroicons/react/solid';

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [volume, setVolume] = useState(50);
  const trackInfo: any = useTrackInfo();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  console.log(trackInfo);

  const fetchCurrentTrack = () => {
    if (!trackInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((res: any) => {
        console.log(res);
        setCurrentTrackId(res.body?.item?.id);
        spotifyApi.getMyCurrentPlaybackState().then((res: any) => {
          setIsPlaying(res.body?.is_playing);
        });
      });
    }
  };
  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((res: any) => {
      console.log(res);
      if (res.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };
  const debounceAdjustVolume = useCallback(
    debounce((volume: number) => {
      spotifyApi.setVolume(volume).catch((err: any) => console.log(err));
    }, 500),
    []
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch the current track info
      fetchCurrentTrack();
      setVolume(30);
    }
  }, [currentTrackId, spotifyApi, session]);

  // send request volume api after millis seconds - Debounce
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div
      className='h-24 bg-gradient-to-b from-black to-gray-900 
      text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'
    >
      {/* Left */}
      <div className='flex items-center space-x-4'>
        <img
          className='hidden md:inline h-10 w-10'
          src={trackInfo?.album?.images?.[0]?.url}
          alt=''
        />
        <div>
          <h3>{trackInfo?.name}</h3>
          <p className='text-gray-500 text-xs'>
            {trackInfo?.artists?.[0]?.name}
          </p>
        </div>
        <div>
          <HeartIcon className='button' />
        </div>
      </div>

      {/* Middle */}
      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon className='button' />
        <RewindIcon className='button' />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className='button h-10 w-10' />
        ) : (
          <PlayIcon onClick={handlePlayPause} className='button h-10 w-10' />
        )}

        <FastForwardIcon className='button' />
        <ReplyIcon className='button' />
      </div>

      {/* Right */}
      <div
        className='flex items-center space-x-3 md:space-x-4 justify-end 
      pr-5'
      >
        <VolumeDownIcon
          className='button'
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          type='range'
          value={volume}
          className='w-14 md:w-28'
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className='button'
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
};

export default Player;
