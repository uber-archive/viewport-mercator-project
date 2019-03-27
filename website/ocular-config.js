const DOCS = require("../docs/table-of-contents.json");

module.exports = {
  DOC_FOLDER: "/Users/jerome/code/viewport-mercator-project/website/../docs/",
  ROOT_FOLDER: "/Users/jerome/code/viewport-mercator-project/website/../",

  EXAMPLES: [
    // {title: 'my example', path: 'examples/my-example/', image: 'images/my-example.jpg'}
  ],
  DOCS,
  THEME_OVERRIDES: [
    //  {key: 'primaryFontFamily', value: 'serif'}
  ],

  PROJECT_TYPE: "github",
  PROJECT_NAME: "viewport-mercator-project",
  PROJECT_ORG: "uber-common",
  PROJECT_URL: "https://github.com/uber-common/viewport-mercator-project",
  PROJECT_DESC: "Utilities for working with Web Mercator Projections",
  WEBSITE_PATH: "/website/",

  FOOTER_LOGO: "",

  HOME_PATH: "/",
  HOME_HEADING: "Utilities for working with Web Mercator Projections",
  HOME_RIGHT: null,
  HOME_BULLETS: [],

  PROJECTS: {
    // 'Project name': 'http://project.url',
  },
  ADDITIONAL_LINKS: [
    // {name: 'link label', href: 'http://link.url'}
  ],

  GA_TRACKING: null,

  // For showing star counts and contributors.
  // Should be like btoa('YourUsername:YourKey') and should be readonly.
  GITHUB_KEY: null,

  // TODO/ib - from gatsby starter, clean up
  siteTitle: "viewport-mercator-project", // Site title.
  siteTitleAlt: "viewport-mercator-project", // Alternative site title for SEO.
  siteLogo: "/logos/logo-1024.png", // Logo used for SEO and manifest.
  siteUrl: "https://ocular", // Domain of your website without pathPrefix.
  pathPrefix: "/viewport-mercator-project", // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  siteDescription: "viewport-mercator-project", // Website description used for RSS feeds/meta description tag.
  siteRss: "/rss.xml", // Path to the RSS file.
  dateFromFormat: "YYYY-MM-DD", // Date format used in the frontmatter.
  dateFormat: "DD/MM/YYYY", // Date format for display.
  userName: "WebGL User", // Username to display in the author segment.
  copyright: "Copyright © 2019 Uber. MIT Licensed" // Copyright string for the footer of the website and RSS feed.
};
