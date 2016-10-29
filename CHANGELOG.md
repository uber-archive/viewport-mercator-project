## Change log

## v3 - Perspective mode

Added new perspective enabled Viewport class

```
import Viewport from 'viewport-mercator-project/perspective';
var viewport = new Viewport({
  latitude, longitude, zoom, pitch, bearing, altitude
});
```

## v2 - Property renaming

`center` property was broken up into `longitude`, `latitude` properties.

`dimensions` property was broken up into `width`, and `height` properties.

Here's what creating a viewport used to look like, prior to `2.0`.

```js
var viewport = ViewportMercator({
  center: [0, 0],
  zoom: 0,
  dimensions: [600, 800]
});
```

The change was made to support the typical `viewport` object from the new
[react-map-gl](github.com/uber/react-map-gl)
[API changes](https://gist.github.com/vicapow/00017553e92f613d5361).
