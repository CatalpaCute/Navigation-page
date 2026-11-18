import { readFile, writeFile, rename } from 'node:fs/promises';
import { extractAbout } from '../src/lib/about.mjs';
import { site } from '../src/content/site.mjs';

const output = new URL('../src/content/about.json', import.meta.url);

try {
  const sourceArg = process.argv.indexOf('--file');
  const raw = sourceArg >= 0 ? await readFile(process.argv[sourceArg + 1], 'utf8') : await (async () => {
    const response = await fetch(site.aboutSource, {signal:AbortSignal.timeout(20000)});
    if (!response.ok) throw new Error(`来源返回 HTTP ${response.status}`);
    return response.text();
  })();
  const snapshot = {source:site.aboutSource, syncedAt:new Date().toISOString(), html:extractAbout(raw)};
  const temporary = new URL('./about.json.next', output);
  await writeFile(temporary, JSON.stringify(snapshot,null,2) + '\n', 'utf8');
  await rename(temporary, output);
  console.log('About 正文已同步。运行 npm run build 后即可发布更新。');
} catch (error) {
  let retained = false;
  try { retained = Boolean(JSON.parse(await readFile(output,'utf8')).html); } catch {}
  console.error(`About 同步失败：${error.message}${retained ? ' 已保留上一次内容。' : ' 尚无可用快照，请稍后重试。'}`);
  process.exitCode = 1;
}
