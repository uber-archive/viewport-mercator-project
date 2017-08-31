# FlatMercatorViewport

Handles standard 2D web mercator projections and unprojections.


## Example usage

```js
import {FlatMercatorViewport} from 'viewport-mercator-project';

// NOTE: The `viewport` object returned from `FlatMercatorViewport` is immutable.
const viewport = FlatMercatorViewport({
  longitude: 0,
  latitude: 0,
  zoom: 0,
  width: 600,
  height: 500
});

// A longitude, latitude pair as an array.
const lnglat = [0, 0];
const pixels = viewport.project(lnglat); // returns [300, 250]

// A width, height pair as an array.
viewport.unproject(pixels); // returns [0, 0]

// Test if a lnglat is within the viewport
viewport.contains(lnglat); // true
```


## Methods

### constructor

| Parameter     |   Type   | Default | Description                                                |
| ------------- | -------- | ------- | ---------------------------------------------------------- |
| `latitude`    | `Number` | 37      | Center of viewport on map (alternative to center)          |
| `longitude`   | `Number` | -122    | Center of viewport on map (alternative to center)          |
| `zoom`        | `Number` | 11      | Scale = Math.pow(2,zoom) on map (alternative to opt.scale) |
| `width`       | `Number` | 1       | Width of "viewport" or window                              |
| `height`      | `Number` | 1       | Height of "viewport" or window                             |


## Remarks

* The `FlatMercatorViewport` is completely independent of the other classes in this module and is provided as a fast, small, simple solution for applications that only use 2D map projections (and for backwards compatibility with the very first versions of `viewport-mercator-project`.
