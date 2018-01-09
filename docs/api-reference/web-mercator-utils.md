# Web Mercator Utility Functions

### `projectFlat(lngLat, scale)`

Project a coordinate on sphere onto the Web Mercator coordinate system at a given zoom level.

Parameters:
- `lngLat` (Array, required) - Specifies a point on the sphere to project. `[lng,lat]` in degrees.
- `scale` (Number, required) - Scale of the projection.

Returns:
- `[x, y]`


### `unprojectFlat(xy, scale)`

Unproject a coordinate from the Web Mercator coordinate system back to the sphere at a given zoom level.

Parameters:
- `xy` (Array, required) - Specifies a point on the Web Mercator tile to unproject. `[x, y]` in pixels.
- `scale` (Number, required) - Scale of the projection.

Returns:
- `[lng, lat]`


### `getMeterZoom(viewport)`

Returns the zoom level that gives a 1 meter pixel at a certain latitude.

Parameters:
- `viewport` (Object) - viewport props
- `viewport.latitude` (Number, required)


### `getDistanceScales(viewport)`

Calculate linear scales for quick conversion between meters/degrees/pixels distances around the given lat/lon.

In mercator projection mode, the distance scales vary significantly with latitude. The scale is only reasonably accurate locally.

Parameters:
- `viewport` (Object) - viewport props
- `viewport.longitude` (Number, required)
- `viewport.latitude` (Number, required)
- `viewport.zoom` (Number, optional)
- `viewport.scale` (Number, optional) - must supply if zoom is not specified
- `viewport.highPrecision` (bool, optional) - default `false`

Returns:
- `distanceScales` (Object)
- `distanceScales.pixelsPerMeter` (Array) - pixels per meter in `[x, y, z]`.
- `distanceScales.metersPerPixel` (Array) - meters per pixel in `[x, y, z]`
- `distanceScales.pixelsPerDegree` (Array) - pixels per degree in `[x, y, z]`
- `distanceScales.degreesPerPixel` (Array) - degree per pixel in `[x, y, z]`
- `distanceScales.pixelsPerMeter2` (Array) - if `highPrecision` is `true`, returns pixels per meter adjustment in `[x2, y2, z2]`. It offers a cheap way to compensate for the precision loss with latitude. Amends `pixelsPerMeter` by y offset (in meters): `[x + x2 * dy, y + y2 * dy, z + z2 * dy]`.
- `distanceScales.pixelsPerDegree2` (Array) - if `highPrecision` is `true`, returns pixels per degree adjustment in `[x2, y2, z2]`. It offers a cheap way to compensate for the precision loss with latitude. Amends `pixelsPerDegree` by y offset (in degrees): `[x + x2 * dy, y + y2 * dy, z + z2 * dy]`.


### `getWorldPosition(point)`

Calculates a mercator world position at the given zoom level from longitude, latitude and meter offset. This is a more powerful version of `projectFlat`.

Parameters:
- `point` (Object)
- `point.longitude` (Number, required)
- `point.latitude` (Number, required)
- `point.zoom` (Number, optional)
- `point.scale` (Number, optional) - must supply if zoom is not specified
- `point.meterOffset` (Array, optional) - offset from the lat/lon coordinates `[x, y, z]` in meters.
- `point.distanceScales` (Object, optional) - pre-calculated distance scales using `getDistanceScales`. Supply this parameter to avoid duplicate calculation.

Returns:
- `[x, y, z]` - pixel coordinates.

### `getViewMatrix(viewport)`

Get a transform matrix that projects from the mercator (pixel) space into the camera (view) space. Centers the map at the given coordinates.

Parameters:
- `viewport` (Object) - viewport props
- `viewport.height` (Number, required)
- `viewport.pitch` (Number, required)
- `viewport.bearing` (Number, required)
- `viewport.altitude` (Number, required)
- `viewport.flipY` (Boolean, optional) - Whether the returned matrix should flip y. Default `true` (latitude and screen y increase in opposite directions).
- `viewport.center` (Array, optional) - pre-calculated world position of map center using `getWorldPosition`. Default `[0, 0]`.

Returns:
- `viewMatrix` (Array) 4x4 matrix.


### `getProjectionMatrix(viewport)`

Get a transform matrix that projects from camera (view) space to clipspace.

Parameters:
- `viewport` (Object) - viewport props
- `viewport.width` (Number, required)
- `viewport.height` (Number, required)
- `viewport.pitch` (Number, required)
- `viewport.altitude` (Number, required)
- `viewport.farZMultiplier` (Number, optional) - far plane multiplier. Default `10`.


### `fitBounds(opts)`

Returns map settings (longitude, latitude and zoom) that will contain the provided corners within the provided dimensions. Only supports non-perspective mode.

Parameters:
- `opts` (Object) - options
- `opts.width` (Number, required)
- `opts.height` (Number, required)
- `opts.bounds` (Array, required) - opposite corners specified as `[[lon, lat], [lon, lat]]`
- `opts.padding` (Number, optional) - the amount of padding in pixels to add to the given bounds. Default `0`.
- `opts.offset` (Array, optional) - the center of the given bounds relative to the map's center, `[x, y]` measured in pixels.

Returns:
- `{longitude, latitude, zoom}`

### `normalizeViewportProps(viewport)`

This will adjust the map center and zoom so that the projected map fits into the target viewport size without white gaps.

Parameters:
- `viewport` (Object)
- `viewport.width` (Number, required)
- `viewport.height` (Number, required)
- `viewport.longitude` (Number, required)
- `viewport.latitude` (Number, required)
- `viewport.zoom` (Number, required)
- `viewport.pitch` (Number, optional)

Returns:
- `viewport` - normalized `{width, height, longitude, latitude, zoom, pitch, bearing}`

### `flyToViewport(startProps, endProps, t)`

While flying from one viewport to another, returns in-transition viewport props at a given time. This util function implements the algorithm described in “Smooth and efficient zooming and panning.” by Jarke J. van Wijk and Wim A.A. Nuij.

Parameters:
- `startProps` (Object) - viewport to fly from
- `startProps.width` (Number, required)
- `startProps.height` (Number, required)
- `startProps.longitude` (Number, required)
- `startProps.latitude` (Number, required)
- `startProps.zoom` (Number, required)
- `endProps` (Object) - viewport to fly from
- `endProps.longitude` (Number, required)
- `endProps.latitude` (Number, required)
- `endProps.zoom` (Number, required)
- `t` (Number) - a time factor between 0 and 1. `0` indicates the start of the transition, `1` indicates the end of the transition.

Returns:
- `{longitude, latitude, zoom}`
