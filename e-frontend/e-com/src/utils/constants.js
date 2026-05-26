/**
 * App-wide shared constants.
 * Import from here instead of hardcoding values in components.
 */

/** Fallback avatar shown when a user has no profile picture. */
export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

/** Free shipping minimum cart value (INR). Must match backend config/coupons.js. */
export const FREE_SHIPPING_MINIMUM = 0;

/** Standard shipping fee (INR). Must match backend utils/pricing.js. */
export const STANDARD_SHIPPING_FEE = 0;
