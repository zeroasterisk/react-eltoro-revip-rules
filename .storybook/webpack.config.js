
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js',
      'meteor/check': 'uniforms/SimpleSchemaBridge.js',
      'meteor/aldeed:simple-schema': 'uniforms/SimpleSchemaBridge.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.css?$/,
        loaders: ['style-loader', 'css-loader', 'raw'],
        include: path.resolve(__dirname, '../'),
      },
      // {
      //   test: /\.scss$/,
      //   loaders: ["style-loader", "css-loader", "sass-loader"],
      //   include: path.resolve(__dirname, '../')
      // },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
        include: path.resolve(__dirname, '../'),
      },
    ]
  }
}
