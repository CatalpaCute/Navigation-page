import { load } from 'cheerio';
import { site } from '../content/site.mjs';

const allowedTags = new Set(['h2','h3','h4','h5','h6','p','ul','ol','li','a','strong','em','code','pre','blockquote','br','hr','del','img','table','thead','tbody','tr','th','td','figure','figcaption']);
const emoji = /[\p{Extended_Pictographic}\uFE0F\u200D]/gu;

export function extractAbout(raw) {
  const $ = load(raw);
  const source = $('.page-template-content.markdown-body').first();
  if (!source.length) throw new Error('没有找到 About 正文，原网页结构可能发生了变化。');
  source.find('script,style,iframe,form,input,button,object,embed,svg,.headerlink,.link-icon').remove();
  source.children('h1').remove();
  if (source.children().first().text().trim() === site.name) source.children().first().remove();
  source.find('*').each((_, element) => {
    const item = $(element);
    const tag = element.tagName;
    if (!allowedTags.has(tag)) { item.replaceWith(item.contents()); return; }
    const attrs = { ...element.attribs };
    for (const key of Object.keys(attrs)) item.removeAttr(key);
    // 原站 h4 用作二级栏目；在新页面 h2 下转为 h3，保留自然的标题层级。
    if (tag === 'h4') element.tagName = 'h3';
    if (tag === 'a') {
      try {
        const url = new URL(attrs.href || '', site.aboutSource);
        if (!['https:','http:','mailto:'].includes(url.protocol)) { item.replaceWith(item.contents()); return; }
        item.attr('href', url.href);
        if (url.protocol !== 'mailto:') item.attr('target','_blank').attr('rel','noopener noreferrer');
      } catch { item.replaceWith(item.contents()); }
    }
    if (tag === 'img') {
      try {
        const url = new URL(attrs['data-src'] || attrs.src || '', site.aboutSource);
        if (!['https:','http:'].includes(url.protocol)) { item.remove(); return; }
        item.attr('src',url.href).attr('alt',(attrs.alt || 'About 中的照片').replace(emoji,'')).attr('loading','lazy');
      } catch { item.remove(); }
    }
  });
  // 只处理文本节点，避免用正则误伤 URL、HTML 结构或保留不必要的主题装饰。
  function cleanText(node) {
    if (node.type === 'text') node.data = node.data.replace(emoji,'');
    for (const child of node.children || []) cleanText(child);
  }
  cleanText(source[0]);
  if (source.text().trim().length < 100) throw new Error('提取的正文过短，已停止覆盖以保护已有内容。');
  return source.html().trim();
}
