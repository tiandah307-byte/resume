/* 黄天达 · Portfolio — 交互脚本
   移动端导航 / 滚动出现 / 光晕卡片 / 导航高亮
   项目筛选 / 详情弹窗 / 图片放大 */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- 1) 移动端导航 ---------- */
  var toggle = $('#navToggle'), links = $('#navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') links.classList.remove('open'); });
  }

  /* ---------- 2) 滚动出现 ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i, 6) * 45) + 'ms';
      io.observe(el);
    });
  } else { reveals.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- 3) 光晕卡片 ---------- */
  $$('.glow-card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ---------- 4) 锚点滚动偏移 ---------- */
  var NAV_OFFSET = 76;
  $$('a[href*="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href') || '';
      var i = href.indexOf('#');
      if (i < 0) return;
      var hash = href.slice(i);
      if (hash === '#') return;
      var page = href.slice(0, i);
      if (page && page !== location.pathname.split('/').pop() && page.indexOf('.html') > -1) return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET, behavior: 'smooth' });
      history.replaceState(null, '', hash);
    });
  });

  /* ---------- 5) 首页导航高亮 ---------- */
  var sections = $$('main section[id]'), navA = $$('.nav-links a[href^="#"]');
  if (sections.length && navA.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navA.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 6) 项目筛选 ---------- */
  var tabs = $$('.filter-tab'), cards = $$('#projectList .project');
  function applyFilter(kind) {
    cards.forEach(function (c) {
      var kinds = (c.getAttribute('data-kind') || '').split(/\s+/);
      c.classList.toggle('is-hidden', kind !== 'all' && kinds.indexOf(kind) === -1);
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); });
      t.classList.add('is-active');
      applyFilter(t.getAttribute('data-filter'));
    });
  });
  $$('[data-filter-link]').forEach(function (el) {
    el.addEventListener('click', function () {
      var kind = el.getAttribute('data-filter-link');
      tabs.forEach(function (x) { x.classList.toggle('is-active', x.getAttribute('data-filter') === kind); });
      applyFilter(kind);
    });
  });

  /* ---------- 7) 详情弹窗 ---------- */
  var modal = $('#modal'), modalBody = $('#modalBody'), modalTitle = $('#modalTitle'),
      modalMeta = $('#modalMeta'), modalKicker = $('#modalKicker');
  var lastFocus = null;

  function detailHtml(key) {
    var src = document.querySelector('#detailSource [data-detail="' + key + '"]');
    return src ? src.innerHTML : '<p>暂无细节。</p>';
  }
  function openModal(key, title, meta, kicker) {
    if (!modal) return;
    modalTitle.textContent = title || '';
    modalMeta.textContent = meta || '';
    modalKicker.textContent = kicker || '详情';
    modalBody.innerHTML = detailHtml(key);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var closeBtn = $('.modal-close', modal); if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  $$('[data-open]').forEach(function (el) {
    var key = el.getAttribute('data-open');
    function fire(e) {
      if (e && e.target.closest('[data-zoom]')) return; // 点图片时走放大
      lastFocus = el;
      var card = el.closest('.project');
      if (card) {
        var t = $('h3', card), cat = $('.cat', card), team = $('.team', card);
        openModal(key, t ? t.textContent : '', [cat ? cat.textContent : '', team ? team.textContent : ''].filter(Boolean).join(' ｜ '), '项目详情');
      } else {
        var item = el.closest('.tl-item');
        var th = item ? $('h3', item) : null, when = item ? $('.tl-when', item) : null, role = item ? $('.tl-role', item) : null;
        openModal(key, th ? th.textContent : '', [when ? when.textContent : '', role ? role.textContent : ''].filter(Boolean).join(' ｜ '), '实习详情');
      }
    }
    el.addEventListener('click', fire);
    if (el.classList.contains('project')) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(e); }
      });
    }
  });

  if (modal) {
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
  }

  /* ---------- 8) 图片放大 ---------- */
  var lb = $('#lightbox'), lbImg = $('#lightboxImg');
  function openLightbox(src, alt) {
    if (!lb) return;
    lbImg.src = src; lbImg.alt = alt || '';
    lb.hidden = false; document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.hidden = true; lbImg.src = ''; document.body.style.overflow = modal && !modal.hidden ? 'hidden' : '';
  }
  document.addEventListener('click', function (e) {
    var img = e.target.closest('[data-zoom]');
    if (img) { e.preventDefault(); e.stopPropagation(); openLightbox(img.getAttribute('src'), img.getAttribute('alt')); }
  });
  if (lb) lb.addEventListener('click', closeLightbox);

  /* ---------- 9) 键盘 ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeLightbox(); closeModal(); }
  });
})();
