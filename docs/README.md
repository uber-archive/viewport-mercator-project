# viewport-mercator-project

Projection and camera utilities supporting the Web Mercator Projection. At its core this is a utility for converting to and from map coordinates (i.e. latitude, longitude) to screen coordinates and back.

## Installation
>>>>>>> Fix Overview page

```
npm install viewport-mercator-project --save
```

## Using

The `WebMercatorViewport` class offers the equivalent of a 3D matrix "camera" class of the type you would find in any 3D/WebGL/OpenGL library.

```js
import WebMercatorViewport from 'viewport-mercator-project';

// A viewport looking at San Francisco city area
const viewport = WebMercatorViewport({
  width: 800,
  height: 600,
  longitude: -122.45,
  latitude: 37.78,
  zoom: 12,
  pitch: 60,
  bearing: 30
});

viewport.project([-122.45, 37.78]);
// returns pixel coordinates [400, 300]
viewport.unproject([400, 300]);
// returns map coordinates [-122.45, 37.78]
```
