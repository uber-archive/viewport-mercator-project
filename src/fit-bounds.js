import WebMercatorViewport from './web-mercator-viewport';
import assert from 'assert';

/**
 * * An object describing the padding to add to the bounds.
 * @typedef {Object} PaddingObject
 * @property {Number} top - Padding from top in pixels to add to the given bounds
 * @property {Number} bottom - Padding from bottom in pixels to add to the given bounds
 * @property {Number} left - Padding from left in pixels to add to the given bounds
 * @property {Number} right - Padding from right in pixels to add to the given bounds
 */

/**
 * Returns map settings {latitude, longitude, zoom}
 * that will contain the provided corners within the provided width.
 * Only supports non-perspective mode.
 * @param {Number} width - viewport width
 * @param {Number} height - viewport height
 * @param {Array} bounds - [[lon, lat], [lon, lat]]
 * @param {Number|PaddingObject} [padding] - The amount of padding in pixels
 *  to add to the given bounds. Can also be an object with top, bottom, left and right
 *  properties defining the padding.
 * @param {Array} [offset] - The center of the given bounds relative to the map's center,
 *    [x, y] measured in pixels.
 * @returns {Object} - latitude, longitude and zoom
 */
export default function fitBounds({
  width,
  height,
  bounds,
  // options
  padding = 0,
  offset = [0, 0]
}) {
  const [[west, south], [east, north]] = bounds;

  if (Number.isFinite(padding)) {
    const p = padding;
    padding = {
      top: p,
      bottom: p,
      left: p,
      right: p
    };
  } else {
    // Make sure all the required properties are set
    assert(Number.isFinite(padding.top) &&
      Number.isFinite(padding.bottom) &&
      Number.isFinite(padding.left) &&
      Number.isFinite(padding.right)
    );
  }
  // Find how much we need to shift the center
  const verticalOffset = (padding.top - padding.bottom) / 2;
  const lateralOffset = (padding.left - padding.right) / 2;

  const viewport = new WebMercatorViewport({
    width,
    height,
    longitude: 0,
    latitude: 0,
    zoom: 0
  });

  const nw = viewport.project([west, north]);
  const se = viewport.project([east, south]);
  const size = [
    Math.abs(se[0] - nw[0]),
    Math.abs(se[1] - nw[1])
  ];
  const center = [
    (se[0] + nw[0]) / 2 + lateralOffset,
    (se[1] + nw[1]) / 2 + verticalOffset
  ];

  const scaleX = (width - padding.left - padding.right - Math.abs(offset[0]) * 2) / size[0];
  const scaleY = (height - padding.top - padding.bottom - Math.abs(offset[1]) * 2) / size[1];

  const centerLngLat = viewport.unproject(center);
  const zoom = viewport.zoom + Math.log2(Math.abs(Math.min(scaleX, scaleY)));

  return {
    longitude: centerLngLat[0],
    latitude: centerLngLat[1],
    zoom
  };
}
