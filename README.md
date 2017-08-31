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

Documentation is available in the [**website**](https://uber-common.github.io/viewport-mercator-project/#/) or in the [docs](./docs) folder).


<h5 align="center">Utility to convert map or world coordinates to screen coordinates back and forth</h5>

    npm install viewport-mercator-project --save

## Overview

Projection and camera utilities supporting the Web Mercator Projection. At its core this is a utility for converting to and from map coordinates (i.e. latitude, longitude) to screen coordinates and back.

* `FlatMercatorViewport` - For 2D applications, a simple, fast utility is provided that supports the basic flat Web Mercator projection and unprojection between geo coordinates and pixels.

* `PerspectiveMercatorViewport` - For 3D applications, a subclass of a generic `Viewport` class (which is essentially a 3D matrix "camera" class of the type you would find in any 3D/WebGL/OpenGL library).

The constructor of this "advanced" perspective-enabled viewport also takes the same typical map view parameters as the `FlatMercatorViewport`, however it offers perspective enabled/project unproject functions, and generates general 4x4 view matrices that correspond to the parameters.


### Who is this for?

Specifically built for use with [deck.gl](https://github.com/uber/deck-gl) and [react-map-gl](https://github.com/uber/react-map-gl), but could be useful for any web mapping application that wants to support perspective enabled Web Mercator Projections with floating point zoom levels.
