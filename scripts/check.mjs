import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { load } from 'cheerio';
import { site } from '../src/content/site.mjs';
import { document } from '../src/lib/render.mjs';
import { extractAbout } from '../src/lib/about.mjs';
import { loadAbout } from '../src/lib/load-about.mjs';

try {
  const snapshot = JSON.parse(await readFile('src/content/about.json','utf8'));
  const about = await loadAbout();
  const home = load(document('/'));
  assert.equal(home('h1').length,1);
  assert.equal(home('a[href="/about"]').length,2);
  assert.equal(home('a[href="/projects"]').length,2);
  for (const route of ['/','/about','/projects']) {
    const page = load(document(route,about));
    assert.equal(page('nav a[aria-current="page"]').attr('href'),route);
    assert.equal(page('main').length,1);
    for (const element of page('a').toArray()) {
      const link = page(element);
      assert.ok(!/^(javascript|data):/i.test(link.attr('href') || ''));
      if (link.attr('target') === '_blank') assert.ok(link.attr('rel').includes('noopener'));
    }
  }
  const projects = load(document('/projects'));
  assert.deepEqual(projects('.project-row').map((_,node)=>projects(node).attr('href')).get(),site.projects.map(project=>project.url));
  for (const photo of site.photos) await access(`public${photo.src}`);
  for (const font of ['outfit','lato-300','lato-400','manrope']) await access(`public/assets/fonts/${font}.woff2`);
  const hostile = `<div class="page-template-content markdown-body"><h1>关于我</h1><h3>CatalpaCute</h3><p>${'真实正文。'.repeat(30)}</p><script>alert(1)</script><iframe src="https://example.com"></iframe><a onclick="alert(1)" href="javascript:alert(1)">保留文字</a><a href="/masonry">相册</a><img onerror="alert(1)" src="https://example.com/photo.jpg"><div style="color:red">保留嵌套正文</div></div>`;
  const safe = load(extractAbout(hostile));
  assert.equal(safe('script,iframe,[onclick],[onerror],[style]').length,0);
  assert.equal(safe('a[href^="javascript:"]').length,0);
  assert.ok(safe.text().includes('保留嵌套正文'));
  assert.equal(safe('a').attr('href'),'https://me.czzzz.work/masonry');
  assert.throws(()=>extractAbout('<div>来源结构已变化</div>'),/没有找到/);
  assert.throws(()=>extractAbout('<div class="page-template-content markdown-body"><p>错误页面</p></div>'),/过短/);
  assert.ok(!/[\p{Extended_Pictographic}]/u.test(load(snapshot.html).text()));
  console.log('已通过：页面入口、项目链接、字体与照片、About 内容清洗和异常来源检查。');
} catch (error) { console.error(`检查失败：${error.message}`); process.exitCode = 1; }
