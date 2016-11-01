# viewport-mercator-project

Utility for converting to and from latitude and longitude coordinates, given a
map viewport projection.

Specifically built for use with [deck.gl](https://github.com/uber/deck-gl)
and [react-map-gl](https://github.com/uber/react-map-gl),
but useful for most web mapping application that support floating point
zoom levels.

## Example usage

````js
// Create a new viewport.
var ViewportMercator = require('viewport-mercator-project');
// NOTE: The `viewport` object returned from `ViewportMercator` is immutable by design.

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
```
npm install viewport-mercator-project --save
```

## To run the tests
```
npm run test
```

## Notes on Projection

The coordinate system of the viewport is defined as a cartesian plane with
the origin in the top left, where the positive x-axis goes right, and the
positive y-axis goes down.

That is, the top left corner is `[0, 0]` and the bottom right corner is
`[width, height]`.

Unless otherwise noted, angles are specified in degrees, not radians.

Coordinates are specified in "long-lat" format [lng, lat, z] format which
most closely corresponds to [x, y, z] coords.


## Perspective Viewport and Coordinate Systems

A Viewport can be configured to work with positions specified in
different units.

### Projection Modes

- **longitude/latitude/altitude** (`LNGLAT`) -
  positions are interpreted as Web Mercator coordinates:
  [longitude, latitude, altitude]. Longitude and latitude
  are specified in degrees from Greenwich meridian / equator respectively,
  and altitude is specified in meters above sea level.
- **meter offsets** (`METERS`) -
  positions are given in meter offsets from a reference point
  that is specified separately.

The perspective viewport can also supports working in a standard
(i.e. unprojected) linear coordinate system although the support for
specifying scales and extents is still rudimentary
(this will be improved in future versions).


## About the mercator projection

### Distances

Note that that distance scales are latitude dependent under
web mercator projection
[see](http://wiki.openstreetmap.org/wiki/Zoom_levels),
so scaling will depend on the viewport center and any linear scale factor
should only be expected to be locally correct.


## Coordinate System concepts

To be able to provide seamless support for the Web Mercator projection,
PerspectiveViewport works with two concepts:
- **positions** - represent points on the map. In web mercator mode
  position coordinates are specified in degrees longitude followed by degrees
  latitude.
  In linear mode, positions are simply world coordinates, [x, y, z].
- **distances** - distances represent either the distance between two points,
  or just a general sizes, like a radius or similar. Distances are specified in
  meters in mercator mode, and simply in world coordinate deltas in
  linear mode).

As a user, you should mainly make sure to scan a layer defintion to
make sure you understand where you are expect to pass in [lng, lat]
coordinates.


## Map Changes
- **center**:
- **zoom**: At zoom 0, the world is 512 pixels wide.
  Every zoom level magnifies by a factor of 2. Maps typically support zoom
  levels 0 (world) to 20 (sub meter pixels).


## Linear Coordinate System

In this mode, which does not offer any synchronization with maps, the
application specifies its world size (the number of pixels that the world
occupies

At zoom 0, one world unit represents one pixel unit.
deck.gl can create a projection matrix from zoom level and center,
(as well as pitch, bearing and altiude), to move around in the map.
The interaction layer handles this by default.

You can of course supply your own projectionMatrix and scaling uniforms
to deck.gl.


## Making a vertex shader work with deck.gl's coordinate systems.

A family of GLSL projection methods that support three different projection
modes, latlon (default), meters and neutral. By always using three shader
functions (preproject, scale and project) for handling projections and scaling,
a single layer class can support all three modes (app selects via a layer prop).

The new meters mode is perfect for high resolution data sets
which are typically specified in sets of coordinates in meters offset from
a single lat/lon (“simplified UTM”). Such data can now be supplied directly
to deck.gl layers (i.e. to the GPU) without any JavaScript transformation.

A great side effect is that the new meters projection mode uses small numeric
deltas in projection and therefore does not lose precision under extreme zoom
levels even when using faster 32 bit floating point.

Note that our new 64 bit floating point library is still the general solution
to handling extreme zoom. For lat/lon projection under high zoom levels FP64
is still necessary.

A number of layers have been forked and rewritten to support meters projection.
Expect to fold these back into deck.gl before releasing v3.


Manages coordinate system transformations.

## Viewport Constructor

| Parameter | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| mercator | Boolean | true | Whether to use mercator projection |
| opt.width | Number | 1 | Width of "viewport" or window |
| opt.height | Number | 1 | Height of "viewport" or window |
| opt.center | Array | [0, 0] | Center of viewport [longitude, latitude] or [x, y] |
| opt.scale=1 | Number | | Either use scale or zoom |
| opt.pitch=0 | Number | | Camera angle in degrees (0 is straight down) |
| opt.bearing=0 | Number | | Map rotation in degrees (0 means north is up) |
| opt.altitude= | Number | | Altitude of camera in screen units |

Web mercator projection short-hand parameters

| Parameter | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| opt.latitude | Number | | Center of viewport on map (alternative to opt.center) |
| opt.longitude | Number | | Center of viewport on map (alternative to opt.center) |
| opt.zoom | Number | | Scale = Math.pow(2,zoom) on map (alternative to opt.scale) |

Notes:
 - Only one of center or [latitude, longitude] can be specified
 - [latitude, longitude] can only be specified when "mercator" is true
 - Altitude has a default value that matches assumptions in mapbox-gl
 - width and height are forced to 1 if supplied as 0, to avoid
   division by zero. This is intended to reduce the burden of apps to
   to check values before instantiating a Viewport.
-  When using mercatorProjection, per cartographic tradition, longitudes and
   latitudes are specified as degrees.

## Viewport.project

Projects latitude and longitude to pixel coordinates in window
using viewport projection parameters
- [longitude, latitude] to [x, y]
- [longitude, latitude, Z] => [x, y, z]
Note: By default, returns top-left coordinates for canvas/SVG type render

- lngLatZ - Array - [lng, lat] or [lng, lat, Z]
- opts.topLeft - Object - true - Whether projected coords are top left
- returns [x, y] or [x, y, z] in top left coords

## Viewport.unproject

Unproject pixel coordinates on screen onto [lon, lat] on map.
- [x, y] => [lng, lat]
- [x, y, z] => [lng, lat, Z]

- xyz - Array
returns
- object with {lat,lon} of point on sphere.




// We define a couple of coordinate systems:
// ------
// LatLon                      [lng, lat] = [-180 - 180, -81 - 81]
// Mercator World (zoom 0)     [x, y] = [0-512, y: 0-512]
// Mercator Zoomed (zoom N)    [x, y] = [0 - 512*2**N, 0 - 512*2**N]
// Translated                  [x, y] = zero centered
// Clip Space                  unit cube around view
// ------

### constructor

Manages coordinate system transformations for deck.gl.

Note: The Viewport is immutable in the sense that it only has accessors.
A new viewport instance should be created if any parameters have changed.

@class
@param {Object} opt - options
@param {Boolean} mercator=true - Whether to use mercator projection

@param {Number} opt.width=1 - Width of "viewport" or window
@param {Number} opt.height=1 - Height of "viewport" or window
@param {Array} opt.center=[0, 0] - Center of viewport
  [longitude, latitude] or [x, y]
@param {Number} opt.scale=1 - Either use scale or zoom
@param {Number} opt.pitch=0 - Camera angle in degrees (0 is straight down)
@param {Number} opt.bearing=0 - Map rotation in degrees (0 means north is up)
@param {Number} opt.altitude= - Altitude of camera in screen units

Web mercator projection short-hand parameters
@param {Number} opt.latitude - Center of viewport on map (alternative to opt.center)
@param {Number} opt.longitude - Center of viewport on map (alternative to opt.center)
@param {Number} opt.zoom - Scale = Math.pow(2,zoom) on map (alternative to opt.scale)

Notes:
 - Only one of center or [latitude, longitude] can be specified
 - [latitude, longitude] can only be specified when "mercator" is true
 - Altitude has a default value that matches assumptions in mapbox-gl
 - width and height are forced to 1 if supplied as 0, to avoid
   division by zero. This is intended to reduce the burden of apps to
   to check values before instantiating a Viewport.


### project(lngLatZ, {topLeft = true} = {})

Projects latitude and longitude to pixel coordinates in window
using viewport projection parameters
- [longitude, latitude] to [x, y]
- [longitude, latitude, Z] => [x, y, z]
Note: By default, returns top-left coordinates for canvas/SVG type render

@param {Array} lngLatZ - [lng, lat] or [lng, lat, Z]
@param {Object} opts - options
@param {Object} opts.topLeft=true - Whether projected coords are top left
@return {Array} - [x, y] or [x, y, z] in top left coords


### unproject(xyz, {topLeft = true} = {})

Unproject pixel coordinates on screen onto [lon, lat] on map.
- [x, y] => [lng, lat]
- [x, y, z] => [lng, lat, Z]
@param {Array} xyz -
@return {Array} - [lng, lat, Z] or [X, Y, Z]


### projectFlat([lng, lat], scale = this.scale)

Project [lng,lat] on sphere onto [x,y] on 512*512 Mercator Zoom 0 tile.
Performs the nonlinear part of the web mercator projection.
Remaining projection is done with 4x4 matrices which also handles
perspective.

@param {Array} lngLat - [lng, lat] coordinates
  Specifies a point on the sphere to project onto the map.
@return {Array} [x,y] coordinates.


### unprojectFlat([x, y], scale = this.scale)

Unproject world point [x,y] on map onto {lat, lon} on sphere

@param {object|Vector} xy - object with {x,y} members
 representing point on projected map plane
@return {GeoCoordinates} - object with {lat,lon} of point on sphere.
  Has toArray method if you need a GeoJSON Array.
  Per cartographic tradition, lat and lon are specified as degrees.



### getUniforms()
