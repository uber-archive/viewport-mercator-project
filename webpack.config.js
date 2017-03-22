const {resolve} = require('path');
const webpack = require('webpack');

const BASE_CONFIG = {
  // devServer: {
  //   stats: {
  //     warnings: false
  //   },
  //   quiet: true
  // },

  // Bundle the transpiled code in dist
  entry: {
    lib: resolve('./src/index.js')
  },

  // Generate a bundle in dist folder
  output: {
    path: resolve('./dist'),
    filename: 'index.js'
  },

  // Exclude any non-relative imports from resulting bundle
  externals: [
    /^[a-z\-0-9]+$/
  ],

  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },

  module: {
    rules: [
      {
        // Compile ES2015 using buble
        test: /\.js$/,
        loader: 'buble-loader',
        include: [/src/, /test/],
        options: {
          objectAssign: 'Object.assign',
          transforms: {
            dangerousForOf: true,
            modules: false
          }
        }
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    })
  ]
};

const BROWSER_CONFIG = {
  // Bundle the tests for running in the browser
  entry: {
    'test-browser': resolve('./test/browser.js')
  },

  // Generate a bundle in dist folder
  output: {
    path: resolve('./dist'),
    filename: 'test-browser-bundle.js'
  },

  devtool: '#inline-source-maps',

  // Include any non-relative imports in resulting bundle
  externals: [],

  // Need to resolve references to ourself in tests
  resolve: {
    alias: {
      'viewport-mercator-project': resolve('src')
    }
  },

  plugins: []
};

module.exports = env => {
  let config = BASE_CONFIG;
  if (env && env.browser) {
    config = Object.assign({}, BASE_CONFIG, BROWSER_CONFIG);
  }
  // console.log(JSON.stringify(config, null, 2));
  return config;
};
