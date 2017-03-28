const {resolve} = require('path');
const webpack = require('webpack');

const SRC_DIR = './src';

const BASE_CONFIG = {
  // Bundle the transpiled code in dist
  entry: {
    lib: resolve(SRC_DIR, './index.js')
  },

  // Generate a bundle in dist folder
  output: {
    path: resolve('./dist'),
    filename: 'index.js',
    library: 'react-map-gl',
    libraryTarget: 'umd'
  },

  resolve: {
    alias: {
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
      'viewport-mercator-project': resolve(SRC_DIR)
    }
  },

  module: {
    rules: []
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    })
  ]
};

const BROWSER_CONFIG = Object.assign({}, BASE_CONFIG, {
  devServer: {
    stats: {
      warnings: false
    },
    quiet: true
  },

  // Bundle the tests for running in the browser
  entry: {
    'test-browser': resolve('./test/browser.js')
  },

  // Generate a bundle in dist folder
  output: {
    path: resolve('./dist'),
    filename: '[name]-bundle.js'
  },

  devtool: '#inline-source-maps',

  node: {
    fs: 'empty'
  },

  plugins: []
});

module.exports = env => {
  const config = BASE_CONFIG;
  if (env && env.browser) {
    return BROWSER_CONFIG;
  }
  // console.log(JSON.stringify(config, null, 2));
  return config;
};
