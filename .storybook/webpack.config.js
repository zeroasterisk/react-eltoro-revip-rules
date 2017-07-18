
const path = require('path');

module.exports = {
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
