const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'web',
  devtool: 'source-map',
  entry: {
    background: ['babel-polyfill', './src/background/index.js'],
    browser_action: './src/browser_action/index.js',
    content_scripts: './src/content_scripts/index.js',
  },
  output: {
    path: __dirname,
    filename: 'src/[name]/build/[name].bundle.js',
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['background'],
      template: 'src/background/index.html',
      filename: 'src/background/build/index.html',
    }),
    new HtmlWebpackPlugin({
      chunks: ['browser_action'],
      template: 'src/browser_action/popup.html',
      filename: 'src/browser_action/build/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
      'config.mixpanel': {
        token: null,
      },
    }),
  ],
  module: {
    rules: [
      { test: /\.js$/, include: path.join(__dirname, 'src'), use: 'babel-loader' },
      {
        test: /(\.scss|\.css)$/,
        include: path.join(__dirname, 'src'),
        exclude: path.join(__dirname, 'src', 'browser_action', 'css'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [require('autoprefixer')];
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src', 'browser_action', 'css'),
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'node_modules'),
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=464600&minetype=application/font-woff',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader',
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, 'src', 'browser_action'), 'node_modules'],
  },
};
