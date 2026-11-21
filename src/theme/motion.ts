import { Platform } from 'react-native';
import { FadeInDown, LinearTransition } from 'react-native-reanimated';

/**
 * Shared animation settings. Reanimated's layout animations follow the phone's
 * "Reduce Motion" setting by default, so guests who turned it off see no movement.
 */

/** Cards slide up and fade in one after another (capped so long lists don't wait). */
export const listItemEntering = (index: number) =>
  FadeInDown.delay(Math.min(index, 8) * 45)
    .duration(320)
    .withInitialValues({ transform: [{ translateY: 14 }] });

/**
 * Remaining items glide into place when one is removed. Native only: on the web,
 * Reanimated's layout transitions mis-measure rows and make them overlap.
 */
export const layoutTransition =
  Platform.OS === 'web' ? undefined : LinearTransition.springify().damping(20).stiffness(180);

/**
 * Use an animation only on iOS/Android. On the web, Reanimated positions elements that
 * have exit or layout animations absolutely, which makes rows in normal lists overlap.
 */
export function nativeOnly<T>(animation: T): T | undefined {
  return Platform.OS === 'web' ? undefined : animation;
}

/** Press-in shrink for cards and buttons. */
export const pressSpring = { damping: 18, stiffness: 320, mass: 0.6 };
export const PRESSED_SCALE = 0.97;
