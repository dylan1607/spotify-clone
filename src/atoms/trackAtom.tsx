import { atom } from 'recoil';

export const currentTrackIdState = atom({
  key: 'currentTrackIdState',
  default: '',
});

//Status playing or pause - boolean
export const isPlayingState = atom({
  key: 'isPlayingState',
  default: false,
});
