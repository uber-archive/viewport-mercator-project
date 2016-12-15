require('./flat-viewport.spec');
require('./viewport.spec');
require('./web-mercator-viewport.spec');

// TODO - HACK - something is affecting resolution of calculations
const glMatrix = require('gl-matrix').glMatrix;
glMatrix.EPSILON = 0.001;
glMatrix.ARRAY_TYPE = Array;