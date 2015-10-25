# viewport-mercator-project

Utility for converting to and from latitude and longitude coordinates, given a
map viewport projection. Initially built for use with
[react-map-gl](https://github.com/uber/react-map-gl) but useful for most web mapping
libraries that support floating point zoom levels.

## Example usage

````js
// Create a new viewport.
var ViewportMercator = require('viewport-mercator-project');
// NOTE: `ViewportMercator` objects are immutable by design.
var viewport = ViewportMercator({
  center: [0, 0],
  zoom: 0,
  tileSize: 512,
  dimensions: [600, 800]
});

var lnglat = [0, 0];
var pixels = viewport.project(lnglat); // returns [300, 400]

viewport.unproject(pixels); // returns [0, 0]
````

## Installation

    npm install viewport-mercator-project --save


## To run the tests


    npm run test