<p align="right">
  <a href="https://npmjs.org/package/viewport-mercator-project">
    <img src="https://img.shields.io/npm/v/viewport-mercator-project.svg?style=flat-square" alt="version" />
  </a>
  <a href="https://travis-ci.org/uber/viewport-mercator-project">
    <img src="https://img.shields.io/travis/uber/viewport-mercator-project/master.svg?style=flat-square" alt="build" />
  </a>
  <a href="https://npmjs.org/package/viewport-mercator-project">
    <img src="https://img.shields.io/npm/dm/viewport-mercator-project.svg?style=flat-square" alt="downloads" />
  </a>
  <a href="http://starveller.sigsev.io/uber/viewport-mercator-project">
    <img src="http://starveller.sigsev.io/api/repos/uber/viewport-mercator-project/badge" alt="stars" />
  </a>
</p>

<h1 align="center">viewport-mercator-project</h1>

<h5 align="center">Utility to convert map or world coordinates to screen coordinates back and forth</h5>

    npm install viewport-mercator-project --save

Provides two options:
- A simple, fast `FlatViewport` for flat Web Mercator projection and unprojection
- An advanced perspective-enabled `PerspectiveViewport` class.

### Who is this for?

Specifically built for use with [deck.gl](https://github.com/uber/deck-gl)
and [react-map-gl](https://github.com/uber/react-map-gl),
but could be useful for any web mapping application that wants to
support Web Mercator Projection with floating point zoom levels.

## Example usage

```javascript
const ViewportMercator = require('viewport-mercator-project');

// NOTE: The `viewport` object returned from `ViewportMercator` is immutable.
const viewport = ViewportMercator({
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

## Documentation

### Features

- Generates WebGL compatible projection matrices (column-major Float32Arrays)

# API notes

The default coordinate system of the viewport is defined as a cartesian
plane with the origin in the top left, where the positive x-axis goes
right, and the positive y-axis goes down. That is, the top left corner
is `[0, 0]` and the bottom right corner is `[width, height]`.

Coordinates are specified in an lng-lat format `[lng, lat, z]` format which
most closely corresponds to `[x, y, z]` coords, with `lng` and `lat` specified
in degrees and `z` specified in meters above sea level.

Unless otherwise noted, per cartographic tradition, all angles
including latitude and longitude are specified in degrees, not radians

## PerspectiveViewport and Coordinate Systems

A PerspectiveViewport can be configured to work with positions specified in
different units.

- **longitude/latitude/altitude** (`LNGLAT`) -
  positions are interpreted as Web Mercator coordinates:
  [longitude, latitude, altitude].
- **meter offsets** (`METERS`) -
  positions are given in meter offsets from a reference point
  that is specified separately.
- **world** -  The perspective viewport can also supports working
  in a standard (i.e. unprojected) linear coordinate system although
  the support for specifying scales and extents is still rudimentary
  (this will be improved in future versions).

## About the mercator projection

Longitude and latitude are specified in degrees from Greenwich meridian /
equator respectively, and altitude is specified in meters above sea level.

### Distances

Note that that distance scales are latitude dependent under
web mercator projection ([see](http://wiki.openstreetmap.org/wiki/Zoom_levels)),
so scaling will depend on the viewport center and any linear scale factor
should only be expected to be locally correct.

- **zoom**: At zoom 0, the world is 512 pixels wide.
  Every zoom level magnifies by a factor of 2. Maps typically support zoom
  levels 0 (world) to 20 (sub meter pixels).

## About Meter Offset projection

TBA

## About World projection

In this mode, which does not offer any synchronization with maps, the
application specifies its world size (the number of pixels that the world occupies).

## PerspectiveViewport API

### Constructor

|   Parameter  |   Type  | Default | Description                                        |
| ------------ | ------- | ------- | -------------------------------------------------- |
| mercator     | Boolean | true    | Whether to use mercator projection                 |
| opt.width    | Number  | 1       | Width of "viewport" or window                      |
| opt.height   | Number  | 1       | Height of "viewport" or window                     |
| opt.center   | Array   | [0, 0]  | Center of viewport [longitude, latitude] or [x, y] |
| opt.scale    | Number  | 1       | Either use scale or zoom                           |
| opt.pitch    | Number  | 0       | Camera angle in degrees (0 is straight down)       |
| opt.bearing  | Number  | 0       | Map rotation in degrees (0 means north is up)      |
| opt.altitude | Number  | 1.5     | Altitude of camera in screen units                 |

Web mercator projection short-hand parameters

|   Parameter   |  Type  | Default | Description                                                |
| ------------- | ------ | ------- | ---------------------------------------------------------- |
| opt.latitude  | Number | 37      | Center of viewport on map (alternative to opt.center)      |
| opt.longitude | Number | -122    | Center of viewport on map (alternative to opt.center)      |
| opt.zoom      | Number | 11      | Scale = Math.pow(2,zoom) on map (alternative to opt.scale) |

Remarks:

 - Only one of center or [latitude, longitude] can be specified
 - [latitude, longitude] can only be specified when "mercator" is true
 - Only one of `center` or `[latitude, longitude]` can be specified.
 - `[latitude, longitude]` can only be specified when `mercator` is true
 - Altitude has a default value that matches assumptions in mapbox-gl
 - `width` and `height` are forced to 1 if supplied as 0, to avoid
   division by zero. This is intended to reduce the burden of apps to
   to check values before instantiating a `Viewport`.
 -  When using mercatorProjection, per cartographic tradition, longitudes and
   latitudes are specified as degrees.

#### `PerspectiveViewport.project`

Projects latitude, longitude (and altitude) to pixel coordinates in window using
viewport projection parameters.

Parameters:

  - `coordinates` {Array} - `[lng, lat, altitude]` Passing an altitude is optional.
  - `opts` {Object}
    - `topLeft` {Boolean} - Whether projected coords are top left.

Returns:

  - Either `[x, y]` or `[x, y, z]` if an altitude was given.

Note: By default, returns top-left coordinates for canvas/SVG type render

#### `PerspectiveViewport.unproject`

Unproject pixel coordinates on screen onto [lng, lat, altitude] on map.

Parameters:

  - `pixels` {Array} - `[x, y, z]` Passing a `z` is optional.

Returns:

  - Either `[lng, lat]` or `[lng, lat, altitude]` if a `z` was given.

#### `PerspectiveViewport.projectFlat`

Project `[lng, lat]` on sphere onto "screen pixel" coordinates `[x, y]` without
considering any perspective (effectively ignoring pitch, bearing and altitude).

Parameters:

 - `coordinates` {Array} - `[lng, lat]` or `[xmap, ymap]` coordinates.

Returns:

 - `[x, y]`, representing map or world coordinates.

#### `PerspectiveViewport.unprojectFlat`

Unprojects a screen point `[x, y]` on the map or world `[lng, lat]` on sphere.

Parameters:

 - `pixels` {Array} - `[x, y]`

Returns:

 - `[lng, lat]`
