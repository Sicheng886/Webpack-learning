# Webpack Note

这是 webpack 的学习笔记

## 简介

Webpack 是一个构建工具和静态模块打包工具，用于解决高级语法如 import 和 less 等工具无法被浏览器识别的问题，也可以打包其他静态文件。

Webpack 会通过一个入口文件，此处为 **index.js** 来开始，从中寻找依赖并进行进一步的编译。编译的过程叫做打包，打包后输出的文件叫做 boundle， 输入的模块叫做 chunk。

## 核心概念

1. Entry：为 webpack 指示入口文件开始打包，分析构建内部依赖

2. Output：指示 webpack 打包后的输出地址

3. Loader：为了让 webpack 理解非 js 文件（如 sass loader），webpack 自身只理解 js

4. plugins： 执行更广泛的工作例如压缩和重新定义环境变量

5. Mode：Develop Mode & Production Mode

## 开发环境配置

### 安装

```bash
npm i webpack webpack-cli -g
npm i webpack webpack-cli -D
```

第一步全局安装，第二步添加到开发环境

### 打包运行指令

1.开发环境指令：

```bash
webpack ./src/index.js -o  ./build/built.js --mode=development
```

2.生产环境指令:

```bash
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
        use: [ //use接受数组使用多个模块
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

### 打包图片资源

图片资源同样使用 loader 处理，需要安装 **file-loader** 及 **url-loader** 两个模块。使用 **url-loader**，但 url-loader 依赖于 fileloader。对于样式中引入的图片，进行如下配置

```js
module: {
    rules: [
      //处理图片资源 （无法处理html中的资源）
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        loader: "url-loader", //loader接受字符串，配置单个模块
        options: {
          // 图片大小小于8kb会被转成base64处理
          // 优点：减少请求
          // 缺点：增大体积
          limit: 8 * 1024,
          // 图片文件默认采用hash值作为文件名，下面选项对文件名重命名以缩短文件长度
          // [hash:10] 代表取前10位， [ext]：取文件原拓展名extension filename
          name: "[hash:10].[ext]",
        },
      },
    ],
  },
```

但该方法无法引入 html 中的图片资源，要引入 html 中的图片需要配合使用 **html-laoder**, 如下：

```js
module: {
    rules: [
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: "[hash:10].[ext]",
          //关闭 es6的模块化语法，使用commonjs解析
          esModule:false,
        },
      },
       // 处理HTML中的图片资源, 负责引入img从而能被url-loader处理
      {
        test: /\.html$/,
        // url-loader 默认使用es6模块化进行解析，但html-loader默认返回的是commonjs的结果，直接解析会报错
        loader: "html-loader",
      },
    ],
  },
```

需要注意的是 html-loader 使用 commonjs 语法，因此需要在 url-loader 中关闭模块化语法

### 打包其他资源

其他资源，包括字体图表等其它全部不需要修改直接打包的资源。使用先前下载过的 **file-loader** 即可完成操作。
规则使用 exclude 进行排除法，需要完全排除其它被处理过的资源。

```js
module: {
  rules: [
    // 打包其它资源
    {
      exclude: /\.(html|json|js|css|scss|jpg|png|gif)$/, // 用排除法
      loader: "file-loader",
      options: {
        //同样可以缩短命名
        name: "[hash:10].[ext]",
      },
    },
  ];
}
```

### Dev Server

Dev Server，开发者服务器，用于自动化实时编译并刷新浏览器以查看最新代码效果。

只会在内存中进行打包而不会有任何输出。启用指令为 **npx webpack-dev-server**，需安装对应拓展包。

```bash
npm i webpack-dev-server -D

npx webpack-dev-server
```

在 5 个核心配置项之下进行配置

```js
/*
配置文件， 指示webpack 怎么干活
*/
//用来拼接绝对路径的模块
const { resolve } = require("path");

module.exports = {
  //配置
  entry: "./src/index.js",
  ...
  mode: "development",
  // 配置开发者服务器
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, "build"),
    // 启用gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open:true
  },
};
```

### 输出文件目录配置

在输出时在 output 配置项下加入子文件夹路径即可将其放入对应文件夹中。对于 js 文件的输出进行如下配置。

```js
module.export = {
  output: {
    filename: "js/built.js", // 输出文件名
    path: resolve(__dirname, "build"), // __dirname 是当前文件的绝对路径，是node的变量
  },
};
```

对于图片等其它资源的配置在对应 loader 的 options 中进行配置。

```js
module.export={
   module: {
    rules: [
      {
        exclude: /\.(html|json|js|css|scss|jpg|png|gif)$/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
          // 设置输出路径
          outputPath: "media",
        },
      },
    ],
  },
  },
}
```
