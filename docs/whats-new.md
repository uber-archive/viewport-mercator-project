# What's New

## v5.1
- **Size Reduction**: Adds a more compact, minimally transpiled distribution for apps that only need to run on modern browsers. To reduce your final bundle size, add the `esnext` tag to the front of webpack's `resolve.mainField` array and it will pick up the untranspiled distribution.
- **assert removed** - No longer imports the "built-in" `assert` module (this can reduce bundle size and avoids issues in react-native).


## v5.0
- **Documentation Refresh** - This website now matches other frameworks in the [vis.gl](http://vis.gl) framework suite.
- **3D Projection** - The `project` and `unproject` methods now deal with 3D pixel coordinates (depth).
- **Primitive Web Mercator Utilities** - The code used by the `WebMercatorViewport` has been componentized and exposed as a set of utility functions, enabling more use cases and code sharing.
- **Size Reduction**: Switch to use the [math.gl](https://uber-web.github.io/math.gl/#/documentation/overview) library (smaller dependency than gl-matrix + enabled some code to be dropped)


## v4.1
- **fitBounds** is back: See the `PerspectiveMercatorViewport.fitBounds` method
- **Size Reduction**: Replace gl-matrix dependency with cherry-pick imports


## v4.0

* **Perspective Support**

Adds a new perspective enabled `PerspectiveMercatorViewport` class

* **New methods**
- `getLocationAtPoint`
- `getLngLatFromPos`


## v3 - Beta Releases

* **Beta only** - v3 was a series of beta only releases while the new API was hammered out. There is no official v3 release.


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
