import destination from '@turf/destination';
import {lngLatToWorld, getDistanceScales} from 'viewport-mercator-project';
import test from 'tape-catch';

import VIEWPORT_PROPS from './utils/sample-viewports';

function getDiff(value, baseValue) {
  const errorPixels = value.map((v, i) => Math.abs(v - baseValue[i]));
  const error = value.map(
    (v, i) => Math.abs(v - baseValue[i]) / Math.min(Math.abs(v), Math.abs(baseValue[i]))
  );

  return {
    errorPixels,
    error,
    message: `off by \
      (${errorPixels.map(d => d.toFixed(3)).join(', ')}) pixels, \
      (${error.map(d => `${(d * 100).toFixed(3)}%`).join(', ')})`
  };
}

test('FP32 & Offset Comparison', t => {
  // Explore limits at different scales
  for (let zoom = 1; zoom <= 20; zoom++) {
    const scale = Math.pow(2, zoom);
    t.comment('--------');
    t.comment(`Zoom = ${zoom}, Scale = ${scale}`);

    for (const vc in VIEWPORT_PROPS) {
      t.comment(vc);
      const props = VIEWPORT_PROPS[vc];
      const {longitude, latitude} = props;
      const {pixelsPerMeter, pixelsPerMeter2} = getDistanceScales({
        latitude,
        longitude,
        scale,
        highPrecision: true
      });

      // Test distance from one edge of the viewport to the other
      const delta = Math.pow(2, 20 - zoom) * 50;
      t.comment(`R = ${delta} meters`);

      // To pixels
      const offsetPixelPos = [
        delta * (pixelsPerMeter[0] + pixelsPerMeter2[0] * delta),
        delta * (pixelsPerMeter[1] + pixelsPerMeter2[1] * delta)
      ];

      let point = [longitude, latitude];
      // turf unit is kilometers
      point = destination(point, (delta / 1000) * Math.sqrt(2), 45);
      point = point.geometry.coordinates;

      const realPixelPos = [
        lngLatToWorld(point, scale)[0] - lngLatToWorld([longitude, latitude], scale)[0],
        -(lngLatToWorld(point, scale)[1] - lngLatToWorld([longitude, latitude], scale)[1])
      ];

      const pointFP32 = point.map(f => Math.fround(f));
      const coordsFP32 = [
        lngLatToWorld(pointFP32, scale)[0] - lngLatToWorld([longitude, latitude], scale)[0],
        -(lngLatToWorld(pointFP32, scale)[1] - lngLatToWorld([longitude, latitude], scale)[1])
      ];

      const diff = getDiff(coordsFP32, realPixelPos);
      const diffOffset = getDiff(offsetPixelPos, realPixelPos);

      t.comment(`- Absolute Coordinates FP32: ${diff.message}`);
      t.comment(`- Offset Coordinates: ${diffOffset.message}`);
    }
  }
  t.end();
});
