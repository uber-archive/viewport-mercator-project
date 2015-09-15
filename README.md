# viewport-mercator-project

Utility for converting to and from latitude and longitude coordiantes, given a
map viewport project. Original built to make it easier to create overlays in
[MapboxGL](github.com/mapbox/mapbox-gl-js) but useful for most web mapping
libraries.

## Example usage

````js
var ViewportMercator = require('viewport-mercator-project');
// Create a new viewport. NOTE: Viewports can never be updated. Instead, create
// a new viewport.
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

