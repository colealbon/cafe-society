const HtmlWebPackPlugin = require('html-webpack-plugin')
require('babel-polyfill')
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[id]-[chunkhash].js',
    publicPath: "https://cafe-society.news/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader'
          },
          {
            loader: 'markdown-loader',
            options: {
              /* your options here */
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['to-string-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new CopyPlugin([
      { from: './src/assets', to: '' },
      { from: './src/cors', to: '' }
    ]),
    new WebpackAssetsManifest({
      publicPath: '//cafe-society.news',
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, '/static/js'),
    port: 8080,
    index: 'index.html',
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
}
