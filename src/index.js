/*
入口文件
运行指令
1.开发环境指令：
  webpack .src/index.js -o  ./build/built.js --mode=development
2.生产环境指令:
  webpack .src/index.js -o  ./build/built.js --mode=development
*/

import data from "./data.json";
import "./styles/index.css";
import "./styles/styles.scss";
import "./styles/iconfont.css";

function add(x, y) {
  return x + y;
}

function outputData() {
  const sec = document.getElementById("sec");
  for (let i in data) {
    // console.log(`${i}: ${data[i]}`);
    const pTag = document.createElement("p");
    pTag.innerText = `${i}: ${data[i]}`;
    pTag.className = "info";
    sec.append(pTag);
  }
}

console.log(add(1, 2));
outputData();
