import test from 'tape-catch';
import {OrthographicViewport} from '../src';

const TEST_DATA = {
  ortho: {
    eye: [10, 10, 10],
    width: 793,
    height: 775
  }
};

test('OrthographicViewport#imports', t => {
  t.ok(OrthographicViewport, 'OrthographicViewport import ok');
  t.end();
});

test('OrthographicViewport#constructor', t => {
  t.ok(new OrthographicViewport(TEST_DATA.orthographic) instanceof OrthographicViewport,
    'Created new OrthographicViewport with test args');
  t.end();
});
