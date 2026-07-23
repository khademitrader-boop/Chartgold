(function(){
  'use strict';
  // ---------- Live Tehran clock ----------
  var hmEl = document.getElementById('clockHM');
  var secEl = document.getElementById('clockSec');
  var hmFmt, secFmt;
  try{
    hmFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit' });
    secFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tehran', second: '2-digit' });
  }catch(e){}

  function tick(){
    var now = new Date();
    if(hmFmt) hmEl.textContent = hmFmt.format(now);
    if(secFmt) secEl.textContent = ':' + secFmt.format(now);
  }
  tick();
  setInterval(tick, 1000);

  // ---------- Refresh button ----------
  var refreshBtn = document.getElementById('refreshBtn');
  refreshBtn.addEventListener('click', function(){
    if(refreshBtn.classList.contains('spinning')) return;
    refreshBtn.classList.add('spinning');
    setTimeout(function(){ location.reload(); }, 350);
  });

  // ---------- Widget skeleton -> content handoff ----------
  var timeBadgeFmt;
  try{
    timeBadgeFmt = new Intl.DateTimeFormat('fa-IR', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit' });
  }catch(e){}

  var badgeStampers = [];

  var frames = document.querySelectorAll('[data-widget]');
  frames.forEach(function(frame){
    var skeleton = frame.querySelector('.skeleton');
    var errorBox = frame.querySelector('.widget-error');
    var tgjuEl = frame.querySelector('tgju');
    var badge = frame.closest('.card') ? frame.closest('.card').querySelector('[data-updated-badge]') : null;
    var settled = false;
    var observer = null;

    function stampUpdated(){
      if(badge && timeBadgeFmt){ badge.textContent = timeBadgeFmt.format(new Date()); }
    }
    if(badge) badgeStampers.push(stampUpdated);

    function reveal(){
      if(settled) return;
      settled = true;
      skeleton.classList.add('hide');
      setTimeout(function(){ skeleton.style.display = 'none'; }, 450);
      // The min-height on .widget-frame only exists to reserve room for the
      // skeleton loader before real content arrives. Once the widget has
      // painted, drop that floor so the frame hugs the widget's actual
      // rendered height instead of leaving empty space below it.
      frame.classList.add('is-loaded');
      stampUpdated();
      // The handoff is a one-time job: once the widget has painted its first
      // content we stop watching the subtree. Leaving the observer attached
      // means every subsequent live price refresh re-fires this callback for
      // as long as the tab stays open, which is what was causing the lag.
      if(observer){ observer.disconnect(); observer = null; }
    }

    if(tgjuEl){
      observer = new MutationObserver(function(){
        if(tgjuEl.childNodes.length > 0){ reveal(); }
      });
      observer.observe(tgjuEl, { childList: true, subtree: true });

      setTimeout(function(){
        if(!settled){
          skeleton.classList.add('hide');
          errorBox.classList.add('show');
          if(observer){ observer.disconnect(); observer = null; }
        }
      }, 8000);
    }
  });

  // "Last updated" badges are decorative, so refresh them on a slow shared
  // timer instead of tying them to every live DOM mutation from the widgets.
  if(badgeStampers.length){
    setInterval(function(){
      badgeStampers.forEach(function(fn){ fn(); });
    }, 30000);
  }

})();
