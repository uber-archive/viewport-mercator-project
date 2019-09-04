
// default location for table of contents
const DOCS = require('../docs/table-of-contents.json');

module.exports = {
  // Adjusts amount of debug information from ocular-gatsby
  logLevel: 4,

  DOC_FOLDER: `${__dirname}/../docs/`,
  ROOT_FOLDER: `${__dirname}/../`,
  DIR_NAME: `${__dirname}`,

  EXAMPLES: [
    // {
    //   title: 'my example',
    //   path: 'examples/my-example/',
    //   image: 'images/my-example.jpg',
    //   componentUrl: '../examples/app.js'
    // }
  ],
  // your table of contents go there
  DOCS,

  THEME_OVERRIDES: [
    //  {key: 'primaryFontFamily', value: 'serif'}
  ],

  PROJECT_TYPE: 'github',
  PROJECT_NAME: 'viewport-mercator-project',
  PROJECT_ORG: 'uber-common',
  PROJECT_URL: 'https://github.com/uber-common/viewport-mercator-project',
  PROJECT_DESC: 'Utilities for working with Web Mercator Projections',
  PATH_PREFIX: '',

  FOOTER_LOGO: '',

  HOME_PATH: '/',
  HOME_HEADING: 'Utilities for working with Web Mercator Projections',
  HOME_RIGHT: null,
  HOME_BULLETS: [
  ],

  PROJECTS: [
    {
      name: 'deck.gl',
      url: 'https://deck.gl'
    },
    {
      name: 'luma.gl',
      url: 'https://luma.gl'
    },
    {
      name: 'react-map-gl',
      url: 'https://uber.github.io/react-map-gl'
    },
    {
      name: 'nebula.gl',
      url: 'https://nebula.gl/'
    }
  ],
  ADDITIONAL_LINKS: [
    // {name: 'link label', href: 'http://link.url'}
  ],

  GA_TRACKING: null,

  // For showing star counts and contributors.
  // Should be like btoa('YourUsername:YourKey') and should be readonly.
  GITHUB_KEY: null
};
