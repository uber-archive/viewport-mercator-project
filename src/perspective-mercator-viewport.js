// View and Projection Matrix calculations for mapbox-js style map view properties
import MercatorViewport from './mercator-viewport';
import autobind from './autobind';
import assert from 'assert';

import {
  projectFlat,
  unprojectFlat,
  getMercatorDistanceScales,
  makeProjectionMatrixFromMercatorParams,
  makeViewMatricesFromMercatorParams
} from './web-mercator-utils';

/* eslint-disable camelcase */
import vec2_add from 'gl-vec2/add';
import vec2_negate from 'gl-vec2/negate';

const DEFAULT_MAP_STATE = {
  latitude: 37,
  longitude: -122,
  zoom: 11,
  pitch: 0,
  bearing: 0,
  altitude: 1.5
};

const ERR_ARGUMENT = 'Illegal argument to WebMercatorViewport';

export default class WebMercatorViewport extends MercatorViewport {
  /**
   * @classdesc
   * Creates view/projection matrices from mercator params
   * Note: The Viewport is immutable in the sense that it only has accessors.
   * A new viewport instance should be created if any parameters have changed.
   *
   * @class
   * @param {Object} opt - options
   * @param {Boolean} mercator=true - Whether to use mercator projection
   *
   * @param {Number} opt.width=1 - Width of "viewport" or window
   * @param {Number} opt.height=1 - Height of "viewport" or window
   * @param {Array} opt.center=[0, 0] - Center of viewport
   *   [longitude, latitude] or [x, y]
   * @param {Number} opt.scale=1 - Either use scale or zoom
   * @param {Number} opt.pitch=0 - Camera angle in degrees (0 is straight down)
   * @param {Number} opt.bearing=0 - Map rotation in degrees (0 means north is up)
   * @param {Number} opt.altitude= - Altitude of camera in screen units
   *
   * Web mercator projection short-hand parameters
   * @param {Number} opt.latitude - Center of viewport on map (alternative to opt.center)
   * @param {Number} opt.longitude - Center of viewport on map (alternative to opt.center)
   * @param {Number} opt.zoom - Scale = Math.pow(2,zoom) on map (alternative to opt.scale)

   * Notes:
   *  - Only one of center or [latitude, longitude] can be specified
   *  - [latitude, longitude] can only be specified when "mercator" is true
   *  - Altitude has a default value that matches assumptions in mapbox-gl
   *  - width and height are forced to 1 if supplied as 0, to avoid
   *    division by zero. This is intended to reduce the burden of apps to
   *    to check values before instantiating a Viewport.
   */
  /* eslint-disable complexity */
  constructor({
    // Map state
    width,
    height,
    latitude,
    longitude,
    zoom,
    pitch,
    bearing,
    altitude,
    farZMultiplier = 10
  } = {}) {
    // Viewport - support undefined arguments
    width = width !== undefined ? width : DEFAULT_MAP_STATE.width;
    height = height !== undefined ? height : DEFAULT_MAP_STATE.height;
    zoom = zoom !== undefined ? zoom : DEFAULT_MAP_STATE.zoom;
    latitude = latitude !== undefined ? latitude : DEFAULT_MAP_STATE.latitude;
    longitude = longitude !== undefined ? longitude : DEFAULT_MAP_STATE.longitude;
    bearing = bearing !== undefined ? bearing : DEFAULT_MAP_STATE.bearing;
    pitch = pitch !== undefined ? pitch : DEFAULT_MAP_STATE.pitch;
    altitude = altitude !== undefined ? altitude : DEFAULT_MAP_STATE.altitude;

    // Silently allow apps to send in 0,0 to facilitate isomorphic render etc
    width = width || 1;
    height = height || 1;

    const scale = Math.pow(2, zoom);
    // Altitude - prevent division by 0
    // TODO - just throw an Error instead?
    altitude = Math.max(0.75, altitude);

    const center = projectFlat([longitude, latitude], scale);

    const distanceScales = getMercatorDistanceScales({latitude, longitude, scale});

    const projectionMatrix = makeProjectionMatrixFromMercatorParams({
      width,
      height,
      pitch,
      bearing,
      altitude,
      farZMultiplier
    });

    const {viewMatrixCentered} = makeViewMatricesFromMercatorParams({
      width,
      height,
      longitude,
      latitude,
      zoom,
      pitch,
      bearing,
      altitude,
      distanceScales,
      center
    });

    super({width, height, viewMatrix: viewMatrixCentered, projectionMatrix});

    // Save parameters
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = zoom;
    this.pitch = pitch;
    this.bearing = bearing;
    this.altitude = altitude;

    this.scale = scale;
    this.center = center;

    this._distanceScales = distanceScales;

    autobind(this);
    Object.freeze(this);
  }
  /* eslint-enable complexity */

  /**
   * Project [lng,lat] on sphere onto [x,y] on 512*512 Mercator Zoom 0 tile.
   * Performs the nonlinear part of the web mercator projection.
   * Remaining projection is done with 4x4 matrices which also handles
   * perspective.
   *
   * @param {Array} lngLat - [lng, lat] coordinates
   *   Specifies a point on the sphere to project onto the map.
   * @return {Array} [x,y] coordinates.
   */
  _projectFlat(lngLat, scale = this.scale) {
    return projectFlat(lngLat, scale);
  }

  /**
   * Unproject world point [x,y] on map onto {lat, lon} on sphere
   *
   * @param {object|Vector} xy - object with {x,y} members
   *  representing point on projected map plane
   * @return {GeoCoordinates} - object with {lat,lon} of point on sphere.
   *   Has toArray method if you need a GeoJSON Array.
   *   Per cartographic tradition, lat and lon are specified as degrees.
   */
  _unprojectFlat(xy, scale = this.scale) {
    return unprojectFlat(xy, scale);
  }

  /**
   * Get the map center that place a given [lng, lat] coordinate at screen
   * point [x, y]
   *
   * @param {Array} lngLat - [lng,lat] coordinates
   *   Specifies a point on the sphere.
   * @param {Array} pos - [x,y] coordinates
   *   Specifies a point on the screen.
   * @return {Array} [lng,lat] new map center.
   */
  getLocationAtPoint({lngLat, pos}) {
    const fromLocation = this.projectFlat(this.unproject(pos));
    const toLocation = this.projectFlat(lngLat);

    const center = this.projectFlat([this.longitude, this.latitude]);

    const translate = vec2_add([], toLocation, vec2_negate([], fromLocation));
    const newCenter = vec2_add([], center, translate);
    return this.unprojectFlat(newCenter);
  }

  /*
  getLngLatAtViewportPosition(lnglat, xy) {
    const c = this.locationCoordinate(lnglat);
    const coordAtPoint = this.pointCoordinate(xy);
    const coordCenter = this.pointCoordinate(this.centerPoint);
    const translate = coordAtPoint._sub(c);
    this.center = this.coordinateLocation(coordCenter._sub(translate));
  }
  */

  getDistanceScales() {
    return this._distanceScales;
  }

  /**
   * Converts a meter offset to a lnglat offset
   *
   * Note: Uses simple linear approximation around the viewport center
   * Error increases with size of offset (roughly 1% per 100km)
   *
   * @param {[Number,Number]|[Number,Number,Number]) xyz - array of meter deltas
   * @return {[Number,Number]|[Number,Number,Number]) - array of [lng,lat,z] deltas
   */
  metersToLngLatDelta(xyz) {
    const [x, y, z = 0] = xyz;
    assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z), ERR_ARGUMENT);
    const {pixelsPerMeter, degreesPerPixel} = this._distanceScales;
    const deltaLng = x * pixelsPerMeter[0] * degreesPerPixel[0];
    const deltaLat = y * pixelsPerMeter[1] * degreesPerPixel[1];
    return xyz.length === 2 ? [deltaLng, deltaLat] : [deltaLng, deltaLat, z];
  }

  /**
   * Converts a lnglat offset to a meter offset
   *
   * Note: Uses simple linear approximation around the viewport center
   * Error increases with size of offset (roughly 1% per 100km)
   *
   * @param {[Number,Number]|[Number,Number,Number]) deltaLngLatZ - array of [lng,lat,z] deltas
   * @return {[Number,Number]|[Number,Number,Number]) - array of meter deltas
   */
  lngLatDeltaToMeters(deltaLngLatZ) {
    const [deltaLng, deltaLat, deltaZ = 0] = deltaLngLatZ;
    assert(Number.isFinite(deltaLng) && Number.isFinite(deltaLat) && Number.isFinite(deltaZ),
      ERR_ARGUMENT);
    const {pixelsPerDegree, metersPerPixel} = this._distanceScales;
    const deltaX = deltaLng * pixelsPerDegree[0] * metersPerPixel[0];
    const deltaY = deltaLat * pixelsPerDegree[1] * metersPerPixel[1];
    return deltaLngLatZ.length === 2 ? [deltaX, deltaY] : [deltaX, deltaY, deltaZ];
  }

  /**
   * Add a meter delta to a base lnglat coordinate, returning a new lnglat array
   *
   * Note: Uses simple linear approximation around the viewport center
   * Error increases with size of offset (roughly 1% per 100km)
   *
   * @param {[Number,Number]|[Number,Number,Number]) lngLatZ - base coordinate
   * @param {[Number,Number]|[Number,Number,Number]) xyz - array of meter deltas
   * @return {[Number,Number]|[Number,Number,Number]) array of [lng,lat,z] deltas
   */
  addMetersToLngLat(lngLatZ, xyz) {
    const [lng, lat, Z = 0] = lngLatZ;
    const [deltaLng, deltaLat, deltaZ = 0] = this.metersToLngLatDelta(xyz);
    return lngLatZ.length === 2 ?
      [lng + deltaLng, lat + deltaLat] :
      [lng + deltaLng, lat + deltaLat, Z + deltaZ];
  }

  /**
   * Returns a new viewport that fit around the given rectangle.
   * Only supports non-perspective mode.
   * @param {Array} bounds - [[lon, lat], [lon, lat]]
   * @param {Number} [options.padding] - The amount of padding in pixels to add to the given bounds.
   * @param {Array} [options.offset] - The center of the given bounds relative to the map's center,
   *    [x, y] measured in pixels.
   * @returns {WebMercatorViewport}
   */
  fitBounds(bounds, options = {}) {
    const {width, height} = this;
    const {longitude, latitude, zoom} = fitBounds(Object.assign({width, height, bounds}, options));
    return new WebMercatorViewport({width, height, longitude, latitude, zoom});
  }

  // INTERNAL METHODS

  _getParams() {
    return this._distanceScales;
  }
}

/**
 * Returns map settings {latitude, longitude, zoom}
 * that will contain the provided corners within the provided width.
 * Only supports non-perspective mode.
 * @param {Number} width - viewport width
 * @param {Number} height - viewport height
 * @param {Array} bounds - [[lon, lat], [lon, lat]]
 * @param {Number} [padding] - The amount of padding in pixels to add to the given bounds.
 * @param {Array} [offset] - The center of the given bounds relative to the map's center,
 *    [x, y] measured in pixels.
 * @returns {Object} - latitude, longitude and zoom
 */
export function fitBounds({
  width,
  height,
  bounds,
  // options
  padding = 0,
  offset = [0, 0]
}) {
  const [[west, south], [east, north]] = bounds;

  const viewport = new WebMercatorViewport({
    width,
    height,
    longitude: 0,
    latitude: 0,
    zoom: 0
  });

  const nw = viewport.project([west, north]);
  const se = viewport.project([east, south]);
  const size = [
    Math.abs(se[0] - nw[0]),
    Math.abs(se[1] - nw[1])
  ];
  const center = [
    (se[0] + nw[0]) / 2,
    (se[1] + nw[1]) / 2
  ];

  const scaleX = (width - padding * 2 - Math.abs(offset[0]) * 2) / size[0];
  const scaleY = (height - padding * 2 - Math.abs(offset[1]) * 2) / size[1];

  const centerLngLat = viewport.unproject(center);
  const zoom = viewport.zoom + Math.log2(Math.abs(Math.min(scaleX, scaleY)));

  return {
    longitude: centerLngLat[0],
    latitude: centerLngLat[1],
    zoom
  };
}
