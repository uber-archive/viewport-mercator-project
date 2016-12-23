import test from 'tape-catch';
import {vec2} from 'gl-matrix';
import {WebMercatorViewport} from '../src';

/* eslint-disable */
const TEST_VIEWPORTS = [
  {
    mapState: {
      width: 793,
      height: 775,
      latitude: 37.751537058389985,
      longitude: -122.42694203247012,
      zoom: 11.5
    }
  },
  {
    mapState: {
      width: 793,
      height: 775,
      latitude: 20.751537058389985,
      longitude: 22.42694203247012,
      zoom: 15.5
    }
  },
  {
    mapState: {
      width: 793,
      height: 775,
      latitude: 50.751537058389985,
      longitude: 42.42694203247012,
      zoom: 15.5,
      bearing: -44.48928121059271,
      pitch: 43.670797287818566
    }
  }
];

test('WebMercatorViewport#imports', t => {
  t.ok(WebMercatorViewport, 'WebMercatorViewport import ok');
  t.end();
});

test('WebMercatorViewport#constructor', t => {
  t.ok(new WebMercatorViewport() instanceof WebMercatorViewport,
    'Created new WebMercatorViewport with default args');
  t.end();
});

test('WebMercatorViewport#constructor - 0 width/height', t => {
  const viewport = new WebMercatorViewport({
    ...TEST_VIEWPORTS.mapState,
    width: 0,
    height: 0
  });
  t.ok(viewport instanceof WebMercatorViewport,
    'WebMercatorViewport constructed successfully with 0 width and height');
  t.end();
});

test('WebMercatorViewport.projectFlat', t => {
  for (const vc of TEST_VIEWPORTS) {
    const viewport = new WebMercatorViewport(vc.mapState);
    for (const tc of TEST_VIEWPORTS) {
      const {mapState} = tc;
      const lnglatIn = [tc.mapState.longitude, tc.mapState.latitude];
      const xy = viewport.projectFlat(lnglatIn);
      const lnglat = viewport.unprojectFlat(xy);
      t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
      t.ok(vec2.equals(lnglatIn, lnglat));
    }
  }
  t.end();
});

test('WebMercatorViewport.project#3D', t => {
  for (const vc of TEST_VIEWPORTS) {
    const viewport = new WebMercatorViewport(vc.mapState);
    for (const tc of TEST_VIEWPORTS) {
      const {mapState} = tc;
      const lnglatIn = [tc.mapState.longitude, tc.mapState.latitude, 0];
      const xyz = viewport.project(lnglatIn);
      const lnglat = viewport.unproject(xyz);
      t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
      t.ok(vec2.equals(lnglatIn, lnglat));
    }
  }
  t.end();
});

// TODO - this is not working at the moment

// test('WebMercatorViewport.project#2D', t => {
//   // Cross check positions
//   for (const vc of TEST_VIEWPORTS) {
//     const viewport = new WebMercatorViewport(vc.mapState);
//     for (const tc of TEST_VIEWPORTS) {
//       const {mapState} = tc;
//       const lnglatIn = [tc.mapState.longitude, tc.mapState.latitude];
//       const xy = viewport.project(lnglatIn);
//       const lnglat = viewport.unproject(xy);
//       t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
//       t.ok(vec2.equals(lnglatIn, lnglat));
//     }
//   }
//   t.end();
// });

test('WebMercatorViewport.getScales', t => {
  for (const vc of TEST_VIEWPORTS) {
    const viewport = new WebMercatorViewport(vc.mapState);
    const distanceScales = viewport.getDistanceScales();
    t.ok(Array.isArray(distanceScales.metersPerPixel), 'metersPerPixel defined');
    t.ok(Array.isArray(distanceScales.pixelsPerMeter), 'pixelsPerMeter defined');
    t.ok(Array.isArray(distanceScales.degreesPerPixel), 'degreesPerPixel defined');
    t.ok(Array.isArray(distanceScales.pixelsPerDegree), 'pixelsPerDegree defined');
  }
  t.end();
});

test('WebMercatorViewport.meterDeltas', t => {
  for (const vc of TEST_VIEWPORTS) {
    const viewport = new WebMercatorViewport(vc.mapState);
    for (const tc of TEST_VIEWPORTS) {
      const {mapState} = tc;
      const coordinate = [tc.mapState.longitude, tc.mapState.latitude, 0];
      const deltaLngLat = viewport.metersToLngLatDelta(coordinate);
      const deltaMeters = viewport.lngLatDeltaToMeters(deltaLngLat);
      t.comment(`Comparing [${deltaMeters}] to [${coordinate}]`);
      t.ok(vec2.equals(deltaMeters, coordinate));
    }
  }
  t.end();
});
