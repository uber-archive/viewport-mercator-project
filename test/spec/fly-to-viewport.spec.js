import test from 'tape-catch';
import {flyToViewport} from 'viewport-mercator-project';
import {toLowPrecision} from '../utils/test-utils';

/* eslint-disable max-len */
const TEST_CASES = [
  {
    startProps: {width: 800, height: 600, longitude: -122.45, latitude: 37.78, zoom: 12},
    endProps: {width: 800, height: 600, longitude: -74, latitude: 40.7, zoom: 11},
    t: 0.25,
    expect: {longitude: -122.4017, latitude: 37.78297, zoom: 7.518116}
  },
  {
    startProps: {width: 800, height: 600, longitude: -122.45, latitude: 37.78, zoom: 12},
    endProps: {width: 800, height: 600, longitude: -74, latitude: 40.7, zoom: 11},
    t: 0.5,
    expect: {longitude: -106.3, latitude: 38.76683, zoom: 3.618313}
  },
  {
    startProps: {width: 800, height: 600, longitude: -122.45, latitude: 37.78, zoom: 12},
    endProps: {width: 800, height: 600, longitude: -74, latitude: 40.7, zoom: 11},
    t: 0.75,
    expect: {longitude: -74.19253, latitude: 40.68864, zoom: 6.522422}
  }
];
/* eslint-enable max-len */

test('flyToViewport', t => {

  TEST_CASES
  .forEach(testCase => {
    const propsInTransition = flyToViewport(
      testCase.startProps, testCase.endProps, testCase.t);
    t.deepEqual(toLowPrecision(propsInTransition, 7), testCase.expect, 'interpolated correctly');
  });

  t.end();
});
