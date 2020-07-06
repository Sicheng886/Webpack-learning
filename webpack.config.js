/*
配置文件， 指示webpack 怎么干活
*/
//用来拼接绝对路径的模块
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //配置
  //入口
  entry: "./src/index.js",
  //输出位置
  output: {
    filename: "js/built.js", // 输出文件名
    path: resolve(__dirname, "build"), // __dirname 是当前文件的绝对路径，是node的变量
  },
  // loader 配置
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
      //处理图片资源 （无法处理html中的资源）
      {
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader", //loader接受字符串，配置单个模块
        options: {
          // 图片大小小于8kb会被转成base64处理
          // 优点：减少请求
          // 缺点：增大体积
          limit: 8 * 1024,
          //为了兼容HtmlWebpackPlugin关闭 es6的模块化语法，使用commonjs解析
          esModule: false,
          // 图片文件默认采用hash值作为文件名，下面选项对文件名重命名以缩短文件长度
          // [hash:10] 代表取前10位， [ext]：取文件原拓展名extension filename
          name: "[hash:10].[ext]",
          // 定义图片的输出文件夹
          outputPath: "images",
        },
      },
      // 处理HTML中的图片资源, 负责引入img从而能被url-loader处理
      {
        test: /\.html$/,
        // url-loader 默认使用es6模块化进行解析，但html-loader默认返回的是commonjs的结果，直接解析会报错
        loader: "html-loader",
      },
      // 打包其它资源
      {
        exclude: /\.(html|json|js|css|scss|jpg|png|gif)$/, // 用排除法
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
          outputPath: "media",
        },
      },
    ],
  },
  //插件
  plugins: [
    // html 资源打包插件， 默认会创建一个空的html文件，引入打包输出的所有资源
    new HtmlWebpackPlugin({
      // 以该文件为模板创建html文件，自动引入打包输出的所有资源
      template: "./src/index.html",
    }),
  ],
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
    open: true,
  },
};
