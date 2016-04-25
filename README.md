# viewport-mercator-project

Utility for converting to and from latitude and longitude coordinates, given a
map viewport projection. Initially built for use with
[react-map-gl](https://github.com/uber/react-map-gl) but useful for most web mapping
libraries that support floating point zoom levels.

## Example usage

````js
// Create a new viewport.
var ViewportMercator = require('viewport-mercator-project');
// NOTE: The `viewport` object returned from `ViewportMercator` are immutable by design.

var viewport = ViewportMercator({
  longitude: 0,
  latitude: 0,
  zoom: 0,
  width: 600,
  height: 500
});

// A longitude, latitude pair as an array.
var lnglat = [0, 0];
var pixels = viewport.project(lnglat); // returns [300, 400]

// A width, height pair as an array.
viewport.unproject(pixels); // returns [0, 0]

// Test if a lnglat is within the viewport
viewport.contains(lnglat); // true
````

## Installation

    npm install viewport-mercator-project --save


## To run the tests

    npm run test

## Notes on Projection

The coordinate system of the viewport is defined as a cartesian plane with the origin in the top left,
where the positive x-axis goes right, and the positive y-axis goes down.

That is, the top left corner is `[0, 0]` and the bottom right corner is `[width, height]`.

## Change log

### 2.0.0

`center` property was broken up into `longitude`, `latitude` properties.

`dimensions` property was broken up into `width`, and `height` properties.

Here's what creating a viewport used to look like, prior to `2.0`.

```js
var viewport = ViewportMercator({
  center: [0, 0],
  zoom: 0,
  dimensions: [600, 800]
});
```

The change was made to support the typical `viewport` object from the new [react-map-gl](github.com/uber/react-map-gl) [API changes](https://gist.github.com/vicapow/00017553e92f613d5361).
