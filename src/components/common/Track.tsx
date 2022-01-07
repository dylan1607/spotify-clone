import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '~/atoms/trackAtom';
import useSpotify from '~/hooks/useSpotify';
import { ITrack } from '~/models/interface';
import { millisToMinutesAndSeconds } from '~/utils/time';

const Track = ({ track, index }: ITrack) => {
  const spotifyApi = useSpotify();
  const [trackId, setTrackId] = useRecoilState<string>(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState);
  const playSong = () => {
    setTrackId(track.id);
    setIsPlaying(true);
    //Send api to play song
    // spotifyApi.play({
    //   uris: [track.uri],
    // });
  };

  return (
    <div
      className='grid grid-cols-2 text-gray-500 px-5 py-4
    hover:bg-gray-900 hover:cursor-pointer rounded-lg'
      onClick={playSong}
    >
      <div className='flex items-center space-x-4'>
        <p>{index + 1}</p>
        <img className='w-10 h-10' src={track.album.images[0].url} />
        <div>
          <p className='w-36 lg:w-64 text-white truncate'>{track.name}</p>
          <p className='w-40'>{track.artists[0].name}</p>
        </div>
      </div>
      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <p className='w-40 hidden md:inline'>{track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.duration_ms)} </p>
      </div>
    </div>
  );
};

export default Track;
