# Webpack Note

这是 webpack 的学习笔记

## Introduction

Webpack 是一个构建工具和静态模块打包工具，用于解决高级语法如 import 和 less 等工具无法被浏览器识别的问题，也可以打包其他静态文件。

Webpack 会通过一个入口文件，此处为 **index.js** 来开始，从中寻找依赖并进行进一步的编译。编译的过程叫做打包，打包后输出的文件叫做 boundle， 输入的模块叫做 chunk。

## Core Concept

1. Entry：为 webpack 指示入口文件开始打包，分析构建内部依赖

2. Output：指示 webpack 打包后的输出地址

3. Loader：为了让 webpack 理解非 js 文件（如 sass loader），webpack 自身只理解 js

4. plugins： 执行更广泛的工作例如压缩和重新定义环境变量

5. Mode：Develop Mode & Production Mode

## 初步配置

### 安装

```cli
npm i webpack webpack-cli -g
npm i webpack webpack-cli -D
```

第一步全局安装，第二步添加到开发环境

### 打包运行指令

1.开发环境指令：

```cli
webpack ./src/index.js -o  ./build/built.js --mode=development
```

2.生产环境指令:

```cli
webpack ./src/index.js -o  ./build/built.js --mode=production
```

生产环境会压缩代码

### webpack.config.js 配置文件

webpack.config.js 使用 commonjs 语法，包括如下基本内容

```js
/*
配置文件， 指示webpack 怎么干活
*/
//用来拼接绝对路径的模块
const { resolve } = require("path");

module.exports = {
  //配置
  //入口
  entry: "./src/index.js",
  //输出位置
  output: {
    filename: "built.js",
    path: resolve(__dirname, "build"), // __dirname 是当前文件的绝对路径，是node的变量
  },
  // loader 配置
  module: {
    rules: [
      //详细loader的配置
    ],
  },
  //插件
  plugins: [],
  mode: "development", //或 "production"
};
```

### 处理样式资源

样式需要在 module 中进行配置使用 loader。包括匹配的文件类型和使用的模块。

基础样式需要使用 **style-loader** 和 **css-loader** 将其打包为 js 字符串，预编译样式需要对应的 loader 及模块如 scss 需要 **sass** , **sass-loader** 两个模块，最终在 module 中写成:

```js
module: {
    rules: [
      //详细loader的配置
      {
        // 匹配哪些文件 （正则）
        test: /\.css$/,
        // 使用哪些loader
        use: [
          // 执行顺序从数组右侧到左侧
          // 创建style标签，将js中的css资源插入，添加到页面中生效
          "style-loader",
          // 将css变成常用的commonjs的模块，内容是样式字符串
          "css-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
```

### 处理 HTML 文件

HTML 文件的处理通过使用 **html-webpack-plugin** 插件模块来实现。

在插件中进行如下设置。

```js
plugins: [
    // html 资源打包插件， 默认会创建一个空的html文件，引入打包输出的所有资源
    new HtmlWebpackPlugin({
      // 以该文件为模板创建html文件，自动引入打包输出的所有资源
      template: "./src/index.html",
    }),
  ],
```
