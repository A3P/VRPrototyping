require('es6-promise').polyfill(); // fixes https://github.com/webpack/css-loader/issues/145

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Clean = require('clean-webpack-plugin');

var siteConfig = {
  entry: {
    site: [
      './source/stylesheets/site.css.scss',
      './source/javascripts/site.js'
    ],
  },

  resolve: {
    root: __dirname + '/source/javascripts',
  },

  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'javascripts/[name].bundle.js',
  },

  module: {
    loaders: [
      // Load JS
      {
        test: /source\/javascripts\/.*\.js$/,
        exclude: /node_modules|\.tmp|vendor/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        },
      },
      // Load SCSS
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          "style",
          "css!sass?sourceMap"
        )
      },

      // Embed small pngs as data uri
      // url-loader falls back to file-loader when image is too big
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "url-loader?limit=100000&name=../images/[name].[ext]"
      },
    ],
  },

  sassLoader: {
    includePaths: [require('bourbon').includePaths]
  },

  node: {
    console: true
  },

  plugins: [
    new Clean(['.tmp']),
    new ExtractTextPlugin("stylesheets/site.bundle.css"),
    new webpack.optimize.CommonsChunkPlugin("site", "javascripts/site.bundle.js"),
  ],
};

module.exports = siteConfig;