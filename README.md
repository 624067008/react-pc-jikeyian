### 配置sass 
  CRA脚手架已经帮你配置了sass  所以只需要下载包就行 并且它只是在开发时需要 那么加上-D
### 配置@绝对路径 craco/craco -D
1. 安装配置@路径的插件 yarn add @craco/craco -D
2. 根目录创建craco配置文件：craco.config.js  详情看其文件
3. 修改package.json文件中的脚本命令 改start build test  详情看其文件
4. 重启项目使配置生效
注 这个包修改脚手架CRA配置
### 让vscode识别@并提示路径
根目录下创建jsconfig.json 详情看其文件
### 配置axios
1. yarn add axios
2. 在utils 里配置http.js 文件  设置请求拦截器(设置统一挂载auth token)和响应拦截器（处理token失效【状态码为401】）。
### 路由鉴权
1. 如果没登录 是不能进入首页的
2. 封装高阶组件  详情看component里面的AuthComponent组件
### 组件外路由跳转 history
1. token失效时 需要在响应拦截器中实现路由跳转 
2. 需要用到 history  详情看其文件（utils/history.js)
3. 除此之外  要在app中所有的内容外包裹一层RouterHistory 此时不需要BrowserRouter 详情看其文件
### 富文本编辑器
1. 安装富文本编辑器：yarn add react-quill@2.0.0-beta.2  [react-quill需要安装beta版本适配react18 否则无法输入中文]
2. 导入富文本编辑器组件以及样式文件
3. 渲染富文本编辑器组件
4. 通过 Form 组件的 initialValues 为富文本编辑器设置初始值，否则会报错
5. 调整富文本编辑器的样式
* 注：这里遇到富文本编辑器出现两个的情况 此时需要把app组件外的reactStrictMode组件去掉


1. 项目打包
本节目标: 能够通过命令对项目进行打包
使用步骤
在项目根目录下打开终端，输入打包命令：yarn build
等待打包完成，打包生成的内容被放在根下的build文件夹中
2. 项目本地预览
本节目标: 能够在本地预览打包后的项目
使用步骤
全局安装本地服务包 npm i -g serve  该包提供了serve命令，用来启动本地服务
在项目根目录中执行命令 serve -s ./build  在build目录中开启服务器
在浏览器中访问：http://localhost:3000/ 预览项目
3. 打包体积分析 
https://www.bilibili.com/video/BV1Z44y1K7Fj?p=153&vd_source=08c5684e18cf751eedbc2fc60b335cdb
本节目标:   能够分析项目打包体积
分析说明通过分析打包体积，才能知道项目中的哪部分内容体积过大，才能知道如何来优化
使用步骤
安装分析打包体积的包：yarn add source-map-explorer
在 package.json 中的 scripts 标签中，添加分析打包体积的命令
对项目打包：yarn build（如果已经打过包，可省略这一步）
运行分析命令：yarn analyze
通过浏览器打开的页面，分析图表中的包体积
核心代码：
package.json 中：
﻿
"scripts": {
﻿
  "analyze": "source-map-explorer 'build/static/js/*.js'",
﻿
}
4. 优化-配置CDN
本节目标:  能够对第三方包使用CDN优化
分析说明：通过 craco 来修改 webpack 配置，从而实现 CDN 优化
核心代码
craco.config.js
﻿
// 添加自定义对于webpack的配置
﻿
​
﻿
const path = require('path')
﻿
const { whenProd, getPlugin, pluginByName } = require('@craco/craco')
﻿
​
﻿
module.exports = {
﻿
  // webpack 配置
﻿
  webpack: {
﻿
    // 配置别名
﻿
    alias: {
﻿
      // 约定：使用 @ 表示 src 文件所在路径
﻿
      '@': path.resolve(__dirname, 'src')
﻿
    },
﻿
    // 配置webpack
﻿
    // 配置CDN
﻿
    configure: (webpackConfig) => {
﻿
      // webpackConfig自动注入的webpack配置对象
﻿
      // 可以在这个函数中对它进行详细的自定义配置
﻿
      // 只要最后return出去就行
﻿
      let cdn = {
﻿
        js: [],
﻿
        css: []
﻿
      }
﻿
      // 只有生产环境才配置
﻿
      whenProd(() => {
﻿
        // key:需要不参与打包的具体的包
﻿
        // value: cdn文件中 挂载于全局的变量名称 为了替换之前在开发环境下
﻿
        // 通过import 导入的 react / react-dom
﻿
        webpackConfig.externals = {
﻿
          react: 'React',
﻿
          'react-dom': 'ReactDOM'
﻿
        }
﻿
        // 配置现成的cdn 资源数组 现在是公共为了测试
﻿
        // 实际开发的时候 用公司自己花钱买的cdn服务器
﻿
        cdn = {
﻿
          js: [
﻿
            'https://cdnjs.cloudflare.com/ajax/libs/react/18.1.0/umd/react.production.min.js',
﻿
            'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.1.0/umd/react-dom.production.min.js',
﻿
          ],
﻿
          css: []
﻿
        }
﻿
      })
﻿
​
﻿
      // 都是为了将来配置 htmlWebpackPlugin插件 将来在public/index.html注入
﻿
      // cdn资源数组时 准备好的一些现成的资源
﻿
      const { isFound, match } = getPlugin(
﻿
        webpackConfig,
﻿
        pluginByName('HtmlWebpackPlugin')
﻿
      )
﻿
​
﻿
      if (isFound) {
﻿
        // 找到了HtmlWebpackPlugin的插件
﻿
        match.userOptions.cdn = cdn
﻿
      }
﻿
​
﻿
      return webpackConfig
﻿
    }
﻿
  }
﻿
}
public/index.html
﻿
<body>
﻿
  <div id="root"></div>
﻿
  <!-- 加载第三发包的 CDN 链接 -->
﻿
  <% htmlWebpackPlugin.userOptions.cdn.js.forEach(cdnURL => { %>
﻿
    <script src="<%= cdnURL %>"></script>
﻿
  <% }) %>
﻿
</body>
5. 优化-路由懒加载
本节目标:   能够对路由进行懒加载实现代码分隔
使用步骤
在 App 组件中，导入 Suspense 组件
在 路由Router 内部，使用 Suspense 组件包裹组件内容
为 Suspense 组件提供 fallback 属性，指定 loading 占位内容
导入 lazy 函数，并修改为懒加载方式导入路由组件
代码实现
App.js
﻿
import { Routes, Route } from 'react-router-dom'
﻿
import { HistoryRouter, history } from './utils/history'
﻿
import { AuthRoute } from './components/AuthRoute'
﻿
​
﻿
// 导入必要组件
﻿
import { lazy, Suspense } from 'react'
﻿
// 按需导入路由组件
﻿
const Login = lazy(() => import('./pages/Login'))
﻿
const Layout = lazy(() => import('./pages/Layout'))
﻿
const Home = lazy(() => import('./pages/Home'))
﻿
const Article = lazy(() => import('./pages/Article'))
﻿
const Publish = lazy(() => import('./pages/Publish'))
﻿
​
﻿
function App () {
﻿
  return (
﻿
    <HistoryRouter history={history}>
﻿
      <Suspense
﻿
        fallback={
﻿
          <div
﻿
            style={{
﻿
              textAlign: 'center',
﻿
              marginTop: 200
﻿
            }}
﻿
          >
﻿
            loading...
﻿
          </div>
﻿
        }
﻿
      >
﻿
        <Routes>
﻿
          {/* 需要鉴权的路由 */}
﻿
          <Route path="/" element={
﻿
            <AuthRoute>
﻿
              <Layout />
﻿
            </AuthRoute>
﻿
          }>
﻿
            {/* 二级路由默认页面 */}
﻿
            <Route index element={<Home />} />
﻿
            <Route path="article" element={<Article />} />
﻿
            <Route path="publish" element={<Publish />} />
﻿
          </Route>
﻿
          {/* 不需要鉴权的路由 */}
﻿
          <Route path='/login' element={<Login />} />
﻿
        </Routes>
﻿
      </Suspense>
﻿
    </HistoryRouter>
﻿
  )
﻿
}
﻿
​
﻿
export default App