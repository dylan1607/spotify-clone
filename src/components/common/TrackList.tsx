import React from 'react';
import { useRecoilValue } from 'recoil';
import { playlistState } from '~/atoms/playlistAtom';
import { currentTrackIdState } from '~/atoms/trackAtom';
import Track from '~/components/common/Track';

const TrackList = () => {
  const playlist = useRecoilValue<any>(playlistState);
  return (
    <div>
      {playlist?.tracks?.items.map((item: any, i: number) => (
        //key not use id because id is not unique. In playlist, many tracks have same id
        <Track key={i} track={item.track} index={i} />
      ))}
    </div>
  );
};

export default TrackList;
