function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * @param {object} bounds An object with bounds data for the waypoint and
 *   scrollable parent
 * @return {integer} The current scroll progress of the Waypoint inside of its
 *  scrollable parent
 */
export default function getCurrentProgress({
  viewportBottom,
  viewportTop,
  waypointBottom,
  waypointTop,
}) {
  const viewportHeight = viewportBottom - viewportTop || 1;
  const waypointHeight = waypointBottom - waypointTop || 1;
  const distance = viewportHeight + waypointHeight;
  const traveled = waypointBottom - viewportTop;
  const progress = 1 - clamp(traveled / distance, 0, 1);
  return progress;
}
