import Cache from './cache';
import CACHE_KEYS from './cacheKeys';

const utils = {
  localCache: new Cache('localStorage'),
  sessionCache: new Cache('sessionStorage'),
  CACHE_KEYS,
};
export { utils };
