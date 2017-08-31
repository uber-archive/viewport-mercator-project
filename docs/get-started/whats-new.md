# What's New


## v4.2 (In Progress, Release Date TBA)
- Use math.gl library (smaller dependency than gl-matrix + enables some code to be dropped)
- Documentation website matching other frameworks in the same suite.
- Includes a set of primitive web mercator utilities
   - (classes here and in other repos like deck.gl use these for increased code sharing and smaller exectables)


## v4.1
- **fitBounds** is back: `PerspectiveMercatorViewport.fitBounds` method
- Replace gl-matrix dependency with cherry-pick imports


## v4.0

* **Perspective Support**

Adds a new perspective enabled `PerspectiveMercatorViewport` class

* **New methods**
- `getLocationAtPoint`
- `getLngLatFromPos`


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

The change was made to support the typical `viewport` object from the new
[react-map-gl](github.com/uber/react-map-gl)
[API changes](https://gist.github.com/vicapow/00017553e92f613d5361).
