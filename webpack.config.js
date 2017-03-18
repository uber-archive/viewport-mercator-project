const {resolve} = require('path');
const webpack = require('webpack');

const BASE_CONFIG = {
  // Bundle the transpiled code in dist
  entry: {
    lib: resolve('./src/index.js')
  },

  // Generate a bundle in dist folder
  output: {
    path: resolve('./dist'),
    filename: '[name]-bundle.js'
  },

  // Exclude any non-relative imports from resulting bundle
  externals: [
    /^[a-z\-0-9]+$/
  ],

  resolve: {
    alias: {}
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

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    })
  ]
};

const BROWSER_CONFIG = {
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
};

module.exports = env => {
  const config = BASE_CONFIG;
  if (env && env.browser) {
    return BROWSER_CONFIG;
  }
  // console.log(JSON.stringify(config, null, 2));
  return config;
};
