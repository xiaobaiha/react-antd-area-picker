// webpack.config.js
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production', 
  
  entry: {
    index: './src/index.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "lib"),
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      { 
        test: /\.jsx?$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        } 
      },
      { 
        test: /\.css$/, 
        use: ['style-loader','css-loader']
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['lib'])
  ]
}