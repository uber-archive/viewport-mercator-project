
import test from 'tape-catch';

import {
  projectFlat,
  unprojectFlat,
  calculateDistanceScales,
  getFov,
  getClippingPlanes,
  makeProjectionMatrixFromMercatorParams,
  makeUncenteredViewMatrixFromMercatorParams
} from 'viewport-mercator-project';

test('Viewport#imports', t => {
  t.ok(projectFlat, 'projectFlat imports OK');
  t.ok(unprojectFlat, 'unprojectFlat imports OK');
  t.ok(calculateDistanceScales, 'calculateDistanceScales imports OK');
  t.ok(getFov, 'getFov imports OK');
  t.ok(getClippingPlanes, 'getClippingPlanes imports OK');
  t.ok(makeProjectionMatrixFromMercatorParams, 'makeProjectionMatrixFromMercatorParams imports OK');
  t.ok(makeUncenteredViewMatrixFromMercatorParams,
    'makeUncenteredViewMatrixFromMercatorParams imports OK');
  t.end();
});
