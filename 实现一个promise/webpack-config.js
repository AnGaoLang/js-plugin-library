const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    MPromise: path.resolve(__dirname, 'src/promise.ts')
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryExport: "default", // 对外暴露default属性，就可以直接调用default里的属性(针对script引入方式!必须)
    library: '[name]',  // 指定类库名,将类库暴露的方法指定给改标识符.主要用于直接引用的方式(比如使用script 标签)
    globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况(兼容node环境,script引入方式可省略)
    libraryTarget: "umd" // 定义打包方式,同时支持在CommonJS、AMD和全局变量(不支持es6module)使用,(script引入方式可省略)
  },
  devtool: "",
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        // use: [
        //   { loader: 'style-loader' },
        //   {
        //     loader: 'ts-loader',
        //     options: {
        //       modules: true
        //     }
        //   }
        // ]
      }
    ]
  },
}