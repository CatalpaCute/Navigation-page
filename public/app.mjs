import { site } from './content/site.mjs';

const icons = {pause:'<path d="M9 6v12m6-12v12"/>',play:'<path d="m9 5 10 7-10 7Z"/>'};
const carousel = document.querySelector('.photo-composition');

if (carousel) {
  try {
    const slides = [...carousel.querySelectorAll('.photo-slide')];
    const toggle = carousel.querySelector('[data-carousel=pause]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let paused = reduceMotion.matches;
    let hovered = false;
    let focused = false;
    let timer = null;
    const failures = new Set();

    function updateToggle() {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? '开始自动轮播' : '暂停自动轮播');
      toggle.querySelector('svg').innerHTML = paused ? icons.play : icons.pause;
    }

    // 所有暂停条件汇入同一计时器生命周期，防止路由、焦点和可见性变化产生重复轮播。
    function schedule() {
      clearTimeout(timer);
      timer = null;
      if (paused || hovered || focused || document.hidden || slides.length < 2 || failures.size >= slides.length) return;
      timer = setTimeout(() => { show(index + 1); schedule(); }, 6500);
    }

    function show(next, announce = false) {
      const direction = next < index ? -1 : 1;
      let candidate = (next + slides.length) % slides.length;
      for (let tries = 0; failures.has(candidate) && tries < slides.length; tries++) candidate = (candidate + direction + slides.length) % slides.length;
      if (failures.size >= slides.length) {
        carousel.querySelector('.photo-fallback').hidden = false;
        paused = true;
        updateToggle();
        schedule();
        return;
      }
      carousel.querySelector('.photo-fallback').hidden = true;
      index = candidate;
      slides.forEach((slide, n) => {
        slide.classList.toggle('is-active', n === index);
        slide.setAttribute('aria-hidden', String(n !== index));
      });
      const photo = site.photos[index];
      carousel.querySelector('[data-photo-index]').textContent = String(index + 1).padStart(2,'0');
      carousel.querySelector('[data-photo-label]').textContent = photo.label;
      carousel.querySelector('[data-photo-title]').textContent = photo.title;
      if (announce) carousel.querySelector('[data-photo-announcement]').textContent = `第 ${index + 1} 张，共 ${slides.length} 张：${photo.title}`;
    }

    slides.forEach((slide,n) => {
      const fail = () => { failures.add(n); if (index === n) show(index + 1, true); };
      slide.addEventListener('error', fail);
      if (slide.complete && !slide.naturalWidth) fail();
    });
    carousel.addEventListener('click', event => {
      const button = event.target.closest('[data-carousel]');
      if (!button) return;
      if (button.dataset.carousel === 'pause') { paused = !paused; updateToggle(); }
      else show(index + (button.dataset.carousel === 'next' ? 1 : -1), true);
      schedule();
    });
    carousel.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1), true);
      schedule();
    });
    carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    carousel.addEventListener('focusin', () => { focused = true; schedule(); });
    carousel.addEventListener('focusout', event => { focused = carousel.contains(event.relatedTarget); schedule(); });
    document.addEventListener('visibilitychange', schedule);
    reduceMotion.addEventListener('change', event => { if (event.matches) paused = true; updateToggle(); schedule(); });
    window.addEventListener('pagehide', () => clearTimeout(timer));
    window.addEventListener('pageshow', schedule);
    updateToggle();
    schedule();
  } catch (error) {
    // 初始化异常时保留静态首图与导航，明确告知轮播暂不可用。
    console.error('照片轮播初始化失败。', error);
    const status = carousel.querySelector('[data-photo-announcement]');
    if (status) status.textContent = '自动轮播暂时不可用，仍可通过相册浏览照片。';
    carousel.querySelectorAll('button').forEach(button => { button.disabled = true; });
  }
}
