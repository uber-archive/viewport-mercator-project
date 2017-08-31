# Notes on Coordinates

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
