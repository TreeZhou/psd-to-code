const path = require('path');
const libraryName = require('../package.json').name.replace('@gz/','');
module.exports = {
  // mode: 'production',
  mode: 'development',
  target: 'node',
  entry: './src/cli/psd2code.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: libraryName + '.js',
    library: libraryName,
    libraryTarget: 'commonjs'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  externals: [
    'tree-to-code',
    'prettier',
    'chalk',
    'fs',
    'path',
    'ejs',
    'react-dom'
  ]
};
