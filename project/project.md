项目核心要点：
一、黑金 VIP 开卡核心链路性能优化
1、路由懒加载
(1)react 项目中通过 React.lazy(() => import('./about'))的方式懒加载非首屏组件
(2)打包工具(webpack)识别 import()会将懒加载的组件单独打包成一个异步 chunk（webpack 中共有：entry chunk 入口 chunk、async chunk 异步 chunk、runtime chunk 打包工具运行时注入的代码、split chunk 四种）
(3)本质是一种代码分割技术(code splitting)，合理的分割代码可以使首屏体积减小、提高资源缓存命中率(如只改变 about 页面的业务代码，首页的缓存不会被影响)
(4)可能会涉及到 History 和 hash 两种路由模式，History 模式下 404 问题如何解决？(Nginx 中配置 try_files $uri $uri/ index.html)
(5)import()函数返回一个 Promise，Promise 状态会被<Suspense fallback={<div>loading...</div>} />组件捕获,pending 时渲染 fallback 中的内容,resolved 时会加载组件内容,rejected 时会被
React 错误边界(Error Boundary)组件捕获，优雅的错误处理，而不会导致整个应用崩溃

2、非首屏图片懒加载、小图片用 base64 嵌入
(1)、图片加载会影响 js 加载么，图片加载影响的是页面加载的哪个环节
不会，domContentLoaded 与 window.onload 中，图片加载只会影响页面 load 事件
(2)、图片懒加载的原理
img标签设置loading="lazy"或者用IntersectionObserver这个API
loading="lazy"缺点：
a、加载时机不稳定，在各个浏览器表现不一致
b、图片加载状态无法被监听，无法使用默认占位图
(3)、base64 编码原理
64 指的是 0-9/10 位 A-Z/26 位 a-z/26 位 + 和 /，共 64 位，减少页面 http 请求，实际上是将二进制数据编码成可打印字符，搭配 Data URL 协议可以离线访问，但是编码后的体积会增大 1/3 左右
(4)、为什么小图片用 base64,多小的图片适合用 base64,有一个标准么
1 个小图片用 http 请求资源，得不偿失；base64 编码之后文件体积会增大 1/3 左右，过大的图片编码之后会增大 html 或 css 文件的体积，导致关键渲染路径变慢；一般是小于 10kb 左右
webpack 中用 url-loader 的 limit：10 \* 1024 将小图片转为 base64
(5)、图片格式：jpg、png、WebP,WebP 同时支持有损压缩与无损压缩，有损压缩下，比 jpg 体积更小；无损压缩下，比 png 体积更小;压缩效率更高
(6)、开发过程中会经历 从蓝湖下载图片->手动压缩->上传 OSS->复制地址，为简化图片资源上传流程，自定义 webpack 插件，oss-upload-webpack-plugin，在 afterEmit 这个钩子上借助ali-oss SDK上传图片资源到阿里云 OSS

二、xx 数据中台
1、阐述项目结构
(1)apps / libs / tools / pnpm-workspace.yaml / nx.json
2、阐述 pnpm 的软链接、硬链接优势，减少依赖磁盘空间占用，规避幽灵依赖
3、解释 monorepo 的含义与作用
4、公共依赖以及跨模块的依赖如何高效管理
(1)如何限制各个模块间随意创建依赖关系，防止项目依赖图谱（nx graph）过于复杂，nx 中可以为每个模块定义 tag，限制随意引用
5、构建提速方案：nx affected / nx graph / nx cloud、增量编译与智能缓存
6、开发标准化、统一工作流
(1)质量门禁统一：根目录配置 Husky + Lint-Staged，提交时触发所有变动文件的校验 / 共享 Eslint 规则包：所有模块继承统一代码规范
7、CI、CD 流水线优化

代码规则校验需要考虑的问题
a、所有团队成员需要遵循统一的代码规范
b、增量校验：在开发、CI 环境中都能快速的运行 lint，只对改动的文件进行检查
c、共享统一的配置，减少维护成本

在 libs 目录下创建 eslint-config-common 包并导出，各个子项目共享基础 lint 配置(extends)，也可以自定义校验规则(overrides)
eslint-config-common 包中有宿主依赖(peerDependencies: { eslint: "^7.0.0" }), 借助 pnpm 中依赖提升（hoist），在 pnpm-workspace.yaml
中配置，统一在根目录 node_modules/.pnpm 中安装依赖，避免各个子项目重复安装依赖，减少磁盘占用

husky + lint-staged 搭配 git hooks(pre-commit、commit-msg)，在 pre-commit 阶段进行 prettier 代码格式校验与 eslint 代码规则校验
在 commit-msg 阶段进行 commit 信息校验（借助 commitlint 根据 commitlint.config.js 中定义关于 commit 信息的规则）
a、符合 feat/test/fix/conf/chore/refactor/doc/merge/revert 规范
b、用 Jira 维护项目的话，commit 信息中可以搭配 Jira id，方便今后线上问题排查、问题溯源/将 commit 与项目信息深度绑定(jira-id-required)(甚至你的分支名都可以绑定 jira id！！！)

tree shaking流程图 https://i-blog.csdnimg.cn/img_convert/6e984111b868b996b8ae68c93095d0e4.webp
副作用 package.json -> sideEffects
纯函数

前端资源压缩对比
tree shaking
js代码压缩->terser css代码压缩->cssnano 构建阶段
gzip->LZ77算法、哈夫曼编码 brotli->压缩率更高、兼容性不如gzip 网络传输阶段

esbuild追求速度优先，适用于 开发环境&速度优先
terser深度的AST分析，更激进的Tree-Shaking，且支持代码混淆，适用于生产环境，产物生成的体积优先
AST -> ESTree规范 -> 解析器、转换器、代码生成器都会遵循同一套规范
ESTree规范: 基于ECMAScript规范定义标准的AST结构