const path                      = require('path');
const webpack                   = require('webpack');
const HtmlWebpackPlugin         = require('html-webpack-plugin');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin       = require('terser-webpack-plugin');
const ImageMinimizerPlugin      = require("image-minimizer-webpack-plugin");
const CopyWebpackPlugin         = require("copy-webpack-plugin");
const {CleanWebpackPlugin}      = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
  const configObj = {
    splitChunks: {
      chunks: 'all'
    }
  };

  if(isProd){
    configObj.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return configObj;
};

const pages = ['index', 'tasks', 'buisness', 'control', 'change_pass', 'notifications', 'result_table', 'rules'];

const plugins = () => {
  const basePlugins = [
    new MiniCssExtractPlugin({
      filename: `styles/${filename('css')}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/blocks/button/__control/img/arrow_3.svg", to: "assets/images/" },
        { from: "src/blocks/button/__control/img/cross.svg", to: "assets/images/" },
        { from: "src/blocks/button/__control/img/info.svg", to: "assets/images/" },
        { from: "src/blocks/button/__control/img/found.svg", to: "assets/images/" },
        { from: "src/blocks/button/__control/img/link.svg", to: "assets/images/" },
        { from: "src/blocks/button/__control/img/moving.svg", to: "assets/images/" },
        { from: "src/blocks/button/__control/img/found_it.svg", to: "assets/images/" },
        { from: "src/blocks/button/__control/img/minus.svg", to: "assets/images/" },
        { from: "src/blocks/button/__control/img/chat.svg", to: "assets/images/" },
        { from: "src/blocks/table/__snprod/img/ellipse_green.svg", to: "assets/images/" },
        { from: "src/blocks/table/__snprod/img/ellipse_orange.svg", to: "assets/images/" },
        { from: "src/blocks/table/__snprod/img/ellipse_white.svg", to: "assets/images/" },
        { from: "src/blocks/table/__snprod/img/ellipse_red.svg", to: "assets/images/" },
        { from: "src/blocks/entrance/img/entrance_eye_off.svg", to: "assets/images/" },
        { from: "src/blocks/modal/__chat-task/img/send.svg", to: "assets/images/" },
        { from: "src/blocks/modal/__chat-task/img/change.svg", to: "assets/images/" },
        { from: "src/blocks/table/__control-task-control/img/active.svg", to: "assets/images/" },
        { from: "src/blocks/table/__control-task-control/img/active_time_fail.svg", to: "assets/images/" },
        { from: "src/blocks/table/__control-task-control/img/active_accept.svg", to: "assets/images/" },
        { from: "src/blocks/table/__control-task-control/img/active_accept_time_fail.svg", to: "assets/images/" },
        { from: "src/blocks/table/__control-task-control/img/complete.svg", to: "assets/images/" },
        { from: "src/blocks/table/__control-task-control/img/complete_time_fail.svg", to: "assets/images/" },
        { from: "src/blocks/table/__control-task-control/img/cancel.svg", to: "assets/images/" },
        { from: "src/blocks/table/__control-task-control/img/complete_part.svg", to: "assets/images/" },
        { from: "src/blocks/table/__control-task-control/img/complete_time_fail_part.svg", to: "assets/images/" }
      ],
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new CleanWebpackPlugin()
  ].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `src/pages/${page}.html`,
          filename: `${page}.html`,
          chunks: [page],
        })
    )
  );

  if(isProd){
    basePlugins.push(
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      addAttributesToSVGElement: {
                        params: {
                          attributes: [
                            { xmlns: "http://www.w3.org/2000/svg" },
                          ],
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    )
  }

  return basePlugins;
}

module.exports = {
  mode: 'development',
  entry: pages.reduce((config, page) => {
    config[page] = `./src/js/${page}.js`;
    return config;
  }, {}),
  
  output: {
    filename: `js/${filename('js')}`,
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: 'assets/images/[name][ext]'
  },

  stats: 'errors-warnings',

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(s*)css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ],
  },
  devtool: isProd ? false : 'source-map',
  optimization: optimization(),
  plugins: plugins(),

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    client: {  
      overlay: false  
    },
    open: true,
  },
};