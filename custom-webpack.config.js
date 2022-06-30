var path = require('path');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    output: {
      path: path.resolve(__dirname, 'bh-frontend'),
      filename: '[name].[fullhash].js'
    },
    plugins: [
      new CompressionPlugin()
    ]
  };