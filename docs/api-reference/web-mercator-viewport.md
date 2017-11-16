# PerspectiveMercatorViewport

The main purpose of the `PerspectiveMercatorViewport` is to enable 3D rendering to
seamlessly overlay on top of map components that take web mercator style
map coordinates (`lat`, `lon`, `zoom`, `pitch`, `bearing` etc),
and to facilite the necessary mercator projections by breaking them into a
minimal non-linear piece followed by a standard projection chain.


## Methods

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
  in the requested coordinate system (top left or bottom left).
- `[longitude, latitude]` to `[x, y]`
- `[longitude, latitude, Z]` => `[x, y, z]`. `z` is pixel depth.

Remarks:
* By default, returns top-left coordinates suitable for canvas/SVG type
  rendering.


### `PerspectiveMercatorViewport.unproject`

Unproject pixel coordinates on screen onto [lon, lat] on map.

| Parameter      | Type      | Default  | Description                     |
| -------------- | --------- | -------- | ------------------------------- |
| `xyz`          | `Array`   | required | pixel coordinates in viewport   |
| `opts`         | `Object`  | `{}`     | named options                   |
| `opts.topLeft` | `Boolean` | `true`   | If true projected coords are top left |
| `opts.targetZ` | `Number`  | `0`      | If pixel depth is missing, use as the desired elevation |

Returns: Unprojected coordinates in array from, depending on input:
- `[x, y]` => `[lng, lat, (targetZ)]`
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

