(function(){
  'use strict';

  var STORAGE_KEY = 'nb-theme';
  var root = document.documentElement;

  // persist=false is used for the initial sync on page load, so that a
  // theme resolved from the OS preference (prefers-color-scheme) is NOT
  // written to localStorage. Writing it there unconditionally was the bug:
  // once ANY value existed in localStorage, the "follow the OS theme live"
  // listener below always found a saved value and bailed out immediately,
  // so switching the OS/browser theme afterwards silently stopped updating
  // the site for anyone who had never explicitly clicked the toggle.
  function applyTheme(theme, persist){
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    if(persist){
      try{ localStorage.setItem(STORAGE_KEY, theme); }catch(e){}
    }

    var toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(function(btn){
      var isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      var label = isDark ? 'روشن کردن حالت نمایش' : 'تاریک کردن حالت نمایش';
      btn.setAttribute('title', label);
      btn.setAttribute('aria-label', label);
    });

    document.dispatchEvent(new CustomEvent('nb:themechange', { detail: { theme: theme } }));
  }

  // The <html data-theme> attribute is already set by the inline script in
  // <head> (to avoid a flash of the wrong theme). Here we just sync the
  // toggle buttons' state/labels to whatever was applied, and wire up clicks.
  // Not persisted: this may just be a reflection of the OS preference, not
  // an explicit choice.
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

  document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      // An explicit click always persists - this is a deliberate user choice.
      applyTheme(current === 'dark' ? 'light' : 'dark', true);
    });
  });

  // Follow the OS theme live, but only for as long as the person hasn't
  // picked an explicit preference of their own on this site.
  if(window.matchMedia){
    try{
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e){
        var saved = null;
        try{ saved = localStorage.getItem(STORAGE_KEY); }catch(err){}
        if(saved === 'dark' || saved === 'light') return;
        applyTheme(e.matches ? 'dark' : 'light', false);
      });
    }catch(e){}
  }

})();
