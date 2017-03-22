import {MapboxTransform} from '../utils/mapbox-transform';

import {PerspectiveMercatorViewport} from 'viewport-mercator-project';
import test from 'tape-catch';
import {toLowPrecision} from '../utils/test-utils';

const VIEWPORT_PROPS = {
  flat: {
    latitude: 37.75,
    longitude: -122.43,
    zoom: 11.5,
    bearing: 0,
    width: 800,
    height: 600,
    farZMultiplier: 1
  },
  pitched: {
    latitude: 37.75,
    longitude: -122.43,
    zoom: 11.5,
    pitch: 30,
    bearing: 0,
    width: 800,
    height: 600,
    farZMultiplier: 1
  },
  rotated: {
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 11,
    altitude: 1.5,
    bearing: 180,
    pitch: 60,
    width: 1267,
    height: 400,
    farZMultiplier: 1
  }
};

const TEST_CASES = [
  {
    title: '(center)',
    lngLat: [-122.43, 37.75],
    screen: [400, 300]
  },
  {
    title: '(corner)',
    lngLat: [-122.55, 37.83],
    screen: [-1.329741801625046, 6.796120915775314]
  }
];

test('Mapbox project/unproject', t => {
  for (const viewportName in VIEWPORT_PROPS) {
    const viewportProps = VIEWPORT_PROPS[viewportName];

    for (const {title, lngLat} of TEST_CASES) {
      const transform = new MapboxTransform(viewportProps);
      const mapboxProjection = transform.mapboxProject(lngLat);
      const mapboxUnprojection = transform.mapboxUnproject(mapboxProjection);
      t.deepEquals(toLowPrecision(mapboxUnprojection), toLowPrecision(lngLat),
        `unproject(project(${title}, ${viewportName})) - identity operation`);
    }
  }
  t.end();
});

test('Viewport constructor', t => {
  for (const viewportName in VIEWPORT_PROPS) {
    const viewportProps = VIEWPORT_PROPS[viewportName];
    const viewport = new PerspectiveMercatorViewport(viewportProps);
    t.ok(viewport, 'Viewport construction successful');

    const viewportState = {};
    Object.keys(viewportProps).forEach(key => {
      viewportState[key] = viewport[key];
    });

    const props = Object.assign({}, viewportProps);

    delete viewportState.farZMultiplier;
    delete props.farZMultiplier;

    t.deepEquals(viewportState, props, `Viewport props assigned ${viewportName}`);
  }
  t.end();
});

test('Viewport vs. Mapbox unprojectFlat', t => {
  for (const viewportName in VIEWPORT_PROPS) {
    const viewportProps = VIEWPORT_PROPS[viewportName];

    const viewport = new PerspectiveMercatorViewport(viewportProps);
    const unprojection = viewport.unprojectFlat([587, 107]);

    const transform = new MapboxTransform(viewportProps);
    const mapboxUnprojection = transform.mapboxUnprojectFlat([587, 107]);

    t.deepEquals(toLowPrecision(unprojection), toLowPrecision(mapboxUnprojection),
      `unproject(${viewportName}) - viewport/mapbox match`);
  }
  t.end();
});

test('Viewport vs Mapbox matrices', t => {
  for (const viewportName in VIEWPORT_PROPS) {
    const viewportProps = VIEWPORT_PROPS[viewportName];

    const viewport = new PerspectiveMercatorViewport(viewportProps);
    const transform = new MapboxTransform(viewportProps);

    const viewportProjMatrix = viewport.viewProjectionMatrix;
    const mapboxProjMatrix = transform.projMatrix;

    t.deepEquals(toLowPrecision(viewportProjMatrix), toLowPrecision(mapboxProjMatrix),
      `projection matrices for ${viewportName} - viewport/mapbox match`);

    const viewportPixelMatrix = viewport.pixelProjectionMatrix;
    const mapboxPixelMatrix = transform.pixelMatrix;

    t.deepEquals(toLowPrecision(viewportPixelMatrix), toLowPrecision(mapboxPixelMatrix),
      `pixel matrices for ${viewportName} - viewport/mapbox match`);
  }
  t.end();
});

test('Viewport vs Mapbox project', t => {
  for (const viewportName in VIEWPORT_PROPS) {
    const viewportProps = VIEWPORT_PROPS[viewportName];

    for (const {title, lngLat} of TEST_CASES) {
      const viewport = new PerspectiveMercatorViewport(viewportProps);
      const projection = viewport.project(lngLat, {topLeft: false});

      const transform = new MapboxTransform(viewportProps);
      const mapboxProjection = transform.mapboxProject(lngLat);

      t.deepEquals(toLowPrecision(projection), toLowPrecision(mapboxProjection),
        `unproject(${title}, ${viewportName}) - viewport/mapbox match`);
    }
  }
  t.end();
});

test('Viewport vs Mapbox unproject', t => {
  for (const viewportName in VIEWPORT_PROPS) {
    const viewportProps = VIEWPORT_PROPS[viewportName];

    for (const {title, lngLat} of TEST_CASES) {
      const transform = new MapboxTransform(viewportProps);
      const mapboxProjection = transform.mapboxProject(lngLat);

      const viewport = new PerspectiveMercatorViewport(viewportProps);
      const unprojection = viewport.unproject(mapboxProjection, {topLeft: false});

      t.deepEquals(toLowPrecision(unprojection), toLowPrecision(lngLat),
        `unproject(${title}, ${viewportName}) - viewport/mapbox match`);
    }
  }
  t.end();
});

test('Viewport project/unproject', t => {
  for (const viewportName in VIEWPORT_PROPS) {
    const viewportProps = VIEWPORT_PROPS[viewportName];
    const viewport = new PerspectiveMercatorViewport(viewportProps);

    for (const {title, lngLat} of TEST_CASES) {
      const projection = viewport.project(lngLat);
      const unprojection = viewport.unproject(projection);

      t.deepEquals(toLowPrecision(unprojection), toLowPrecision(lngLat),
        `unproject(project(${title}, ${viewportName})) - identity operation`);
    }
  }
  t.end();
});
