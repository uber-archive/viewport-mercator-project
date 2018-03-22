# What's New

## v5.1
**assert depdendency removed** - No longer imports the "built-in" `assert` module (which added size and caused issues in react-native).
**Size Reduction** - Adds more compact, untranspiled distribution for apps that only need to run on modern browsers. To reduce your final bundle size, add the `esnext` tag to the front of webpack's `resolve.mainField` array and it will pick up the untranspiled distribution.


## v5.0

- **Improved Distance Scales** - Second order polynomial approximations are now available, with significant precision improvement over the previous linear approximations.
- **3D Projection** - `project` and `unproject` methods deal with 3d pixel coordinates (depth).
- **Improved documentation** - This website now matches other frameworks in the [vis.gl](http://vis.gl) framework suite.
- **Primitive Web Mercator Utilities** - A more primitive set of utility functions is now available. Classes here and in other repos like deck.gl use these for increased code sharing and smaller exectables.
- **Size Reduction** - Use [math.gl](https://uber-web.github.io/math.gl/#/documentation/overview) library, which is a smaller dependency than `gl-matrix`.


## v4.1

- **fitBounds**: The `PerspectiveMercatorViewport.fitBounds` method is back.
- **Size Reduction** - Replace gl-matrix dependency with cherry-pick imports

## v4.0

* **Perspective Support** - Adds a new perspective enabled `PerspectiveMercatorViewport` class
* **New method** - `getLocationAtPoint`
* **New method** - `getLngLatFromPos`


## v3 - Beta Releases

v3 was a series of beta only releases while the new API was hammered out. There is no official v3 release.


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

The change was made to support the typical `viewport` object from the new [react-map-gl](github.com/uber/react-map-gl) [API changes](https://gist.github.com/vicapow/00017553e92f613d5361).
