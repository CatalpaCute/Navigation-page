# CatalpaCute 个人网站

首页、项目目录和 About 共用淡黄色大理石、墨痕署名与无衬线字体。首页轮播保留原始摄影内容，用窄幅不规则纸边衔接背景。照片来自现有博客相册。

## 本地查看

```powershell
npm install --cache .npm-cache
npm run dev
```

打开终端显示的 `http://127.0.0.1:4173/`。三个入口为 `/`、`/projects`、`/about`，同时兼容 `/About`。

## 更新内容

修改 `src/content/site.mjs` 可添加项目、调整社媒链接或更换轮播照片。把新照片放进 `public/assets/photos/`，修改对应的 `src`、`alt`、`title` 和 `position`；`source` 记录照片原始来源。页面使用本地优化过的照片，正常浏览无需连接原相册。

About 有两种正文来源，通过 `src/content/about-mode.json` 的 `mode` 切换。

- `blog`（当前默认）使用上次同步的博客快照。更新博客正文后运行 `npm run sync:about` 刷新快照。
- `manual` 使用 `src/content/about.md`。写好 Markdown 后再切换，手写模式会隐藏博客原文链接和同步日期。

两份正文独立保存。手写模式下仍可同步博客快照，之后改回 `blog` 就会使用最近一次成功同步的版本。切换或修改后可运行 `npm run dev` 预览，准备发布时运行：

```powershell
npm run check
npm run build:pages
```

同步会提取原站正文，保留段落、列表、链接、图片和强调样式，用本网站的排版呈现。来源的脚本、原站主题样式、评论组件和 Emoji 不会复制过来。网络超时、来源结构变化或正文异常时，命令返回明确错误并保留上一次有效内容，避免 About 变空。同步成功后仍需要重新发布网站；访客页面不会直接跨域请求原站。

## 发布

此仓库的 GitHub Pages 从 `main` 分支的根目录发布，`CNAME` 保留域名 `czzzz.work`。更新源码后运行 `npm run check` 和 `npm run build:pages`，再提交源码及根目录里更新的发布文件；准备好上线时运行 `git push origin main`。

`npm run build` 单独生成 `dist/`，适合预览或交给其他托管平台。其他发布方式见 [部署说明](docs/deploy.md)。

## 核心结构

- `src/lib/render.mjs`：共用导航、页脚和页面模板，保证内容在 JavaScript 不可用时仍能显示。
- `src/lib/load-about.mjs`：按配置读取博客快照或渲染手写 Markdown。
- `src/lib/about.mjs`：提取和清洗博客 About，防止原主题脚本或样式进入新界面。
- `scripts/sync-about.mjs`：下载、验证并原子替换正文快照。
- `public/app.mjs`：只管理轮播；悬停、键盘焦点、后台页面及减少动态效果都会暂停自动播放。
- `public/styles.css`：统一的字体、颜色、响应式排版、页面渐入与纸边过渡。

轮播支持上一张、下一张、暂停与左右方向键。图片加载失败会跳过该图片；全部图片不可用时显示提示与原相册链接。减少动态效果开启时默认停止自动播放。手机上按文字、链接、照片的顺序排列。

## 素材

字体自托管，署名使用 Outfit，标题使用 Lato，正文使用 Manrope；许可保存在 `public/assets/fonts/OFL-*.txt`。

大理石与墨痕由内置 image_gen 生成。提示词与保存路径见 `docs/assets.md`。个人信息、项目链接和照片均以现有网站内容为来源，没有虚构经历。

当前版本：1.0.8。移除 About 侧栏的“Cc.”装饰文字及对应样式。
