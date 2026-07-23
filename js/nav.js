(function(){
  'use strict';

  var nav = document.getElementById('mainNav');
  var toggle = document.getElementById('mainNavToggle');
  var sheet = document.getElementById('mainNavSheet');
  var toggleLabel = document.getElementById('mainNavToggleLabel');
  var defaultLabel = toggleLabel ? toggleLabel.textContent : '';

  // ---------- Mobile sheet open/close ----------
  function isOpen(){
    return !!toggle && toggle.getAttribute('aria-expanded') === 'true';
  }

  function closeSheet(){
    if(!toggle || !sheet) return;
    toggle.setAttribute('aria-expanded', 'false');
    sheet.hidden = true;
  }

  function openSheet(){
    if(!toggle || !sheet) return;
    toggle.setAttribute('aria-expanded', 'true');
    sheet.hidden = false;
  }

  if(toggle && sheet){
    toggle.addEventListener('click', function(){
      if(isOpen()){ closeSheet(); } else { openSheet(); }
    });

    sheet.addEventListener('click', function(e){
      if(e.target.closest('a')){ closeSheet(); }
    });

    document.addEventListener('click', function(e){
      if(!nav) return;
      if(isOpen() && !nav.contains(e.target)){ closeSheet(); }
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && isOpen()){
        closeSheet();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function(){
      if(window.innerWidth > 640 && isOpen()){ closeSheet(); }
    });
  }

  // ---------- Scroll-spy: highlight the section currently in view ----------
  var navLinks = document.querySelectorAll('.mainnav-link[data-nav], .mainnav-sheet-link[data-nav]');
  if(!navLinks.length) return;

  var sectionIds = [];
  navLinks.forEach(function(link){
    var id = link.getAttribute('data-nav');
    if(id && document.getElementById(id) && sectionIds.indexOf(id) === -1){
      sectionIds.push(id);
    }
  });
  if(!sectionIds.length || !('IntersectionObserver' in window)) return;

  var sections = sectionIds.map(function(id){ return document.getElementById(id); });

  function setActive(id){
    navLinks.forEach(function(link){
      var match = link.getAttribute('data-nav') === id;
      link.classList.toggle('is-active', match);
      if(match){ link.setAttribute('aria-current', 'true'); }
      else{ link.removeAttribute('aria-current'); }
    });
    if(toggleLabel){
      var activeCapsuleLink = document.querySelector('.mainnav-link[data-nav="' + id + '"] span');
      toggleLabel.textContent = activeCapsuleLink ? activeCapsuleLink.textContent : defaultLabel;
    }
  }

  var current = null;
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ current = entry.target.id; }
    });
    if(current){ setActive(current); }
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(function(sec){ observer.observe(sec); });

})();
