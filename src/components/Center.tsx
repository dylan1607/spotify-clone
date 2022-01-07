import { ChevronDownIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState, playlistIdState } from '~/atoms/playlistAtom';
import useSpotify from '~/hooks/useSpotify';
import TrackList from '~/components/common/TrackList';

const colors = [
  'from-indigo-500',
  'from-purple-500',
  'from-pink-500',
  'from-red-500',
  'from-orange-500',
  'from-yellow-500',
  'from-green-500',
  'from-blue-500',
  'from-teal-500',
  'from-gray-500',
];

const Center = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession<any>();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlists, setPlaylists] = useRecoilState<any>(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((res: any) => {
          setPlaylists(res.body);
        })
        .catch((err: any) => {
          console.log('Error: ', err);
        });
    }
  }, [playlistId, spotifyApi]);

  console.log(playlists);
  // if (status === 'loading') {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className='flex-grow text-white'>
      <header className='absolute right-8 top-5'>
        <div
          className='flex items-center bg-black space-x-3 cursor-pointer 
        rounded-full p-1 pr-2 hover:opacity-90'
          onClick={() => signOut()}
        >
          <img
            className='h-8 w-8 rounded-full'
            src={session?.user?.image || undefined}
            alt='avatar'
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className='h-5 w-5' />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b 
      to-gray-700 ${color} h-[17rem] text-white p-5`}
      >
        <img
          className='h-45 w-44 shadow-2xl'
          src={playlists?.images?.[0]?.url}
          alt=''
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>
            {playlists?.name}
          </h1>
        </div>
      </section>
      <div className='p-5 h-screen overflow-y-scroll scrollbar-hide'>
        <TrackList />
      </div>
    </div>
  );
};

export default Center;
