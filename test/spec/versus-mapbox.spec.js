import {MapboxTransform} from '../utils/mapbox-transform';

import {WebMercatorViewport} from 'viewport-mercator-project';
import test from 'tape-catch';
import {toLowPrecision} from '../utils/test-utils';
import {equals, config} from 'math.gl';

import VIEWPORT_PROPS from '../utils/sample-viewports';

config.EPSILON = 1e-6;

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
    const viewport = new WebMercatorViewport(viewportProps);
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

    const viewport = new WebMercatorViewport(viewportProps);
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

    const viewport = new WebMercatorViewport(viewportProps);
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
      const viewport = new WebMercatorViewport(viewportProps);
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

      const viewport = new WebMercatorViewport(viewportProps);
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
    const viewport = new WebMercatorViewport(viewportProps);

    for (const {title, lngLat} of TEST_CASES) {
      const projection = viewport.project(lngLat);
      const unprojection = viewport.unproject(projection);

      t.deepEquals(toLowPrecision(unprojection), toLowPrecision(lngLat),
        `unproject(project(${title}, ${viewportName})) - identity operation`);
    }
  }
  t.end();
});

test('WebMercatorViewport.project#3D', t => {
  for (const viewportName in VIEWPORT_PROPS) {
    const viewportProps = VIEWPORT_PROPS[viewportName];
    const viewport = new WebMercatorViewport(viewportProps);

    const transform = new MapboxTransform(viewportProps);

    for (const offset of [0, 0.5, 1.0, 5.0]) {
      const mapState = viewportProps;
      const lnglatIn = [mapState.longitude + offset, mapState.latitude + offset];
      const xyz = viewport.project(lnglatIn);
      const lnglat = viewport.unproject(xyz);
      t.ok(equals(lnglatIn, lnglat), `Project/unproject ${lnglatIn} to ${lnglat}`);

      const lnglatIn3 = [mapState.longitude + offset, mapState.latitude + offset, 0];
      const xyz3m = transform.mapboxProject(lnglatIn3);
      const lnglat3m = transform.mapboxUnproject(xyz3m);
      t.ok(equals(lnglatIn3, lnglat3m),
        `Project/unproject ${lnglatIn3}=>${xyz3m}=>${lnglat3m}`);

      const xyz3 = viewport.project(lnglatIn3);
      const lnglat3 = viewport.unproject(xyz3);
      t.ok(equals(lnglatIn3, lnglat3),
        `Project/unproject ${lnglatIn3}=>${xyz3}=>${lnglat3}`);
    }
  }
  t.end();
});

test('Viewport/Mapbox getLocationAtPoint', t => {
  for (const viewportName in VIEWPORT_PROPS) {
    const viewportProps = VIEWPORT_PROPS[viewportName];
    for (const {title, lngLat} of TEST_CASES) {
      const viewport = new WebMercatorViewport(viewportProps);
      const llp = viewport.getLocationAtPoint({lngLat, pos: [100, 100]});

      const transform = new MapboxTransform(viewportProps);
      const llm = transform.mapboxGetLngLatAtPoint({lngLat, pos: [100, 100]});

      t.deepEquals(toLowPrecision(llp), toLowPrecision(llm),
        `getLocationAtPoint(${title}, ${viewportName})) - viewport/mapbox match`);
    }
  }
  t.end();
});
