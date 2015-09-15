// Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
'use strict';

var PI = Math.PI;
var DEGREES_TO_RADIANS = PI / 180;
var RADIANS_TO_DEGREES = 180 / PI;
function ViewportMercator(opts) {
  var lnglat = opts.center;
  var zoom = opts.zoom;
  var dimensions = opts.dimensions;
  var tileSize = opts.tileSize || 512;
  // see: https://en.wikipedia.org/wiki/Web_Mercator
  var scale = tileSize * 0.5 / PI * Math.pow(2, zoom);
  var lamda = lnglat[0] * DEGREES_TO_RADIANS;
  var phi = lnglat[1] * DEGREES_TO_RADIANS;
  var x = scale * (lamda + Math.PI);
  var y = scale * (PI - Math.log(Math.tan(PI * 0.25 + phi * 0.5)));
  var offsetX = -x + dimensions[0] / 2;
  var offsetY = -y + dimensions[1] / 2;
  function project(lnglat2) {
    var lamda2 = lnglat2[0] * DEGREES_TO_RADIANS;
    var phi2 = lnglat2[1] * DEGREES_TO_RADIANS;
    var x2 = scale * (lamda2 + PI);
    var y2 = scale * (PI - Math.log(Math.tan(PI / 4 + phi2 / 2)));
    return [x2 + offsetX, y2 + offsetY];
  }
  function unproject(xy) {
    var x2 = xy[0] - offsetX;
    var y2 = xy[1] - offsetY;
    var lamda2 = x2 / scale - PI;
    var phi2 = 2 * (Math.atan(Math.exp(PI - y2 / scale)) - PI / 4);
    return [lamda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES];
  }
  return {project: project, unproject: unproject};
}

module.exports = ViewportMercator;
