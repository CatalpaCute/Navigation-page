import { site } from '../content/site.mjs';

export const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

const paths = {
  github: '<path d="M9 19c-4 1-4-2-6-2m12 4v-3.5c0-1 .1-1.6-.5-2.2 3.2-.4 6.5-1.6 6.5-7.2a5.6 5.6 0 0 0-1.5-4c.2-.6.6-2.5-.2-4-1.9 0-3.7 1.5-3.7 1.5a13 13 0 0 0-6.7 0S7.2.1 5.3.1c-.8 1.5-.4 3.4-.2 4a5.6 5.6 0 0 0-1.5 4c0 5.6 3.3 6.8 6.5 7.2-.6.6-.6 1.4-.6 2.2V21"/>',
  bilibili: '<rect x="3" y="6" width="18" height="15" rx="3"/><path d="m8 2 4 4m4-4-4 4M8 11v3m8-3v3m-7 3c2 1 4 1 6 0"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  diagonal: '<path d="M6 18 18 6M6 6h12v12"/>',
  previous: '<path d="m14 6-6 6 6 6"/>',
  next: '<path d="m10 6 6 6-6 6"/>',
  pause: '<path d="M9 6v12m6-12v12"/>',
  play: '<path d="m9 5 10 7-10 7Z"/>'
};
export const icon = (name, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.arrow}</svg>`;

const socials = () => site.social.map(item => `<a href="${escape(item.url)}" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="${escape(item.name)}" title="${escape(item.name)}">${icon(item.icon)}<span>${escape(item.name)}</span></a>`).join('');
const nav = route => ['Home','Project','About'].map((label, index) => {
  const url = ['/', '/projects', '/about'][index];
  return `<a href="${url}" ${route === url ? 'aria-current="page"' : ''}><span>${label}</span></a>`;
}).join('');

export function home() {
  const first = site.photos[0];
  return `<section class="home-grid">
    <div class="home-copy">
      <p class="eyebrow reveal">A LITTLE CORNER OF MY WORLD</p>
      <h1 class="home-title reveal"><span>你好呀，</span><span class="intro-line">这里是</span><span class="name-line">CatalpaCute<span class="name-dot">.</span></span></h1>
      <div class="home-links reveal"><a href="/about">Know about me ${icon('arrow')}</a><a href="/projects">And my projects ${icon('arrow')}</a></div>
      <div class="social-block reveal"><span class="small-label">ELSEWHERE</span><div class="social-links">${socials()}</div></div>
    </div>
    <section class="photo-composition reveal" aria-label="我的摄影轮播" aria-roledescription="轮播" tabindex="0">
      <div class="photo-note"><span>SCENES, GATHERED</span><span class="note-line"></span><span>THROUGH MY LENS</span></div>
      <div class="photo-paper"><div class="photo-window">${site.photos.map((photo, index) => `<img class="photo-slide ${index === 0 ? 'is-active' : ''}" src="${escape(photo.src)}" alt="${escape(photo.alt)}" width="1000" height="1200" style="object-position:${escape(photo.position)}" ${index ? 'loading="lazy" aria-hidden="true"' : 'fetchpriority="high"'} data-slide="${index}">`).join('')}<div class="photo-fallback" hidden><p>这张照片暂时无法显示。</p><a href="${escape(site.album)}" target="_blank" rel="noopener noreferrer">去相册看看</a></div></div></div>
      <div class="photo-side-note" aria-hidden="true">A MOMENT, KEPT.</div>
      <div class="photo-footer"><div class="photo-caption"><span class="small-label" data-photo-label>${escape(first.label)}</span><span data-photo-title>${escape(first.title)}</span></div><div class="carousel-controls"><button data-carousel="pause" aria-label="暂停自动轮播" aria-pressed="false">${icon('pause')}</button><button data-carousel="previous" aria-label="上一张照片">${icon('previous')}</button><span class="photo-count" aria-live="off"><span data-photo-index>01</span><span class="count-divider">/</span>${String(site.photos.length).padStart(2,'0')}</span><button data-carousel="next" aria-label="下一张照片">${icon('next')}</button></div></div>
      <span class="sr-only" role="status" data-photo-announcement></span>
    </section>
  </section>`;
}

export function projects() {
  return `<section class="inner-page"><div class="page-intro reveal"><p class="eyebrow">THINGS I’VE PUT INTO THE WORLD</p><h1>My projects<span class="name-dot">.</span></h1><p class="page-description">一些项目，一些想法。</p></div><div class="project-list">${site.projects.map(project => `<a class="project-row reveal" href="${escape(project.url)}" target="_blank" rel="noopener noreferrer"><span class="project-number">${project.number}</span><div class="project-main"><span class="small-label">${project.kind}</span><h2>${escape(project.title)}</h2><p>${escape(project.description)}</p></div><div class="project-destination"><span>${escape(new URL(project.url).hostname)}</span>${icon('diagonal')}</div></a>`).join('')}</div><div class="project-afterword reveal"><p>你可以通过这些（也许是）社媒平台找到我</p><div class="social-links">${socials()}</div></div></section>`;
}

export function about(snapshot) {
  return `<section class="inner-page about-page"><div class="page-intro reveal"><p class="eyebrow">THE PERSON BEHIND THE PAGES</p><h1>About me<span class="name-dot">.</span></h1><p class="page-description">数码、摄影、音乐，以及生活里的小事。</p></div><div class="about-layout"><aside class="about-margin reveal"><p>CatalpaCute</p><span>广东 · INFJ</span><a href="${escape(site.aboutSource)}" target="_blank" rel="noopener noreferrer">阅读博客上的原文 ${icon('diagonal')}</a><p class="sync-date">内容同步于<br><time datetime="${escape(snapshot.syncedAt)}">${escape(snapshot.syncedAt.slice(0,10))}</time></p></aside><article class="about-prose reveal" aria-label="关于 CatalpaCute">${snapshot.html}</article></div></section>`;
}

export function document(route, snapshot) {
  const body = route === '/projects' ? projects() : route === '/about' ? about(snapshot) : route === '/404' ? '<section class="inner-page"><div class="page-intro"><p class="eyebrow">404</p><h1>这一页走丢了。</h1><a class="text-link" href="/">回到 Home</a></div></section>' : home();
  const title = route === '/' ? 'CatalpaCute — A little corner of my world' : `${route === '/projects' ? 'Project' : route === '/about' ? 'About' : '404'} — CatalpaCute`;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f4edcf"><meta name="description" content="CatalpaCute 的个人空间：摄影、日常，以及我的网站与项目。"><title>${title}</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23f4edcf'/%3E%3Ctext x='12' y='47' font-family='sans-serif' font-style='italic' font-size='46' fill='%232b2c26'%3Ec%3C/text%3E%3C/svg%3E"><link rel="stylesheet" href="/styles.css?v=1.0.11"><link rel="preload" as="font" href="/assets/fonts/lato-300.woff2" type="font/woff2" crossorigin><script type="module" src="/app.mjs"></script></head><body class="${route === '/' ? 'is-home' : 'is-inner'}"><a class="skip-link" href="#main">跳到主要内容</a><header class="site-header"><nav class="main-nav" aria-label="主要导航">${nav(route)}</nav></header><main id="main" tabindex="-1">${body}</main><footer class="site-footer"><span>© ${new Date().getUTCFullYear()} CatalpaCute</span></footer><noscript><p class="noscript-note">照片自动轮播需要 JavaScript；页面内容和链接仍可正常浏览。</p></noscript></body></html>`;
}
