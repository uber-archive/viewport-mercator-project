import test from 'tape-catch';
import {flyToViewport, getFlyToLength} from 'viewport-mercator-project';
import {toLowPrecision} from '../utils/test-utils';

/* eslint-disable max-len */
const START_PROPS = {width: 800, height: 600, longitude: -122.45, latitude: 37.78, zoom: 12};
const END_PROPS = {width: 800, height: 600, longitude: -74, latitude: 40.7, zoom: 11};
/* eslint-enable max-len */

const FLY_TO_TEST_CASES = [
  {
    startProps: START_PROPS,
    endProps: END_PROPS,
    t: 0.25,
    expect: {longitude: -122.4017, latitude: 37.78297, zoom: 7.518116}
  },
  {
    startProps: START_PROPS,
    endProps: END_PROPS,
    t: 0.5,
    expect: {longitude: -106.3, latitude: 38.76683, zoom: 3.618313}
  },
  {
    startProps: START_PROPS,
    endProps: END_PROPS,
    t: 0.75,
    expect: {longitude: -74.19253, latitude: 40.68864, zoom: 6.522422}
  }
];

const LENGTH_TEST_CASES = [
  {
    startProps: START_PROPS,
    endProps: END_PROPS,
    expect: 8.7909532
  },
  {
    // length to a neary by view state
    startProps: START_PROPS,
    endProps: Object.assign({}, START_PROPS, {longitude: START_PROPS.longitude + 0.005}),
    expect: 0.051470808
  }
];

test('flyToViewport', t => {

  FLY_TO_TEST_CASES
  .forEach(testCase => {
    const propsInTransition = flyToViewport(
      testCase.startProps, testCase.endProps, testCase.t);
    t.deepEqual(toLowPrecision(propsInTransition, 7), testCase.expect, 'interpolated correctly');
  });

  t.end();
});

test('getFlyToLength', t => {

  LENGTH_TEST_CASES
  .forEach(testCase => {
    const length = getFlyToLength(testCase.startProps, testCase.endProps);
    t.deepEqual(toLowPrecision(length, 8), testCase.expect, 'should get correct duration');
  });

  t.end();
});
