/* 黄天达 · Portfolio — 交互脚本
   1) 移动端导航  2) 滚动出现动画  3) 光晕卡片光标跟随  4) 导航高亮 + 锚点偏移 */
(function () {
  'use strict';

  // 1) 移动端导航
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  // 2) 滚动出现
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i, 6) * 45) + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // 3) 光晕卡片：光标位置驱动边框光
  document.querySelectorAll('.glow-card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // 4) 锚点滚动偏移（避开 sticky 导航）
  var NAV_OFFSET = 76;
  document.querySelectorAll('a[href*="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#')) : null;
      if (!hash || hash === '#') return;
      var samePage = href.indexOf('#') === 0 ||
        href.split('#')[0] === location.pathname.split('/').pop() ||
        href.split('#')[0] === '';
      if (!samePage) return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', hash);
    });
  });

  // 5) 首页导航高亮
  var sections = document.querySelectorAll('main section[id]');
  var navA = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navA.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navA.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
