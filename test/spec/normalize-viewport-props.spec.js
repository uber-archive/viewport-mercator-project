import test from 'tape-catch';
import {normalizeViewportProps} from 'viewport-mercator-project';
import {toLowPrecision} from '../utils/test-utils';

const NORMALIZATION_TEST_CASES = [
  [
    {
      width: 800,
      height: 600,
      longitude: -200,
      latitude: 0,
      zoom: 0,
      pitch: 60,
      bearing: 200
    },
    {
      width: 800,
      height: 600,
      latitude: 0,
      longitude: 160,
      zoom: 0.22881857712872292,
      bearing: -160,
      pitch: 60
    }
  ],
  [
    {
      width: 1000,
      height: 1000,
      longitude: 80,
      latitude: 80,
      zoom: 0,
      pitch: 0,
      bearing: 0
    },
    {
      width: 1000,
      height: 1000,
      latitude: 7.63333123551244e-14,
      longitude: 80,
      zoom: 0.9657841712949484,
      bearing: 0,
      pitch: 0
    }
  ]
];

test('normalizeViewportProps', (t) => {
  for (const [input, expected] of NORMALIZATION_TEST_CASES) {
    const result = normalizeViewportProps(input);

    t.deepEqual(
      toLowPrecision(result),
      toLowPrecision(expected),
      'correct viewport returned'
    );
  }
  t.end();
});
