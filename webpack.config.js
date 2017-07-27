"use strict";
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commitID = require('child_process').execSync("git rev-parse --short HEAD | tr -d '\n' ").toString();

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});


module.exports = {
  entry: "./source/entry.js",
  output: {
    path: __dirname + '/build',
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      Core: path.resolve(__dirname, 'source/javascripts/Core'),
    }
  },
  module: {
    loaders: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
    ]
  },
  plugins: [
    extractSass,
    new webpack.DefinePlugin({
      API_BASIS_URL: "'https://gentle-thicket-16020.herokuapp.com/'",
      CHESS_SOCKET_API_URL: "'wss://gentle-thicket-16020.herokuapp.com/'",
      COMMIT_ID: JSON.stringify(commitID),
    }),
    new HtmlWebpackPlugin({
      title: 'VR Chess',
      template: 'source/index.html'
    }),
    new CopyWebpackPlugin([
      { from: './source/blenderFiles', to: 'blenderFiles' },
    ])
  ],
};
