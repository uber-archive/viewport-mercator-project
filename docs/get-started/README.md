# viewport-mercator-project

Utilities to convert map or world coordinates to screen coordinates back and forth</h5>


## Installation

    npm install viewport-mercator-project --save


## Overview

Projection and camera utilities supporting the Web Mercator Projection. At its core this is a utility for converting to and from map coordinates (i.e. latitude, longitude) to screen coordinates and back.

* `FlatMercatorViewport` - For 2D applications, a simple, fast utility is provided that supports the basic flat Web Mercator projection and unprojection between geo coordinates and pixels.

* `PerspectiveMercatorViewport` - For 3D applications, a subclass of a generic `Viewport` class (which is essentially a 3D matrix "camera" class of the type you would find in any 3D/WebGL/OpenGL library).

The constructor of this "advanced" perspective-enabled viewport also takes the same typical map view parameters as the `FlatMercatorViewport`, however it offers perspective enabled/project unproject functions, and generates general 4x4 view matrices that correspond to the parameters.


### Who is this for?

Specifically built for use with [deck.gl](https://github.com/uber/deck-gl) and [react-map-gl](https://github.com/uber/react-map-gl), but could be useful for any web mapping application that wants to support Web Mercator Projection with floating point zoom levels.
