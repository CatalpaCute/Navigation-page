import { mkdir, writeFile } from 'node:fs/promises';
import { site } from '../src/content/site.mjs';

const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
async function download(url, path) {
  const response = await fetch(url, {signal:AbortSignal.timeout(30000),headers:{'User-Agent':agent}});
  if (!response.ok) throw new Error(`${url} 返回 HTTP ${response.status}`);
  const data = new Uint8Array(await response.arrayBuffer());
  await writeFile(path,data);
  return data.byteLength;
}
try {
  await mkdir('public/assets/fonts', {recursive:true});
  await mkdir('public/assets/photos', {recursive:true});
  const fontsResponse = await fetch('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&family=Outfit:wght@300..600&family=Manrope:wght@400..700&display=swap', {headers:{'User-Agent':agent},signal:AbortSignal.timeout(20000)});
  if (!fontsResponse.ok) throw new Error('字体样式下载失败');
  const css = await fontsResponse.text();
  const fonts = [...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[\s\S]*?\})/g)].map(match => {
    const block = match[1];
    return {url:block.match(/url\((.*?)\)/)[1],name:block.includes('Manrope') ? 'manrope' : block.includes('Outfit') ? 'outfit' : `lato-${block.match(/font-weight:\s*(\d+)/)[1]}`};
  });
  if (fonts.length !== 4) throw new Error('字体响应结构不符合预期');
  const results = await Promise.allSettled([
    ...fonts.map(font => download(font.url, `public/assets/fonts/${font.name}.woff2`)),
    ...site.photos.map(photo => download(photo.source,`public${photo.src}`))
  ]);
  for (const [index,result] of results.entries()) {
    if (result.status === 'rejected') throw result.reason;
    console.log(`素材 ${index + 1} 已保存：${result.value} bytes`);
  }
} catch (error) { console.error(`素材准备失败：${error.message}`); process.exitCode = 1; }
