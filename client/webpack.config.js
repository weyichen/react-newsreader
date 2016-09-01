var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: "cheap-module-eval-source-map",

  entry: {
    'vendor': __dirname + "/vendor.js", 
    'app': __dirname + "/app.js"
  },

  output: {
    path: __dirname + '/dist',
    filename: "./[name].js"
  },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor']
    }),
    new HtmlWebpackPlugin({
      template: 'client/index.html'
    })
  ]

};