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

var ViewportMercator = require('../');
var test = require('tape');
var round = require('round-precision');
var PRECISION = 4;

function equalPoints(point1, point2) {
  var same1 = round(point1[0], PRECISION) === round(point2[0], PRECISION);
  var same2 = round(point1[1], PRECISION) === round(point2[1], PRECISION);
  return same1 && same2;
}

function createViewport(opt) {
  opt = opt || {};
  return ViewportMercator({
    center: opt.center || [0, 0],
    zoom: opt.zoom || 0,
    tileSize: opt.tileSize || 512,
    dimensions: opt.dimensions || [512, 512]
  });
}

test('viewport exists', function tt(t) {
  var viewport = createViewport();
  t.ok(viewport);
  t.end();
});

test('forward and reverse projection (0,0) at z=0', function tt(t) {
  var dimensions = [512, 512];
  var viewport = createViewport({dimensions: dimensions});
  var lngLat = [0, 0];
  var pixel = viewport.project(lngLat);
  var expectedPixel = [dimensions[0] / 2, dimensions[1] / 2];
  // With the above project, a lngLat of (0, 0) should be in the center of
  // the screen.
  t.deepEqual(pixel, expectedPixel);
  // We should be able to convert back to lngLat, (0, 0) using the center pixel
  // coordinates.
  t.deepEqual(viewport.unproject(pixel), lngLat);
  t.end();
});

test('corners with 512x512 viewport at z=0', function tt(t) {
  var dim = [512, 512];
  var MAX_LAT = 85.05113;
  var MAX_LNG = 180.00000;
  var viewport = createViewport({dimensions: dim});
  t.ok(equalPoints(viewport.unproject([0, 0]), [-MAX_LNG, MAX_LAT]));
  t.ok(equalPoints(viewport.unproject([dim[0], 0]), [MAX_LNG, MAX_LAT]));
  t.ok(equalPoints(viewport.unproject(dim), [MAX_LNG, -MAX_LAT]));
  t.ok(equalPoints(viewport.unproject([0, dim[1]]), [-MAX_LNG, -MAX_LAT]));
  t.end();
});

test('corners with 512x512 viewport at z=1', function tt(t) {
  var dim = [512, 512];
  var MAX_LNG = 90.00000;
  var MAX_LAT = 66.51326;
  var viewport = createViewport({dimensions: dim, zoom: 1});
  t.ok(equalPoints(viewport.unproject([0, 0]), [-MAX_LNG, MAX_LAT]));
  t.ok(equalPoints(viewport.unproject([dim[0], 0]), [MAX_LNG, MAX_LAT]));
  t.ok(equalPoints(viewport.unproject(dim), [MAX_LNG, -MAX_LAT]));
  t.ok(equalPoints(viewport.unproject([0, dim[1]]), [-MAX_LNG, -MAX_LAT]));
  t.end();
});

test('unproject corners with 800x600 viewport at z=0', function tt(t) {
  var dim = [800, 600];
  var MAX_LNG = 281.250000;
  var MAX_LAT = 87.114758;
  var viewport = createViewport({dimensions: dim});
  t.ok(equalPoints(viewport.unproject([0, 0]), [-MAX_LNG, MAX_LAT]));
  t.ok(equalPoints(viewport.unproject([dim[0], 0]), [MAX_LNG, MAX_LAT]));
  t.ok(equalPoints(viewport.unproject(dim), [MAX_LNG, -MAX_LAT]));
  t.ok(equalPoints(viewport.unproject([0, dim[1]]), [-MAX_LNG, -MAX_LAT]));
  t.end();
});
