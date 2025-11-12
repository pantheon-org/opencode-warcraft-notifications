import { allianceSounds } from './alliance.js';
import { hordeSounds } from './horde.js';

/**
 * Combined sounds object for backward compatibility
 */
export const sounds = {
  ...allianceSounds,
  ...hordeSounds,
} as const;

export { allianceSounds, hordeSounds };
