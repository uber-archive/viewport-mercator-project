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

## Overview

Projection and camera utilities supporting the Web Mercator Projection.
At its core this is a utility for converting to and from map
(latitude, longitude) coordinates to screen coordinates and back.

* `FlatMercatorViewport` - For 2D applications, a simple, fast utility is provided that
  supports the basic flat Web Mercator projection and unprojection between
  geo coordinates and pixels.

* `PerspectiveMercatorViewport` - For 3D applications, a subclass
  of a generic `Viewport` class (which is essentially a 3D matrix
  "camera" class of the type you would find in any 3D/WebGL/OpenGL library).

The constructor of this "advanced" perspective-enabled viewport also takes
the same typical map view parameters as the `FlatMercatorViewport`, however it
offers perspective enabled/project unproject functions, and generates
general 4x4 view matrices that correspond to the parameters.


### Who is this for?

Specifically built for use with [deck.gl](https://github.com/uber/deck-gl)
and [react-map-gl](https://github.com/uber/react-map-gl),
but could be useful for any web mapping application that wants to
support Web Mercator Projection with floating point zoom levels.


### Notes on Coordinates

* For the `project`/`unproject` functions, the default pixel coordinate system of
  the viewport is defined with the origin in the top left, where the positive
  x-axis goes right, and the positive y-axis goes down. That is, the
  top left corner is `[0, 0]` and the bottom right corner is `[width - 1, height - 1]`.
  The functions have a flag that can reverse this convention.

* Non-pixel projection matrices are obviously bottom left.

* Mercator coordinates are specified in "lng-lat" format [lng, lat, z] format
  (which naturally corresponds to [x, y, z]).

* Per cartographic tradition, all angles including `latitude`, `longitude`,
  `pitch` and `bearing` are specified in degrees, not radians.

* Longitude and latitude are specified in degrees from Greenwich meridian and
  the equator respectively, and altitude is specified in meters above sea level.

* It is possible to query the PerspectiveMercatorViewport for a meters per pixel scale.
  Note that that distance scales are latitude dependent under
  web mercator projection [see](http://wiki.openstreetmap.org/wiki/Zoom_levels),
  so scaling will depend on the viewport center and any linear scale factor
  should only be expected to be locally correct.


# API Documentation

## FlatMercatorViewport

Note: The `FlatMercatorViewport` is completely independent of the other classes
in this module and is intended as a fast, simple solution for applications
that only use 2D map projections.

| Parameter     |   Type   | Default | Description                                                |
| ------------- | -------- | ------- | ---------------------------------------------------------- |
| `latitude`    | `Number` | 37      | Center of viewport on map (alternative to center)          |
| `longitude`   | `Number` | -122    | Center of viewport on map (alternative to center)          |
| `zoom`        | `Number` | 11      | Scale = Math.pow(2,zoom) on map (alternative to opt.scale) |
| `width`       | `Number` | 1       | Width of "viewport" or window                              |
| `height`      | `Number` | 1       | Height of "viewport" or window                             |


### Example usage

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



## PerspectiveMercatorViewport

The main purpose of the `PerspectiveMercatorViewport` is to enable 3D rendering to
seamlessly overlay on top of map components that take web mercator style
map coordinates (`lat`, `lon`, `zoom`, `pitch`, `bearing` etc),
and to facilite the necessary mercator projections by breaking them into a
minimal non-linear piece followed by a standard projection chain.

Remarks:
* Because `PerspectiveMercatorViewport` a subclass of `Viewport`, an application
  can implement support for generic 3D `Viewport`s and automatically get
  the ability to accept web mercator style map coordinates
  (`lat`, `lon`, `zoom`, `pitch`, `bearing` etc).
* A limitation at the moment is that there is no way to extract
  web mercator parameters from a "generic" viewport, so for map synchronization
  applications (rendering on top of a typical map component that only accepts
  web mercator parameters) the `PerspectiveMercatorViewport` is necessary.

### Constructor

| Parameter     |  Type    | Default | Description                                                |
| ------------- | -------- | ------- | ---------------------------------------------------------- |
| `latitude`    | `Number` | 37      | Center of viewport on map (alternative to center)          |
| `longitude`   | `Number` | -122    | Center of viewport on map (alternative to center)          |
| `zoom`        | `Number` | 11      | Scale = Math.pow(2,zoom) on map (alternative to opt.scale) |
| `width`       | `Number` | 1       | Width of "viewport" or window                              |
| `height`      | `Number` | 1       | Height of "viewport" or window                             |
| `center`      | `Array`  | [0, 0]  | Center of viewport [longitude, latitude] or [x, y]         |
| `scale`       | `Number` | 1       | Either use scale or zoom                                   |
| `pitch`       | `Number` | 0       | Camera angle in degrees (0 is straight down)               |
| `bearing`     | `Number` | 0       | Map rotation in degrees (0 means north is up)              |
| `altitude`    | `Number` | 1.5     | Altitude of camera in screen units                         |


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


### `PerspectiveMercatorViewport.project`

Projects latitude and longitude to pixel coordinates in window
using viewport projection parameters

| Parameter      | Type      | Default  | Description                     |
| -------------- | --------- | -------- | ------------------------------- |
| `lnglatz`      | `Array`   | required | `[lng, lat]` or `[lng, lat, Z]` |
| `opts`         | `Object`  | `{}`     | named options                   |
| `opts.topLeft` | `Boolean` | `true`   | If true projected coords are top left |

Returns: `[x, y]` or `[x, y, z]` - (depending on length of input array)
  in the requested coordinate system (top left or bottom left)
- `[longitude, latitude]` to `[x, y]`
- `[longitude, latitude, Z]` => `[x, y, z]`

Remarks:
* By default, returns top-left coordinates suitable for canvas/SVG type
  rendering.


### `PerspectiveMercatorViewport.unproject`

Unproject pixel coordinates on screen onto [lon, lat] on map.

| Parameter      | Type      | Default  | Description                     |
| -------------- | --------- | -------- | ------------------------------- |
| `xyz`          | `Array`   | required | pixel coordinates in viewport   |

Returns: Unprojected coordinates in array from, depending on input:
- `[x, y]` => `[lng, lat]`
- `[x, y, z]` => `[lng, lat, Z]`


#### `PerspectiveMercatorViewport.projectFlat([lng, lat], scale = this.scale)`

Project `[lng, lat]` on sphere onto "screen pixel" coordinates `[x, y]` without
considering any perspective (effectively ignoring pitch, bearing and altitude).

Parameters:

 - `coordinates` {Array} - `[lng, lat]` or `[xmap, ymap]` coordinates.

Returns:

 - `[x, y]`, representing map or world coordinates.

#### `PerspectiveMercatorViewport.unprojectFlat`

Unprojects a screen point `[x, y]` on the map or world `[lng, lat]` on sphere.
* `lnglat` - Array `[lng, lat]` or `[xmap, ymap]` coordinates
  Specifies a point on the map (or world) to project onto the screen.
* `returns` - [x,y] - An Array of Numbers representing map or world coordinates.

Parameters:
 - `pixels` {Array} - `[x, y]`


#### `PerspectiveMercatorViewport.unprojectFlat([x, y], scale = this.scale)`


Parameters:
 - `[lng, lat]` array xy - object with {x,y} members representing a "point on projected map
plane
Returns:
* [lat, lon] or [x, y] of point on sphere.


#### `getDistanceScales()`

Returns:
- An object with precalculated distance scales allowing conversion between
  lnglat deltas, meters and pixels.

Remarks:
* The returned scales represent simple linear approximations of the local
  Web Mercator projection scale around the viewport center. Error increases
  with distance from viewport center (Very roughly 1% per 100km).
* When converting numbers to 32 bit floats (e.g. for use in WebGL shaders)
  distance offsets can sometimes be used to gain additional computational
  precision, which can greatly outweigh the small linear approximation error
  mentioned above.


#### `metersToLngLatDelta(xyz)`

Converts a meter offset to a lnglat offset using linear approximation.
For information on numerical precision, see remarks on `getDistanceScales`.

* `xyz` ([Number,Number]|[Number,Number,Number])  - array of meter deltas
returns ([Number,Number]|[Number,Number,Number]) - array of [lng,lat,z] deltas


#### `lngLatDeltaToMeters(deltaLngLatZ)`

Converts a lnglat offset to a meter offset using linear approximation.
For information on numerical precision, see remarks on `getDistanceScales`.

* `deltaLngLatZ` ([Number,Number]|[Number,Number,Number])  - array of [lng,lat,z] deltas
Returns ([Number,Number]|[Number,Number,Number]) - array of meter deltas


#### `addMetersToLngLat(lngLatZ, xyz)`

Add a meter delta to a base lnglat coordinate, returning a new lnglat array,
using linear approximation.
For information on numerical precision, see remarks on `getDistanceScales`.

* `lngLatZ` ([Number,Number]|[Number,Number,Number]) - base coordinate
* `xyz` ([Number,Number]|[Number,Number,Number])  - array of meter deltas
Returns ([Number,Number]|[Number,Number,Number]) array of [lng,lat,z] deltas


#### `fitBounds(bounds, options)`

Get a new flat viewport that fits around the given bounding box.

* `bounds` ([[Number,Number],[Number,Number]]) - an array of two opposite corners of
the bounding box. Each corner is specified in `[lon, lat]`.
* `options` (Object)
  + `options.padding` (Number, optional) - The amount of padding in pixels to add to the given bounds from the edge of the viewport.
  + `options.offset` ([Number,Number], optional) - The center of the given bounds relative to the viewport's center, `[x, y]` measured in pixels.
