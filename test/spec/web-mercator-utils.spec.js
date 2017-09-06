
import test from 'tape-catch';

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

test('Viewport#imports', t => {
  t.ok(projectFlat, 'projectFlat imports OK');
  t.ok(unprojectFlat, 'unprojectFlat imports OK');
  t.ok(getMercatorMeterZoom, 'getMercatorMeterZoom imports OK');
  t.ok(getMercatorDistanceScales, 'getMercatorDistanceScales imports OK');
  t.ok(getMercatorWorldPosition, 'getMercatorWorldPosition imports OK');
  t.ok(makeViewMatricesFromMercatorParams, 'makeViewMatricesFromMercatorParams imports OK');
  t.ok(makeUncenteredViewMatrixFromMercatorParams,
    'makeUncenteredViewMatrixFromMercatorParams imports OK');
  t.ok(makeProjectionMatrixFromMercatorParams, 'makeProjectionMatrixFromMercatorParams imports OK');
  t.ok(getFov, 'getFov imports OK');
  t.ok(getClippingPlanes, 'getClippingPlanes imports OK');
  t.end();
});
