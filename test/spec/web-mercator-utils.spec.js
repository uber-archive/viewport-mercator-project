
import test from 'tape-catch';
import distance from '@turf/distance';
import {toLowPrecision} from '../utils/test-utils';

import {
  projectFlat,
  unprojectFlat,
  getMercatorMeterZoom,
  getMercatorDistanceScales,
  getMercatorWorldPosition,
  makeUncenteredViewMatrixFromMercatorParams,
  makeViewMatricesFromMercatorParams,
  makeProjectionMatrixFromMercatorParams,
  getFov,
  getClippingPlanes
} from 'viewport-mercator-project';

import VIEWPORT_PROPS from '../utils/sample-viewports';

const DISTANCE_TOLERANCE = 0.001;

test('Viewport#imports', t => {
  t.ok(projectFlat, 'projectFlat imports OK');
  t.ok(unprojectFlat, 'unprojectFlat imports OK');
  t.ok(getMercatorMeterZoom, 'getMercatorMeterZoom imports OK');
  t.ok(getMercatorWorldPosition, 'getMercatorWorldPosition imports OK');
  t.ok(makeViewMatricesFromMercatorParams, 'makeViewMatricesFromMercatorParams imports OK');
  t.ok(makeUncenteredViewMatrixFromMercatorParams,
    'makeUncenteredViewMatrixFromMercatorParams imports OK');
  t.ok(makeProjectionMatrixFromMercatorParams, 'makeProjectionMatrixFromMercatorParams imports OK');
  t.ok(getFov, 'getFov imports OK');
  t.ok(getClippingPlanes, 'getClippingPlanes imports OK');
  t.end();
});

test('getMercatorDistanceScales', t => {
  for (const vc in VIEWPORT_PROPS) {
    const props = VIEWPORT_PROPS[vc];
    const {longitude, latitude} = props;
    const {
      metersPerPixel, pixelsPerMeter, degreesPerPixel, pixelsPerDegree
    } = getMercatorDistanceScales(props);

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

    for (const delta of [0.001, 0.01, 0.1, 1]) {
      const deltaX = delta * pixelsPerDegree[0] * metersPerPixel[0];
      const deltaY = delta * pixelsPerDegree[1] * metersPerPixel[1];

      // turfjs's distance is in kilometers
      const realDeltaX = distance([longitude, latitude], [longitude + delta, latitude]) * 1000;
      const realDeltaY = distance([longitude, latitude], [longitude, latitude + delta]) * 1000;

      t.ok(Math.abs(realDeltaX - deltaX) / realDeltaX < DISTANCE_TOLERANCE,
        'delta X error is within tolerance');
      t.ok(Math.abs(realDeltaY - deltaY) / realDeltaY < DISTANCE_TOLERANCE,
        'delta Y error is within tolerance');
    }
  }
  t.end();
});
