// Classic web-mercator-project
export {default as default} from './web-mercator-viewport';
export {default as WebMercatorViewport} from './web-mercator-viewport';
// Legacy class name
export {default as PerspectiveMercatorViewport} from './web-mercator-viewport';

export {fitBounds} from './web-mercator-viewport';

export {
  projectFlat,
  unprojectFlat,
  getMercatorMeterZoom,
  getMercatorDistanceScales,
  getMercatorWorldPosition,
  makeViewMatricesFromMercatorParams,
  makeUncenteredViewMatrixFromMercatorParams,
  makeProjectionMatrixFromMercatorParams,
  getFov,
  getClippingPlanes
} from './web-mercator-utils';
