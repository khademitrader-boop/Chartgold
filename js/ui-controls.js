(function(){
  'use strict';
  // ---------- Back-to-top button (rAF-throttled, passive scroll listener) ----------
  var scrollTopBtn = document.getElementById('scrollTopBtn');
  var scrollTicking = false;
  function updateScrollTopBtn(){
    scrollTicking = false;
    if(window.scrollY > 480){ scrollTopBtn.classList.add('show'); }
    else{ scrollTopBtn.classList.remove('show'); }
  }
  window.addEventListener('scroll', function(){
    if(!scrollTicking){
      scrollTicking = true;
      requestAnimationFrame(updateScrollTopBtn);
    }
  }, { passive: true });
  scrollTopBtn.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Share button ----------
  var sharePill = document.getElementById('sharePill');
  if(sharePill){
    sharePill.addEventListener('click', function(){
      var shareData = {
        title: 'نبض بازار',
        text: 'نبض بازار؛ قیمت لحظه‌ای طلا، ارز و رمزارز در یک صفحه.',
        url: location.href
      };
      if(navigator.share){
        navigator.share(shareData).catch(function(){});
      }else if(navigator.clipboard){
        navigator.clipboard.writeText(shareData.url).then(function(){
          var original = sharePill.innerHTML;
          sharePill.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg> لینک کپی شد';
          setTimeout(function(){ sharePill.innerHTML = original; }, 1800);
        }).catch(function(){});
      }
    });
  }

})();
