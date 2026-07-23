(function(){
  'use strict';

  var header = document.querySelector('header');
  if(!header) return;

  var THRESHOLD = 6;     // ignore tiny jitters (rubber-banding, etc.)
  var REVEAL_ZONE = 80;  // always show the header near the very top

  var lastY = window.scrollY || 0;
  var ticking = false;

  function isOpen(el){
    return !!el && !el.hidden;
  }

  function update(){
    ticking = false;

    var currentY = window.scrollY || 0;
    var delta = currentY - lastY;

    // Don't fight an open dropdown/popover: keep the header visible while
    // the mobile nav sheet or the calendar popover is open.
    var navSheet = document.getElementById('mainNavSheet');
    var calendarPopover = document.getElementById('calendarPopover');
    if(isOpen(navSheet) || isOpen(calendarPopover)){
      header.classList.remove('header-hide');
      lastY = currentY;
      return;
    }

    if(currentY <= REVEAL_ZONE){
      header.classList.remove('header-hide');
    } else if(Math.abs(delta) > THRESHOLD){
      if(delta > 0){
        // Finger drags up / content scrolls down -> tuck the header away.
        header.classList.add('header-hide');
      } else {
        // Finger drags down / content scrolls up -> bring the header back.
        header.classList.remove('header-hide');
      }
    }

    lastY = currentY;
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

})();
