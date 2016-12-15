import test from 'tape-catch';
import {vec2} from 'gl-matrix';
import {WebMercatorViewport, COORDINATE_SYSTEM} from '../src';

/* eslint-disable */
const TEST_DATA = [
  {
    mapState: {
      width: 793,
      height: 775,
      latitude: 37.751537058389985,
      longitude: -122.42694203247012,
      zoom: 11.5,
      bearing: -44.48928121059271,
      pitch: 43.670797287818566
      // altitude: undefined
    }
  },
  {
    mapState: {
      width: 793,
      height: 775,
      latitude: 20.751537058389985,
      longitude: 22.42694203247012,
      zoom: 15.5,
      bearing: -44.48928121059271,
      pitch: 43.670797287818566
      // altitude: undefined
    }
  }
];

test('WebMercatorViewport#imports', t => {
  t.ok(WebMercatorViewport, 'WebMercatorViewport import ok');
  t.ok(COORDINATE_SYSTEM, 'COORDINATE_SYSTEM import ok');
  t.end();
});

test('WebMercatorViewport#constructor', t => {
  t.ok(new WebMercatorViewport() instanceof WebMercatorViewport,
    'Created new WebMercatorViewport with default args');
  t.end();
});

test('WebMercatorViewport#constructor - 0 width/height', t => {
  const viewport = new WebMercatorViewport({
    ...TEST_DATA.mapState,
    width: 0,
    height: 0
  });
  t.ok(viewport instanceof WebMercatorViewport,
    'WebMercatorViewport constructed successfully with 0 width and height');
  t.end();
});

// test('WebMercatorViewport.projectFlat', t => {
//   for (const tc of TEST_DATA) {
//     const {mapState} = tc;
//     const viewport = new WebMercatorViewport(mapState);
//     const lnglatIn = [tc.mapState.longitude, tc.mapState.latitude];
//     const xy = viewport.projectFlat(lnglatIn);
//     const lnglat = viewport.unprojectFlat(xy);
//     t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
//     t.ok(vec2.equals(lnglatIn, lnglat));
//   }
//   t.end();
// });

test('WebMercatorViewport.project#2D', t => {
  for (const tc of TEST_DATA) {
    const {mapState} = tc;
    const viewport = new WebMercatorViewport(mapState);
    const lnglatIn = [tc.mapState.longitude, tc.mapState.latitude];
    const xy = viewport.project(lnglatIn);
    const lnglat = viewport.unproject(xy);
    t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
    t.ok(vec2.equals(lnglatIn, lnglat));
  }
  t.end();
});

test('WebMercatorViewport.project#3D', t => {
  for (const tc of TEST_DATA) {
    const {mapState} = tc;
    const viewport = new WebMercatorViewport(mapState);
    const lnglatIn = [tc.mapState.longitude + 5, tc.mapState.latitude + 5, 0];
    const xyz = viewport.project(lnglatIn);
    const lnglat = viewport.unproject(xyz);
    t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
    t.ok(vec2.equals(lnglatIn, lnglat));
  }
  t.end();
});
