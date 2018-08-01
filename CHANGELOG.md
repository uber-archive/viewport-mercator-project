# Change Log

### 5.2.1-alpha.1 - Aug 1, 2018
- Add `sideEffects` field to `package.json` to optimize tree-shaking performance.


## 5.2 Release

### 5.2.0
- Upgrade to math.gl@2.0.0

## 5.1 Release

### 5.1.0
- Add esnext dist
- Add test-size-* scripts
- Remove dependeny on external assert
- Bump to math.gl v1.1.0 for esnext dist


## 5.0 Release

### 5.0.1
- Fix bug in `getMeterZoom` where `latitude: 0` throws error

### 5.0.0
- New util `flyToViewport`
- New util `normalizeViewportProps`
- Removed `getUncenteredViewMatrix`
- Renamed `WebMercatorViewport.getLocationAtPoint` to `getMapCenterByLngLatPosition`
- Renamed projection functions: `lngLatToWorld`, `worldToLngLat`, `worldToPixels`, `pixlesToWorld`

### 5.0-alpha.2
- Improve perf of `getDistanceScales`
- Add paramter `highPrecision` to `getDistanceScales` to return extra precision multipliers for `pixelsPerDegree` and `pixelsPerMeter`

### 5.0-alpha.1
- Introduce math.gl
- New utility functions
- Removed `FlatMercatorViewport`
- `PerspectiveMercatorViewport` renamed to `WebMercatorViewport`
- `WebMercatorViewport.project` and `WebMercatorViewport.unproject` handle pixel depth

## 4.0 Minor Releases

### 4.1.1
- Replace gl-matrix dependency with cherry-pick imports

### 4.1.0
- NEW: `PerspectiveMercatorViewport.fitBounds` method

### 4.0.2
- FIX Make mapbox a devDependency instead of a dependency (only used for testing)

### 4.0.1
- FIX getLocationAtPoint

## v4.0.0 Official Release
- Simplificaton
  - Removes non-essential classes from v3 beta (moved to deck.gl)
  - Adopt buble compiler for smaller transpiled code

### v4.0.0-alpha.5 - Another transpilation fix
### v4.0.0-alpha.4 - Revert to babel for all compilation
### v4.0.0-alpha.3 - Fixes `dist/index.js` export
### v4.0.0-alpha.2 - Fixes projection tests, add `getLngLatFromPos`

## v3 (beta only) - Perspective Mode support, WebMercator support optional

Adds a new perspective enabled `WebMercatorViewport` class that inherits
from a "basic" 3D `Viewport` class.

This allows 3D applications to work with familiar `view` and `projection`
matrices provided by the `Viewport` and optionally use the `WebMercatorViewport`
for seamless integration with map components.

This split into two classes makes it easier for applications to reason
about perspective mode and map projections.

```
import WebMercatorViewport from 'viewport-mercator-project/perspective';
var viewport = new WebMercatorViewport({
  latitude,
  longitude,
  zoom,
  pitch,
  bearing,
  altitude
});

const pixel = viewport.project(...);
```

## v2 - Property renaming

* `center` property was broken up into `longitude`, `latitude` properties.
* `dimensions` property was broken up into `width`, and `height` properties.

```js
var viewport = ViewportMercator({
  longitude: 0,
  latitude: 0,
  zoom: 0,
  width: 600,
  height: 800
});
```

Here's what creating a viewport used to look like, prior to `2.0`.

```js
var viewport = ViewportMercator({
  center: [0, 0],
  zoom: 0,
  dimensions: [600, 800]
});
```

The change was made to support the typical `viewport` object from the new
[react-map-gl](github.com/uber/react-map-gl)
[API changes](https://gist.github.com/vicapow/00017553e92f613d5361).
