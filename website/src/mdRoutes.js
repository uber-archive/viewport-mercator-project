import overview from '../../docs/README.md';
import perspectiveMercatorViewport from '../../docs/api-reference/perspective-mercator-viewport.md';
import flatMercatorViewport from '../../docs/api-reference/flat-mercator-viewport.md';

import install from '../../docs/get-started/README.md';
import whatsNew from '../../docs/get-started/whats-new.md';

import coordinates from '../../docs/get-started/coordinates.md';

export default [{
  name: 'Documentation',
  path: '/documentation',
  data: [{
    name: 'Overview',
    markdown: overview
  }, {
    name: 'Get started',
    children: [{
      name: 'Installation',
      markdown: install
    }, {
      name: 'What\'s New',
      markdown: whatsNew
    }, {
      name: 'About Coordinates',
      markdown: coordinates
    }]
  }, {
    name: 'API Reference',
    children: [{
      name: 'PerspectiveMercatorViewport',
      markdown: perspectiveMercatorViewport
    }, {
      name: 'FlatMercatorViewport',
      markdown: flatMercatorViewport
    }]
  }]
}];
