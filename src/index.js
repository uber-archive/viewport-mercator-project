// Classic web-mercator-project
export {default as default} from './web-mercator-viewport';
export {default as WebMercatorViewport} from './web-mercator-viewport';
// Legacy class name
export {default as PerspectiveMercatorViewport} from './web-mercator-viewport';

export {projectFlat} from './web-mercator-utils';
export {unprojectFlat} from './web-mercator-utils';
export {getMercatorMeterZoom} from './web-mercator-utils';
export {getMercatorDistanceScales} from './web-mercator-utils';
export {getMercatorWorldPosition} from './web-mercator-utils';
export {makeViewMatricesFromMercatorParams} from './web-mercator-utils';
export {makeUncenteredViewMatrixFromMercatorParams} from './web-mercator-utils';
export {makeProjectionMatrixFromMercatorParams} from './web-mercator-utils';
export {getFov} from './web-mercator-utils';
export {getClippingPlanes} from './web-mercator-utils';
