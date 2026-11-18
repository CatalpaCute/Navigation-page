import { readFile } from 'node:fs/promises';
import MarkdownIt from 'markdown-it';

const content = new URL('../content/', import.meta.url);
const markdown = new MarkdownIt({html: false});

async function readJson(filename) {
  const text = await readFile(new URL(filename, content), 'utf8');
  try {
    return JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch {
    throw new Error(`${filename} 不是有效的 JSON。`);
  }
}

export async function loadAbout() {
  const settings = await readJson('about-mode.json');
  if (settings?.mode === 'manual') {
    const draft = await readFile(new URL('about.md', content), 'utf8');
    const html = markdown.render(draft).trim();
    if (!html) throw new Error('手写 About 正文为空，请先填写 src/content/about.md。');
    return {mode: 'manual', html};
  }
  if (settings?.mode === 'blog') {
    const snapshot = await readJson('about.json');
    if (typeof snapshot?.html !== 'string' || !snapshot.html.trim()
      || typeof snapshot.syncedAt !== 'string' || !Number.isFinite(Date.parse(snapshot.syncedAt))) {
      throw new Error('博客 About 快照不完整，请先运行 npm run sync:about。');
    }
    return {mode: 'blog', html: snapshot.html, syncedAt: snapshot.syncedAt};
  }
  throw new Error('请在 src/content/about-mode.json 中将 mode 设置为 blog 或 manual。');
}
