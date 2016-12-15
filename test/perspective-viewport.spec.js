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

test('PerspectiveViewport#imports', t => {
  t.ok(PerspectiveViewport, 'PerspectiveViewport import ok');
  t.end();
});

test('PerspectiveViewport#constructor', t => {
  t.ok(new PerspectiveViewport(TEST_DATA.perspective) instanceof PerspectiveViewport,
    'Created new PerspectiveViewport with test args');
  t.end();
});
