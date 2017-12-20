
import test from 'tape-catch';
import destination from '@turf/destination';
import {toLowPrecision} from '../utils/test-utils';

import {
  projectFlat,
  unprojectFlat,
  getMeterZoom,
  getDistanceScales,
  getWorldPosition,
  getUncenteredViewMatrix,
  getViewMatrix,
  getProjectionMatrix
} from 'viewport-mercator-project';

import VIEWPORT_PROPS from '../utils/sample-viewports';

const DISTANCE_TOLERANCE = 0.0005;
const DISTANCE_TOLERANCE_PIXELS = 2;
const DISTANCE_SCALE_TEST_ZOOM = 12;

test('Viewport#imports', t => {
  t.ok(projectFlat, 'projectFlat imports OK');
  t.ok(unprojectFlat, 'unprojectFlat imports OK');
  t.ok(getMeterZoom, 'getMeterZoom imports OK');
  t.ok(getWorldPosition, 'getWorldPosition imports OK');
  t.ok(getViewMatrix, 'getViewMatrix imports OK');
  t.ok(getUncenteredViewMatrix,
    'getUncenteredViewMatrix imports OK');
  t.ok(getProjectionMatrix, 'getProjectionMatrix imports OK');
  t.end();
});

test('getDistanceScales', t => {
  for (const vc in VIEWPORT_PROPS) {
    const props = VIEWPORT_PROPS[vc];
    const {
      metersPerPixel, pixelsPerMeter, degreesPerPixel, pixelsPerDegree
    } = getDistanceScales(props);

    t.deepEqual([
      toLowPrecision(metersPerPixel[0] * pixelsPerMeter[0]),
      toLowPrecision(metersPerPixel[1] * pixelsPerMeter[1]),
      toLowPrecision(metersPerPixel[2] * pixelsPerMeter[2])
    ], [1, 1, 1], 'metersPerPixel checks with pixelsPerMeter');

    t.deepEqual([
      toLowPrecision(degreesPerPixel[0] * pixelsPerDegree[0]),
      toLowPrecision(degreesPerPixel[1] * pixelsPerDegree[1]),
      toLowPrecision(degreesPerPixel[2] * pixelsPerDegree[2])
    ], [1, 1, 1], 'degreesPerPixel checks with pixelsPerDegree');
  }
  t.end();
});

test('getDistanceScales#pixelsPerDegree', t => {
  const scale = Math.pow(2, DISTANCE_SCALE_TEST_ZOOM);

  for (const vc in VIEWPORT_PROPS) {
    t.comment(vc);
    const props = VIEWPORT_PROPS[vc];
    const {longitude, latitude} = props;
    const {pixelsPerDegree} = getDistanceScales({longitude, latitude, scale});

    // Test degree offsets
    for (const delta of [0.001, 0.01, 0.05, 0.1, 0.3]) {
      t.comment(`R = ${delta} degrees`);

      // To pixels
      const deltaX = delta * pixelsPerDegree[0];
      const deltaY = delta * pixelsPerDegree[1];
      const deltaYAdjusted = delta * (pixelsPerDegree[1] + pixelsPerDegree[3] * delta);

      const realDeltaX = projectFlat([longitude + delta, latitude + delta], scale)[0] -
        projectFlat([longitude, latitude], scale)[0];
      // distance([longitude, latitude], [longitude + delta, latitude]) * 1000;
      const realDeltaY = -projectFlat([longitude + delta, latitude + delta], scale)[1] +
        projectFlat([longitude, latitude], scale)[1];
      // distance([longitude, latitude], [longitude, latitude + delta]) * 1000;

      const diffX = getDiff(deltaX, realDeltaX);
      const diffY = getDiff(deltaY, realDeltaY);
      const diffYAdjusted = getDiff(deltaYAdjusted, realDeltaY);

      t.comment(`delta X unadjusted: ${diffX.message}`);
      t.ok(diffX.error < DISTANCE_TOLERANCE &&
        diffX.errorPixels < DISTANCE_TOLERANCE_PIXELS,
        'delta X error within tolerance');

      t.comment(`delta Y unadjusted: ${diffY.message}`);
      t.comment(`delta Y adjusted: ${diffYAdjusted.message}`);
      t.ok(diffYAdjusted.error < DISTANCE_TOLERANCE &&
        diffYAdjusted.errorPixels < DISTANCE_TOLERANCE_PIXELS,
        'delta Y error within tolerance');
    }
  }
  t.end();
});

test('getDistanceScales#pixelsPerMeter', t => {
  const scale = Math.pow(2, DISTANCE_SCALE_TEST_ZOOM);

  for (const vc in VIEWPORT_PROPS) {
    t.comment(vc);
    const props = VIEWPORT_PROPS[vc];
    const {longitude, latitude} = props;
    const {pixelsPerMeter} = getDistanceScales({latitude, longitude, scale});

    // Test degree offsets
    for (const delta of [10, 100, 1000, 5000, 10000, 30000]) {
      t.comment(`R = ${delta} meters`);

      // To pixels
      const deltaX = delta * pixelsPerMeter[0];
      const deltaY = delta * pixelsPerMeter[1];
      const deltaXAdjusted = delta * (pixelsPerMeter[0] + pixelsPerMeter[3] * delta);

      let pt = [longitude, latitude];
      // turf unit is kilometers
      pt = destination(pt, delta / 1000 * Math.sqrt(2), 45);
      pt = pt.geometry.coordinates;

      const realDeltaX = projectFlat(pt, scale)[0] -
        projectFlat([longitude, latitude], scale)[0];
      // distance([longitude, latitude], [longitude + delta, latitude]) * 1000;
      const realDeltaY = -projectFlat(pt, scale)[1] +
        projectFlat([longitude, latitude], scale)[1];
      // distance([longitude, latitude], [longitude, latitude + delta]) * 1000;

      const diffX = getDiff(deltaX, realDeltaX);
      const diffY = getDiff(deltaY, realDeltaY);
      const diffXAdjusted = getDiff(deltaXAdjusted, realDeltaX);

      t.comment(`delta X unadjusted: ${diffX.message}`);
      t.comment(`delta X adjusted: ${diffXAdjusted.message}`);
      t.ok(diffXAdjusted.error < DISTANCE_TOLERANCE &&
        diffXAdjusted.errorPixels < DISTANCE_TOLERANCE_PIXELS,
        'delta X error within tolerance');

      t.comment(`delta Y unadjusted: ${diffY.message}`);
      t.ok(diffY.error < DISTANCE_TOLERANCE &&
        diffY.errorPixels < DISTANCE_TOLERANCE_PIXELS,
        'delta Y error within tolerance');
    }
  }
  t.end();
});

function getDiff(value, baseValue) {
  const errorPixels = Math.abs(value - baseValue);
  const error = errorPixels / Math.min(Math.abs(value), Math.abs(baseValue));

  return {
    errorPixels,
    error,
    message: `off by ${(value - baseValue).toFixed(3)} pixels, ${(error * 100).toFixed(3)}%`
  };
}
