# 部署到 GitHub Pages 或 Cloudflare Pages

本教程针对当前 CatalpaCute 网站。源码在 `src/` 和 `public/`，运行 `npm run build` 会生成 `dist/`。

## 当前仓库：从 main 根目录发布

对于现有的 `CatalpaCute/Navigation-page` 仓库，保留 GitHub Pages 的 `main / (root)` 发布来源，以及指向 `czzzz.work` 的 `CNAME`。在仓库目录运行：

```powershell
npm ci
npm run check
npm run build:pages
```

最后一条命令把静态页面和素材从 `dist/` 复制到仓库根目录。把源码和更新后的发布文件一并提交；准备好上线时执行 `git push origin main`。站内链接使用小写 `/about`。其余章节仅适用于新仓库或切换部署方式，不需要为当前仓库启用自定义工作流。

## 先选平台

- **Cloudflare Pages**：建议优先选。连接 GitHub 后，每次推送到生产分支都会重新构建并发布；它把网站放在域名根路径，适配当前网站的链接结构。
- **GitHub Pages**：适合放在自己的 GitHub Pages 根网址，或已经配置自定义域名的情况。

**GitHub Pages 子路径提醒：**项目页面通常会放在 `https://<用户名>.github.io/<仓库名>/`。当前网站的导航、样式、脚本和图片使用以 `/` 开头的根路径，例如 `/about` 和 `/styles.css`。直接部署到上述子路径时，这些链接可能会指向错误位置。最省事的办法是使用名为 `<用户名>.github.io` 的个人站点仓库，或配置自定义域名使网站从根路径提供。若必须使用仓库子路径，需要先为网站加上 base path 支持。

## 准备代码仓库

1. 在 GitHub 创建一个空仓库。使用 GitHub Pages 时，若想使用个人站点根网址，仓库名须为 `<你的 GitHub 用户名>.github.io`；使用 Cloudflare Pages 时，仓库名可以自定。
2. 在电脑上打开项目目录：

   ```powershell
   cd "C:\Users\Catal\Documents\New project 5\catalpa-site"
   ```

3. 如果这个项目还没有关联 GitHub 仓库，先检查远程地址，再添加并推送。把占位内容替换成自己的 GitHub 用户名和仓库名：

   ```powershell
   git remote -v
   git remote add origin https://github.com/<用户名>/<仓库名>.git
   git push -u origin main
   ```

   如果 `git remote -v` 已经显示了正确的地址，不要再次运行 `git remote add`。如果提示找不到 `origin`，再添加远程地址。

4. 本地可先构建确认输出目录：

   ```powershell
   npm ci
   npm run check
   npm run build
   ```

   完成后应能在 `dist\index.html`、`dist\about\index.html` 和 `dist\projects\index.html` 看到页面文件。

## 方式一：GitHub Pages

### 添加自动发布工作流

在项目中创建文件 `.github/workflows/deploy-pages.yml`，内容如下。它会在推送到 `main` 或手动启动时，安装依赖、构建 `dist`，然后发布到 GitHub Pages。

```yaml
name: Deploy website

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out source
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Check site content
        run: npm run check

      - name: Build site
        run: npm run build

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload site files
        uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Publish to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

保存并推送这个新文件：

```powershell
git add .github/workflows/deploy-pages.yml
git commit -m "Add GitHub Pages deployment"
git push
```

### 打开 GitHub Pages

1. 打开 GitHub 仓库的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 打开仓库的 **Actions** 页面，查看名为 **Deploy website** 的流程。等待构建和发布都成功。
4. Pages 页面会显示网站地址。访问首页后，也分别打开 `/about/` 和 `/projects/` 检查页面及图片。

后续推送到 `main` 就会自动重新部署。GitHub Pages 发布的站点可被互联网访问；请勿把密码、令牌或其他私密文件放进站点仓库。GitHub 的套餐也会影响 Pages 对私有仓库的支持，具体以仓库设置中可选的 Pages 来源为准。

## 方式二：Cloudflare Pages

Cloudflare Pages 的 Git 集成会监听仓库推送，并可为其他分支或 Pull Request 创建预览部署。

1. 确认代码已推送到 GitHub。
2. 登录 Cloudflare，进入 **Workers & Pages**，选择 **Create application → Pages → Connect to Git**（界面文案可能略有调整）。
3. 授权 Cloudflare 访问 GitHub，然后选择刚才的仓库。
4. 在构建配置中填写：

   | 设置项 | 填写值 |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | `None` 或 `Other` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | 留空（仓库根目录） |

5. 在项目的 **Settings → Environment variables** 中添加构建变量 `NODE_VERSION`，值设为 `22`。项目依赖 Cheerio 1.1.2，要求 Node.js 至少为 20.18.1；固定为 22 可以避免构建环境版本变化导致安装失败。
6. 保存并启动首次部署。成功后 Cloudflare 会提供一个 `*.pages.dev` 地址。
7. 访问该地址，检查首页、About、Project、字体和照片。之后推送到 `main` 会更新正式网站；其他分支的部署用于预览。

如果要使用自己的域名，在 Pages 项目的 **Custom domains** 中添加，并按 Cloudflare 提示完成域名和 DNS 配置。不要选 Direct Upload 作为首次方式：此项目适合 Git 集成自动构建，Cloudflare 提醒 Direct Upload 项目之后不能切换成 Git 集成。

## 以后怎么更新网站

- 首页项目、社交链接、照片等内容：编辑 `src/content/site.mjs`。
- About 正文：运行 `npm run sync:about` 从博客手动更新快照。
- 页面样式和交互：分别查看 `public/styles.css` 和 `public/app.mjs`。

About 的博客正文会在 `npm run sync:about` 时抓取并保存。单纯推送代码或触发平台构建**不会**重新抓博客。更新完成后运行检查和构建，再提交并推送：

```powershell
npm run check
npm run build
git add src/content/site.mjs src/content/about.json public dist
git commit -m "Update website content"
git push
```

如果只改了其中一类内容，`git add` 后面可以只列出实际修改的文件和生成的 `dist`。GitHub Pages 工作流和 Cloudflare Pages 都会在推送后重新构建。

## 常见问题

### 页面打开了，但没有样式或图片

如果使用 GitHub Pages 且网址包含 `/<仓库名>/`，通常是根路径链接不适用于项目子路径。改用个人站点仓库根网址或自定义域名；否则需要先给网站实现 base path。

### 首页正常，直接打开 About 或 Project 报 404

确认构建输出设置为 `dist`，而不是项目根目录。当前构建会生成 `dist/about/index.html`、`dist/projects/index.html` 和 `dist/404.html`。

### About 仍是旧内容

确认先运行了 `npm run sync:about`，并提交了更新后的 `src/content/about.json`。然后等待 Actions 或 Cloudflare 的新部署成功。

### 构建提示 Node.js 版本不支持

将 GitHub Actions 的 Node 版本或 Cloudflare 项目的 `NODE_VERSION` 固定为 `22`，并重新触发构建。

## 官方文档

- [GitHub Pages 发布来源和 GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Cloudflare Pages Git 集成](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Pages 构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages 构建环境与 Node.js 版本](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Cloudflare Pages 自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)
