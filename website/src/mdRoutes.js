export default [{
  name: 'Documentation',
  path: '/documentation',
  data: [{
    name: 'Overview',
    markdown: require('../../docs/README.md')
  }, {
    name: 'What\'s New',
    markdown: require('../../docs/whats-new.md')
  }, {
    name: 'Get started',
    children: [{
      name: 'Installation',
      markdown: require('../../docs/get-started/README.md')
    }, {
      name: 'About Coordinates',
      markdown: require('../../docs/get-started/coordinates.md')
    }]
  }, {
    name: 'API Reference',
    children: [{
      name: 'PerspectiveMercatorViewport',
      markdown: require('../../docs/api-reference/perspective-mercator-viewport.md')
    }, {
      name: 'FlatMercatorViewport',
      markdown: require('../../docs/api-reference/flat-mercator-viewport.md')
    }]
  }]
}];
