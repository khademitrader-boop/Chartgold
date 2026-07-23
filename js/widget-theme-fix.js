(function(){
  'use strict';

  // The tgju widget script (market cards, dollar highlight) injects its own
  // markup and keeps re-rendering it on every live price tick, sometimes
  // reapplying its own inline background/border/color styles as it does.
  // css/style.css already forces backgrounds transparent with `!important`
  // for the table-based widgets, which is enough on its own in every normal
  // case - this script is a backup net so no widget can ever get stuck
  // showing a stray white background, even if a future tgju update changes
  // how it renders.
  //
  // It also neutralizes inline TEXT color, which style.css's table rules
  // can't reach on widget types that don't render as a plain table (e.g.
  // the "market-overview" widget used for the real-time dollar price,
  // which renders its number in a plain black inline-styled span instead
  // of a <td>). That black text was unreadable on the dark panel behind it
  // in dark mode. To stay safe, only near-black/white/gray inline colors
  // are cleared - anything with a clear red or green tint (tgju's up/down
  // price coding) is left completely untouched.

  var BG_PROPS = ['background', 'backgroundColor', 'backgroundImage', 'borderColor', 'boxShadow'];

  function stripInlineBackground(el){
    if(!el || !el.style) return;
    BG_PROPS.forEach(function(prop){
      if(el.style[prop]) el.style[prop] = '';
    });
  }

  // ---------- Grayscale-only inline color neutralizer ----------
  function parseRgb(str){
    if(!str) return null;
    var m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if(m) return { r: +m[1], g: +m[2], b: +m[3] };
    m = str.match(/^#([0-9a-f]{3})$/i);
    if(m){
      return {
        r: parseInt(m[1][0] + m[1][0], 16),
        g: parseInt(m[1][1] + m[1][1], 16),
        b: parseInt(m[1][2] + m[1][2], 16)
      };
    }
    m = str.match(/^#([0-9a-f]{6})$/i);
    if(m){
      return {
        r: parseInt(m[1].slice(0, 2), 16),
        g: parseInt(m[1].slice(2, 4), 16),
        b: parseInt(m[1].slice(4, 6), 16)
      };
    }
    return null;
  }

  function isGrayscale(rgb){
    var max = Math.max(rgb.r, rgb.g, rgb.b);
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    return (max - min) < 16;
  }

  function stripInlineColor(el){
    if(!el || !el.style || !el.style.color) return;
    var rgb = parseRgb(el.style.color);
    if(rgb && isGrayscale(rgb)){
      el.style.color = '';
    }
  }

  function sweep(root){
    stripInlineBackground(root);
    stripInlineColor(root);
    if(root.querySelectorAll){
      root.querySelectorAll('*').forEach(function(el){
        stripInlineBackground(el);
        stripInlineColor(el);
      });
    }
  }

  function watch(tgjuEl){
    sweep(tgjuEl);
    var observer = new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        if(m.type === 'attributes' && m.target){
          stripInlineBackground(m.target);
          stripInlineColor(m.target);
        }
        if(m.addedNodes){
          m.addedNodes.forEach(function(node){
            if(node.nodeType === 1) sweep(node);
          });
        }
      });
    });
    observer.observe(tgjuEl, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });
  }

  function init(){
    document.querySelectorAll('tgju').forEach(watch);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }

  // Re-sweep on every theme flip too, in case something painted between
  // renders that the observer missed.
  document.addEventListener('nb:themechange', function(){
    document.querySelectorAll('tgju').forEach(sweep);
  });

})();
