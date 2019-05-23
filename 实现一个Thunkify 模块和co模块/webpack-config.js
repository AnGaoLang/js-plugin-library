const path = require("path");

const resolve = (pathstr) => {
  return path.resolve(__dirname, pathstr)
}

module.exports = {
  mode: 'production',
  entry: {
    thunkify: resolve('./src/thunkify.ts'),
    co: resolve('./src/co.ts'),
  },
  output: {
    filename: '[name].min.js',
    path: resolve('./dist')
  },
  devtool: '',
  module: {
    rules: [{
      test: /\.(ts|tsx|js|jsx)?$/,
      use: 'eslint-loader',
      enforce: 'pre',
      exclude: /node_modules/,
    },{
      test: /\.(ts|tsx)?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  }
}