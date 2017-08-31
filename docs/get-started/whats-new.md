# What's New


## v5.0 (In Progress, Release Date TBA)
- Convert to use math.gl library (smaller dependency than gl-matrix)
- Documentation website matching other frameworks in the same suite.
- Includes a set of primitive mercator utilities (classes here and in other repos like deck.gl use these for increased code sharing and smaller exectable )


## v4.1.0
- NEW: `PerspectiveMercatorViewport.fitBounds` method
- Replace gl-matrix dependency with cherry-pick imports


## v4.0 Official Release
- Simplificaton
  - Removes non-essential classes from v3 beta (moved to deck.gl)
  - Adopt buble compiler for smaller transpiled code
- FIX getLocationAtPoint
- add `getLngLatFromPos`


Perspective Mode support, WebMercator support optional

Adds a new perspective enabled `WebMercatorViewport` class that inherits from a "basic" 3D `Viewport` class.

This allows 3D applications to work with familiar `view` and `projection` matrices provided by the `Viewport` and optionally use the `WebMercatorViewport` for seamless integration with map components.

This split into two classes makes it easier for applications to reason about perspective mode and map projections.

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


## v3 - A series of beta only releases while the new API was hammered out

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
