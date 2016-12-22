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

* `FlatViewport` - For 2D applications, a simple, fast utility is provided that
  supports the basic flat Web Mercator projection and unprojection between
  geo coordinates and pixels.

* `WebMercatorViewport` - For 3D applications, a subclass
  of a generic `Viewport` class (which is essentially a 3D matrix
  "camera" class of the type you would find in any 3D/WebGL/OpenGL library).

The constructor of this "advanced" perspective-enabled viewport also takes
the same typical map view parameters as the `FlatViewport`, however it
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

* It is possible to query the WebMercatorViewport for a meters per pixel scale.
  Note that that distance scales are latitude dependent under
  web mercator projection [see](http://wiki.openstreetmap.org/wiki/Zoom_levels),
  so scaling will depend on the viewport center and any linear scale factor
  should only be expected to be locally correct.


# API Documentation

## FlatViewport

Note: The `FlatViewport` is completely independent of the other classes
in this module and is intended as a fast, simple solution for applications
that only use 2D map projections.

| `latitude`    | `Number` | 37      | Center of viewport on map (alternative to center)          |
| `longitude`   | `Number` | -122    | Center of viewport on map (alternative to center)          |
| `zoom`        | `Number` | 11      | Scale = Math.pow(2,zoom) on map (alternative to opt.scale) |
| `width`       | `Number` | 1       | Width of "viewport" or window                              |
| `height`      | `Number` | 1       | Height of "viewport" or window                             |


### Example usage

    import {FlatViewport} from 'viewport-mercator-project';

    // NOTE: The `viewport` object returned from `FlatViewport` is immutable.
    const viewport = FlatViewport({
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



## WebMercatorViewport

The main purpose of the `WebMercatorViewport` is to enable 3D rendering to
seamlessly overlay on top of map components that take web mercator style
map coordinates (`lat`, `lon`, `zoom`, `pitch`, `bearing` etc),
and to facilite the necessary mercator projections by breaking them into a
minimal non-linear piece followed by a standard projection chain.

Remarks:
* Because `WebMercatorViewport` a subclass of `Viewport`, an application
  can implement support for generic 3D `Viewport`s and automatically get
  the ability to accept web mercator style map coordinates
  (`lat`, `lon`, `zoom`, `pitch`, `bearing` etc).
* A limitation at the moment is that there is no way to extract
  web mercator parameters from a "generic" viewport, so for map synchronization
  applications (rendering on top of a typical map component that only accepts
  web mercator parameters) the `WebMercatorViewport` is necessary.

### Constructor

| Parameter    |   Type  | Default | Description                                        |
| ------------ | ------- | ------- | -------------------------------------------------- |


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


### `WebMercatorViewport.project`

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


### `WebMercatorViewport.unproject`

Unproject pixel coordinates on screen onto [lon, lat] on map.

| Parameter      | Type      | Default  | Description                     |
| -------------- | --------- | -------- | ------------------------------- |
| `xyz`          | `Array`   | required | pixel coordinates in viewport   |

Returns: Unprojected coordinates in array from, depending on input:
- `[x, y]` => `[lng, lat]`
- `[x, y, z]` => `[lng, lat, Z]`


#### `WebMercatorViewport.projectFlat([lng, lat], scale = this.scale)`

Project `[lng, lat]` on sphere onto "screen pixel" coordinates `[x, y]` without
considering any perspective (effectively ignoring pitch, bearing and altitude).

Parameters:

 - `coordinates` {Array} - `[lng, lat]` or `[xmap, ymap]` coordinates.

Returns:

 - `[x, y]`, representing map or world coordinates.

#### `PerspectiveViewport.unprojectFlat`

Unprojects a screen point `[x, y]` on the map or world `[lng, lat]` on sphere.
* `lnglat` - Array `[lng, lat]` or `[xmap, ymap]` coordinates
  Specifies a point on the map (or world) to project onto the screen.
* `returns` - [x,y] - An Array of Numbers representing map or world coordinates.

Parameters:

 - `pixels` {Array} - `[x, y]`

#### `WebMercatorViewport.unprojectFlat([x, y], scale = this.scale)`

Returns:
 - `[lng, lat]` array xy - object with {x,y} members representing a "point on projected map
plane
* `returns` [lat, lon] or [x, y] of point on sphere.


## Viewport

Manages projection and unprojection of coordinates between world and viewport
coordinates.

It provides both direct project/unproject function members as well as
projection matrices including `view` and `projection matrices`, and
can generate their inverses as well to facilitate e.g. lighting calculations
in WebGL shaders.

Remarks:
* The `Viewport` class perhaps best thought of as the counterpart of the
  typical `Camera` class found in most 3D libraries.
* The main addition is that to support pixel project/unproject functions
  (in addition to the clipspace projection that Camera classes typically manage),
  the `Viewport` is also aware of the viewport extents.
* Also, it can generate WebGL compatible projection matrices (column-major) - Note
  that these still need to be converted to typed arrays.


### `Viewport.constructor`

`new Viewport({viewMatrix, projectionMatrix, width, height})`

| Parameter    | Type        | Default | Description                                   |
| ------------ | ----------- | ------- | --------------------------------------------- |
| `width`      | `Number`    | 1       | Width of "viewport" or window                 |
| `height`     | `Number`    | 1       | Height of "viewport" or window                |
| `viewMatrix` | `Array[16]` | [0, 0]  | Center of viewport [x, y]                     |
| `projectionMatrix` | `Array[16]` | 1 | Either use scale or zoom                      |


### `Viewport.getMatrices`

Returns an object with various matrices

`Viewport.getMatrices({modelMatrix = })`

| Parameter     | Type        | Default  | Description                                   |
| ------------- | ----------- | -------- | --------------------------------------------- |
| `modelMatrix` | `Number`    | IDENTITY | Width of "viewport" or window                 |

* `modelMatrix` (Matrix4) - transforms model to world space
* `viewMatrix` (Matrix4) - transforms world to camera space
* `projectionMatrix` (Matrix4) - transforms camera to clip space
* `viewProjectionMatrix` (Matrix4)  - transforms world to clip space
* `modelViewProjectionMatrix` (Matrix4) - transforms model to clip space

* `pixelProjectionMatrix` (Matrix4)  - transforms world to pixel space
* `pixelUnprojectionMatrix` (Matrix4) - transforms pixel to world space
* `width` (Number) - Width of viewport
* `height` (Height) - Height of viewport


#### `Viewport.project`

Projects latitude, longitude (and altitude) to pixel coordinates in window using
viewport projection parameters.

Parameters:

  - `coordinates` {Array} - `[lng, lat, altitude]` Passing an altitude is optional.
  - `opts` {Object}
    - `topLeft` {Boolean} - Whether projected coords are top left.

Returns:

  - Either `[x, y]` or `[x, y, z]` if an altitude was given.

Note: By default, returns top-left coordinates for canvas/SVG type render


#### `Viewport.unproject`

Unproject pixel coordinates on screen onto [lng, lat, altitude] on map.

Parameters:

  - `pixels` {Array} - `[x, y, z]` Passing a `z` is optional.

Returns:

  - Either `[lng, lat]` or `[lng, lat, altitude]` if a `z` was given.


## PerspectiveViewport

A subclass of `Viewport` that creates a perspective view based on typical
affine perspective projection matrix parameters (`fov`, `aspect`, `near`, `far`).

Remarks:
* This class is just a convenience, the application can use `Viewport` directly
  together with e.g. the `mat4.perspective` and `mat4.lookAt` functions from the
  `gl-matrix` module.


### `PerspectiveViewport.constructor`

`new PerspectiveViewport({lookAt, eye, up, fov, aspect, near, far, width, height})`

| Parameter    | Type        | Default | Description                                   |
| ------------ | ----------- | ------- | --------------------------------------------- |
| `width`      | `Number`    | 1       | Width of "viewport" or window                 |
| `height`     | `Number`    | 1       | Height of "viewport" or window                |
view matrix arguments
* `eye` (Vector3) - Defines eye position
* `lookAt` (Vector3 = [0, 0, 0]) - Which point is camera looking at, default origin
* `up` (Vector3 = [0, 1, 0]) - Defines up direction, default positive y axis
projection matrix arguments
* `fov` (Number = 75) - Field of view covered by camera
* `near` (Number = 1) - Distance of near clipping plane
* `far` (Number = 100) - Distance of far clipping plane
automatically calculated
* `aspect` (Number) - Aspect ratio (set to viewport widht/height)


## OrthographicViewport

A subclass of `Viewport` that creates an orthogonal matrix

`new OrthographicViewport({lookAt, eye, up, left, right, bottom, top, width, height})`

| Parameter    | Type        | Default | Description                                   |
| ------------ | ----------- | ------- | --------------------------------------------- |
| `width`      | `Number`    | 1       | Width of "viewport" or window                 |
| `height`     | `Number`    | 1       | Height of "viewport" or window                |
view matrix arguments
* `eye` (Vector3) - Defines eye position
* `lookAt` (Vector3 = [0, 0, 0]) - Which point is camera looking at, default origin
* `up` (Vector3 = [0, 1, 0]) - Defines up direction, default positive y axis
projection matrix arguments
* `near` (Number = 1) - Distance of near clipping plane
* `far` (Number = 100) - Distance of far clipping plane
* `left` (Number) - Left bound of the frustum
* `top` (Number) - Top bound of the frustum
automatically calculated
* `right` (Number) - Right bound of the frustum
* `bottom` (Number) - Bottom bound of the frustum

Remarks:
* This class is just a convenience, the application can use `Viewport` directly
  together with e.g. the `mat4.ortho` and `mat4.lookAt` functions from the
  `gl-matrix` module.
