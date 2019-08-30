import test from 'tape-catch';
import {fitBounds} from 'viewport-mercator-project';
import {WebMercatorViewport} from 'viewport-mercator-project';
import {toLowPrecision} from '../utils/test-utils';

const FITBOUNDS_TEST_CASES = [
  [
    {
      width: 100,
      height: 100,
      bounds: [[-73.9876, 40.7661], [-72.9876, 41.7661]]
    },
    {
      longitude: -73.48759999999997,
      latitude: 41.26801443944763,
      zoom: 5.723804361273887
    }
  ],
  [
    {
      width: 100,
      height: 100,
      bounds: [[-73.9876, 40.7661], [-73.9876, 40.7661]]
    },
    {
      longitude: -73.9876,
      latitude: 40.7661,
      zoom: 22
    }
  ],
  [
    {
      width: 600,
      height: 400,
      bounds: [[-23.407, 64.863], [-23.406, 64.874]],
      padding: 20,
      offset: [0, -40]
    },
    {
      longitude: -23.406499999999973,
      latitude: 64.86850056273362,
      zoom: 12.89199533073045
    }
  ],
  [
    {
      width: 600,
      height: 400,
      bounds: [[-23.407, 64.863], [-23.406, 64.874]],
      padding: {top: 100, bottom: 10, left: 30, right: 30},
      offset: [0, -40]
    },
    {
      longitude: -23.406499999999973,
      latitude: 64.870857602,
      zoom: 12.476957831
    }
  ]
];

test('fitBounds', (t) => {
  for (const [input, expected] of FITBOUNDS_TEST_CASES) {
    const result = fitBounds(input);

    t.ok(Number.isFinite(result.longitude), 'get valid longitude');
    t.ok(Number.isFinite(result.latitude), 'get valid latitude');
    t.ok(Number.isFinite(result.zoom), 'get valid zoom');
    t.deepEqual(
      toLowPrecision(result),
      toLowPrecision(expected),
      'valid viewport returned'
    );
  }
  t.end();
});

test('WebMercatorViewport.fitBounds', (t) => {
  for (const [input, expected] of FITBOUNDS_TEST_CASES) {
    const viewport = new WebMercatorViewport({
      longitude: -122,
      latitude: 37.7,
      width: input.width,
      height: input.height,
      zoom: 11
    });
    const result = viewport.fitBounds(input.bounds, input);

    t.ok(result instanceof WebMercatorViewport, 'get viewport');
    t.equals(toLowPrecision(result.longitude), toLowPrecision(expected.longitude),
      'get correct longitude');
    t.equals(toLowPrecision(result.latitude), toLowPrecision(expected.latitude),
      'get correct latitude');
    t.equals(toLowPrecision(result.zoom), toLowPrecision(expected.zoom),
      'get correct zoom');
  }
  t.end();
});
