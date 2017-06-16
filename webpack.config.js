"use strict";
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var Clean = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BabiliPlugin = require("babili-webpack-plugin");

const cssLoaders = [
  {
    loader: "css-loader",
    options: {
      modules: true,
      minimize: true
    }
  },
  {
    loader: "sass-loader"
  }
]
module.exports = {
  context: __dirname + "/source",
  entry: {
      site: [
      './stylesheets/site.scss',
      './javascripts/site.js'
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,

        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: "pre",
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
      },
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
    ],//end rules
  },
  output: {
    path: __dirname + "/build/",
    filename: "[name].bundle.js",
  },
  resolve: {
    modules: [__dirname + "/source/javascripts/", "node_modules"],
  },

  plugins: [
    new webpack.DefinePlugin({
      CHESS_SOCKET_API_URL: "'wss://utils.freerunningtech.com/'",
    }),
    new Clean(['.build']),
    new BabiliPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: false
    }),
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath("[name].bundle.css").replace("css/js", "css");
      },
      disable: false,
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      { from: './blenderFiles', to: 'blenderFiles' },
      ]),
  ],
};
