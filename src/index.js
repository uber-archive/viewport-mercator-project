// Classic web-mercator-project
export {default as default} from './web-mercator-viewport';
export {default as WebMercatorViewport} from './web-mercator-viewport';
// Legacy class name
export {default as PerspectiveMercatorViewport} from './web-mercator-viewport';

export {fitBounds} from './web-mercator-viewport';
export {default as normalizeViewportProps} from './normalize-viewport-props';

export {
  projectFlat,
  unprojectFlat,
  getMeterZoom,
  getDistanceScales,
  getWorldPosition,
  getViewMatrix,
  getUncenteredViewMatrix,
  getProjectionMatrix,
  flyToViewport
} from './web-mercator-utils';
