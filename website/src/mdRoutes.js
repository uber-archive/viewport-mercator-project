export default [{
  name: 'Documentation',
  path: '/documentation',
  data: [{
  //   name: 'Overview',
  //   markdown: require('../../docs/README.md')
  // }, {
    name: 'What\'s New',
    markdown: require('../../docs/whats-new.md')
  }, {
    name: 'Get started',
    children: [{
      name: 'Installation',
      markdown: require('../../docs/get-started/README.md')
    }]
  }, {
    name: 'Articles',
    children: [{
      name: 'About Coordinates',
      markdown: require('../../docs/articles/coordinates.md')
    }, {
      name: 'Offset Accuracy',
      markdown: require('../../docs/articles/offset-accuracy.md')
    }]
  }, {
    name: 'API Reference',
    children: [{
      name: 'WebMercatorViewport',
      markdown: require('../../docs/api-reference/web-mercator-viewport.md')
    }, {
      name: 'Web Mercator Utils',
      markdown: require('../../docs/api-reference/web-mercator-utils.md')
    }]
  }]
}];
