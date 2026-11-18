import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { document } from '../src/lib/render.mjs';

try {
  const snapshot = JSON.parse(await readFile('src/content/about.json','utf8'));
  if (!snapshot.html || !snapshot.syncedAt) throw new Error('About 内容快照不完整，请先运行 npm run sync:about。');
  await cp('public','dist',{recursive:true,force:true});
  await mkdir('dist/content',{recursive:true});
  await cp('src/content/site.mjs','dist/content/site.mjs');
  for (const [route, directory] of [['/',''],['/projects','projects'],['/about','about'],['/about','About']]) {
    await mkdir(`dist/${directory}`,{recursive:true});
    await writeFile(`dist/${directory ? directory + '/' : ''}index.html`,document(route,snapshot),'utf8');
  }
  await writeFile('dist/404.html',document('/404',snapshot),'utf8');
  console.log('已构建 Home、Project、About 和 /About 兼容入口。');
  if (process.argv.includes('--pages')) {
    // GitHub Pages 当前从 main 的根目录发布；只复制网站需要的文件，保留 CNAME。
    for (const entry of ['index.html','404.html','projects','about','app.mjs','styles.css','assets','content']) {
      await cp(`dist/${entry}`,entry,{recursive:true,force:true});
    }
    await writeFile('.nojekyll','');
    console.log('已生成 GitHub Pages 根目录发布文件。');
  }
} catch (error) { console.error(`构建失败：${error.message}`); process.exitCode = 1; }
