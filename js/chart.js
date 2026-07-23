(function(){
  'use strict';

  /* ---------- Chart widget ---------- */
  var tvContainer = document.getElementById('tvContainer');
  var loadingEl = document.getElementById('chartLoading');
  var errorEl = document.getElementById('chartError');
  var toolbarLabel = document.getElementById('toolbarLabel');
  var toolbarIcon = document.getElementById('toolbarIcon');
  var chartCard = document.getElementById('chartCard');
  var loadTimer = null;
  var mutationObserver = null;

  var ICONS = window.NB_ICONS;
  var CATEGORY_META = window.NB_CATEGORY_META;
  var SYMBOL_DB = window.NB_SYMBOL_DB;

  /* Accent color per category, used to tint the chart card (previously came
     from the quick-symbol chips, which have been removed from the page). */
  var ACCENT_COLORS = {
    crypto: '#8B7FD6',
    metal: '#C79A3D',
    forex: '#3FA0C9',
    oil: '#6B5B4A',
    index: '#2FAE6C',
    stock: '#8B7FD6'
  };

  function findEntry(symbol){
    for(var i=0;i<SYMBOL_DB.length;i++){ if(SYMBOL_DB[i].symbol === symbol) return SYMBOL_DB[i]; }
    return null;
  }

  var DEFAULT_SYMBOL = 'BINANCE:BTCUSDT';
  var initialEntry = findEntry(DEFAULT_SYMBOL) || SYMBOL_DB[0];
  var currentSymbol = initialEntry.symbol;

  function showLoading(){
    errorEl.classList.remove('show');
    loadingEl.hidden = false;
    loadingEl.style.opacity = '1';
  }
  function hideLoading(){
    if(loadingEl.hidden) return;
    loadingEl.style.opacity = '0';
    setTimeout(function(){ loadingEl.hidden = true; }, 250);
  }
  function showError(){
    hideLoading();
    errorEl.classList.add('show');
  }

  function setAccent(symbol){
    var entry = findEntry(symbol);
    var color = (entry && ACCENT_COLORS[entry.cat]) || '#1E8A55';
    chartCard.style.setProperty('--accent-live', color);
  }

  function buildWidget(symbol){
    if(mutationObserver){ mutationObserver.disconnect(); mutationObserver = null; }
    clearTimeout(loadTimer);
    tvContainer.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    showLoading();

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    var lightOverrides = {
      'paneProperties.background': '#FFFFFF',
      'paneProperties.backgroundType': 'solid',
      'paneProperties.vertGridProperties.color': 'rgba(47,174,108,0.07)',
      'paneProperties.horzGridProperties.color': 'rgba(47,174,108,0.07)',
      'mainSeriesProperties.candleStyle.upColor': '#2FAE6C',
      'mainSeriesProperties.candleStyle.downColor': '#E5484D',
      'mainSeriesProperties.candleStyle.borderUpColor': '#1E8A55',
      'mainSeriesProperties.candleStyle.borderDownColor': '#C23B3F',
      'mainSeriesProperties.candleStyle.wickUpColor': '#3FC382',
      'mainSeriesProperties.candleStyle.wickDownColor': '#E5484D',
      'mainSeriesProperties.hollowCandleStyle.upColor': '#2FAE6C',
      'mainSeriesProperties.hollowCandleStyle.downColor': '#E5484D',
      'mainSeriesProperties.haStyle.upColor': '#2FAE6C',
      'mainSeriesProperties.haStyle.downColor': '#E5484D'
    };

    var darkOverrides = {
      'paneProperties.background': '#182019',
      'paneProperties.backgroundType': 'solid',
      'paneProperties.vertGridProperties.color': 'rgba(63,195,130,0.08)',
      'paneProperties.horzGridProperties.color': 'rgba(63,195,130,0.08)',
      'mainSeriesProperties.candleStyle.upColor': '#3FC382',
      'mainSeriesProperties.candleStyle.downColor': '#FF6B70',
      'mainSeriesProperties.candleStyle.borderUpColor': '#2FAE6C',
      'mainSeriesProperties.candleStyle.borderDownColor': '#C23B3F',
      'mainSeriesProperties.candleStyle.wickUpColor': '#55D999',
      'mainSeriesProperties.candleStyle.wickDownColor': '#FF6B70',
      'mainSeriesProperties.hollowCandleStyle.upColor': '#3FC382',
      'mainSeriesProperties.hollowCandleStyle.downColor': '#FF6B70',
      'mainSeriesProperties.haStyle.upColor': '#3FC382',
      'mainSeriesProperties.haStyle.downColor': '#FF6B70'
    };

    var config = {
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Asia/Tehran',
      theme: isDark ? 'dark' : 'light',
      style: '1',
      locale: 'fa_IR',
      toolbar_bg: isDark ? '#182019' : '#F4FAF7',
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: false,
      calendar: false,
      studies: [],
      support_host: 'https://www.tradingview.com',
      overrides: isDark ? darkOverrides : lightOverrides
    };

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.text = JSON.stringify(config);
    script.onerror = showError;
    tvContainer.appendChild(script);

    mutationObserver = new MutationObserver(function(){
      if(tvContainer.querySelector('iframe')){
        hideLoading();
        clearTimeout(loadTimer);
        mutationObserver.disconnect();
      }
    });
    mutationObserver.observe(tvContainer, { childList: true, subtree: true });

    loadTimer = setTimeout(function(){
      if(!tvContainer.querySelector('iframe')){ showError(); }
    }, 14000);
  }

  function loadSymbol(symbol, label, iconHtml){
    currentSymbol = symbol;
    toolbarLabel.textContent = label || symbol;
    if(iconHtml) toolbarIcon.innerHTML = iconHtml;
    setAccent(symbol);
    buildWidget(symbol);
    renderSymbolList();
  }

  function selectSymbol(entry){
    loadSymbol(entry.symbol, entry.label, ICONS[entry.cat]);
    if(history.replaceState){
      var url = new URL(window.location.href);
      url.searchParams.set('symbol', entry.symbol);
      history.replaceState(null, '', url);
    }
  }

  /* ---------- Full symbol list (grouped by category) ---------- */
  var CATEGORY_ORDER = ['crypto', 'metal', 'forex', 'index', 'stock', 'oil'];
  var symbolListEl = document.getElementById('symbolListGroups');

  function renderSymbolList(){
    if(!symbolListEl) return;
    symbolListEl.innerHTML = '';

    CATEGORY_ORDER.forEach(function(cat){
      var entries = SYMBOL_DB.filter(function(e){ return e.cat === cat; });
      if(!entries.length) return;
      var meta = CATEGORY_META[cat];

      var group = document.createElement('div');
      group.className = 'symbol-list-group';

      var heading = document.createElement('div');
      heading.className = 'symbol-list-group-head';
      heading.style.setProperty('--item-c', meta.color);
      heading.innerHTML =
        '<span class="symbol-list-group-icon">' + ICONS[cat] + '</span>' +
        '<span>' + meta.label + '</span>' +
        '<span class="symbol-list-group-count">' + entries.length.toLocaleString('fa-IR') + '</span>';
      group.appendChild(heading);

      var rows = document.createElement('div');
      rows.className = 'symbol-list-rows';
      entries.forEach(function(entry){
        var row = document.createElement('button');
        row.type = 'button';
        row.className = 'symbol-list-row' + (entry.symbol === currentSymbol ? ' is-current' : '');
        row.innerHTML =
          '<span class="symbol-list-row-name">' + entry.name + '</span>' +
          '<span class="symbol-list-row-code">' + entry.symbol + '</span>';
        row.addEventListener('click', function(){ selectSymbol(entry); renderSymbolList(); });
        rows.appendChild(row);
      });
      group.appendChild(rows);
      symbolListEl.appendChild(group);
    });
  }

  /* ---------- Copy link ---------- */
  var toastEl = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  var toastTimer = null;
  function showToast(msg){
    toastMsg.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 2200);
  }
  document.getElementById('copyLinkBtn').addEventListener('click', function(){
    var url = new URL(window.location.href);
    url.searchParams.set('symbol', currentSymbol);
    var text = url.toString();
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ showToast('لینک این نمودار کپی شد'); }).catch(function(){ showToast('کپی لینک ناموفق بود'); });
    } else {
      var tmp = document.createElement('textarea');
      tmp.value = text;
      document.body.appendChild(tmp);
      tmp.select();
      try{ document.execCommand('copy'); showToast('لینک این نمودار کپی شد'); }catch(e){ showToast('کپی لینک ناموفق بود'); }
      document.body.removeChild(tmp);
    }
  });

  document.getElementById('reloadBtn').addEventListener('click', function(){
    buildWidget(currentSymbol);
  });
  document.getElementById('retryBtn').addEventListener('click', function(){
    buildWidget(currentSymbol);
  });

  /* ---------- Kick things off: use the symbol from the URL if present
     and valid, otherwise fall back to the default symbol ---------- */
  (function init(){
    var params = new URLSearchParams(window.location.search);
    var urlEntry = findEntry(params.get('symbol'));
    var startEntry = urlEntry || initialEntry;

    currentSymbol = startEntry.symbol;
    toolbarLabel.textContent = startEntry.label;
    toolbarIcon.innerHTML = ICONS[startEntry.cat];
    setAccent(currentSymbol);
    buildWidget(currentSymbol);
    renderSymbolList();
  })();

  /* ---------- Fullscreen (custom CSS overlay — works everywhere, no browser
     permission quirks, no dependency on the native Fullscreen API which can
     silently fail inside sandboxed/embedded preview frames) ---------- */
  var fsBtn = document.getElementById('fsBtn');
  var fsIconExpand = document.getElementById('fsIconExpand');
  var fsIconCompress = document.getElementById('fsIconCompress');
  var isFs = false;

  function setFullscreen(on){
    isFs = on;
    chartCard.classList.toggle('is-fullscreen', on);
    document.body.classList.toggle('fs-lock', on);
    fsIconExpand.style.display = on ? 'none' : '';
    fsIconCompress.style.display = on ? '' : 'none';
    fsBtn.setAttribute('aria-label', on ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه');
    fsBtn.setAttribute('title', on ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه');
    if(on){ chartCard.scrollIntoView({ block: 'start' }); }
  }

  fsBtn.addEventListener('click', function(){
    setFullscreen(!isFs);
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && isFs){ setFullscreen(false); }
  });

  /* ---------- Re-render the chart when dark/light mode is toggled, so the
     TradingView widget's own theme and colors stay in sync with the rest
     of the page ---------- */
  document.addEventListener('nb:themechange', function(){
    buildWidget(currentSymbol);
  });

})();
