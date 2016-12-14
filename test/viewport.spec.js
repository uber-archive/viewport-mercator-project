import test from 'tape-catch';
import {Viewport, PerspectiveViewport, OrthographicViewport} from '../src';

const TEST_DATA = {
  viewport: {
    view: mat4.create(),
    perspective: mat4.create()
  },
  perspective: {
    eye: [10, 10, 10],
    width: 793,
    height: 775,
  },
  ortho: {
    eye: [10, 10, 10],
    width: 793,
    height: 775
  }
};

test('Viewport#imports', t => {
  t.ok(Viewport, 'Viewport import ok');
  t.ok(PerspectiveViewport, 'PerspectiveViewport import ok');
  t.ok(OrthographicViewport, 'OrthographicViewport import ok');
  t.end();
});

test('Viewport#constructor', t => {
  t.ok(new Viewport() instanceof Viewport,
    'Created new Viewport with default args');
  t.ok(new Viewport(TEST_DATA.viewport) instanceof Viewport,
    'Created new Viewport with test args');
  t.end();
});

test('Viewport#constructor - 0 width/height', t => {
  const viewport = new Viewport({
    ...TEST_DATA.viewport,
    width: 0,
    height: 0
  });
  t.ok(viewport instanceof Viewport,
    'Viewport constructed successfully with 0 width and height');
  t.end();
});

test('PerspectiveViewport#constructor', t => {
  t.ok(new PerspectiveViewport(TEST_DATA.perspective) instanceof PerspectiveViewport,
    'Created new PerspectiveViewport with test args');
  t.end();
});

test('OrthographicViewport#constructor', t => {
  t.ok(new OrthographicViewport(TEST_DATA.orthographic) instanceof OrthographicViewport,
    'Created new OrthographicViewport with test args');
  t.end();
});

/*
test('Viewport.project#2D', t => {
  for (const tc of TEST_DATA) {
    const {mapState} = tc;
    const viewport = new Viewport(mapState);
    const lnglatIn = [tc.mapState.longitude + 5, tc.mapState.latitude + 5];
    const xy = viewport.project(lnglatIn);
    const lnglat = viewport.unproject(xy);
    t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
    t.ok(vec2.equals(lnglatIn, lnglat));
  }
  t.end();
});

test('Viewport.project#3D', t => {
  for (const tc of TEST_DATA) {
    const {mapState} = tc;
    const viewport = new Viewport(mapState);
    const lnglatIn = [tc.mapState.longitude + 5, tc.mapState.latitude + 5, 0];
    const xyz = viewport.project(lnglatIn);
    const lnglat = viewport.unproject(xyz);
    t.comment(`Comparing [${lnglatIn}] to [${lnglat}]`);
    t.ok(vec2.equals(lnglatIn, lnglat));
  }
  t.end();
});
*/
