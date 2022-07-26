//添加自定义对webpack的配置

const path = require('path')

module.exports = {
  webpack: {
    //配置别名
    alias: {
      "@": path.resolve(__dirname, 'src')  //使用@表示src的路径
    }
  }
}