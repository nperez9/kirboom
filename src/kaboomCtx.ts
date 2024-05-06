import kaboom from 'kaboom';
import { scale } from './constants';

export const k = kaboom({
  // GB resolution but 16:9 aspect ratio
  width: 256 * scale,
  height: 114 * scale,
  letterbox: true,
  global: false,
  scale,
});
