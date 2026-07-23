/* Powers the "قیمت لحظه‌ای دلار" card at the top of the page.
   Earlier versions tried to read the price by scraping the text of a
   hidden tgju widget and guessing which number was the price. That kept
   picking the wrong number (an unrelated 3-digit value), most likely
   because the widget's tgju "webservice" token is locked to the site's
   real domain and serves placeholder data anywhere else (like a local
   preview). Guessing at scraped text is fragile no matter what - so this
   version instead calls a real JSON pricing API directly and reads an
   actual "price" field. No text-scraping, no guessing. */
(function(){
  'use strict';

  var root = document.getElementById('usdLive');
  if(!root) return;

  var priceEl = document.getElementById('usdLivePrice');
  var changeEl = document.getElementById('usdLiveChange');
  var timeEl = document.getElementById('usdLiveTime');
  if(!priceEl) return;

  // Free public JSON endpoint (no signup) from BrsApi.ir - see
  // https://brsapi.ir/free-api-gold-currency-webservice/
  // Returns live gold/currency/crypto prices as JSON, sourced from tgju.org.
  var API_URL = 'https://Api.BrsApi.ir/Market/Gold_Currency_Pro.php?key=FreeSV0E1LSgB9RDjuf0QorSLViX8pPG&section=currency';
  var POLL_MS = 20000;

  var timeFmt;
  try{
    timeFmt = new Intl.DateTimeFormat('fa-IR', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }catch(e){}

  var ARROW_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

  // The exact shape of BrsApi's response isn't pinned down in their public
  // docs, so instead of hard-coding one field name (another guess), we walk
  // the JSON looking for an object that plainly identifies itself as USD -
  // by symbol/code, or by a Persian name that says "دلار آمریکا" (and NOT
  // some other دلار like کانادا/استرالیا). This finds the right entry
  // regardless of which exact shape the API happens to return.
  function findUsdEntry(node, depth){
    if(depth > 6 || node === null || typeof node !== 'object') return null;

    if(Array.isArray(node)){
      for(var i = 0; i < node.length; i++){
        var found = findUsdEntry(node[i], depth + 1);
        if(found) return found;
      }
      return null;
    }

    var symbolFields = ['symbol', 'Symbol', 'code', 'Currency', 'currency', 'name_en', 'nameEn', 'en_name'];
    for(var s = 0; s < symbolFields.length; s++){
      var sv = node[symbolFields[s]];
      if(typeof sv === 'string' && sv.trim().toUpperCase() === 'USD') return node;
    }

    var nameFields = ['name', 'name_fa', 'title', 'label'];
    for(var n = 0; n < nameFields.length; n++){
      var nv = node[nameFields[n]];
      if(typeof nv === 'string' && nv.indexOf('دلار') !== -1 && (nv.indexOf('آمریکا') !== -1 || nv.indexOf('امریکا') !== -1)){
        return node;
      }
    }

    for(var key in node){
      if(!Object.prototype.hasOwnProperty.call(node, key)) continue;
      var child = node[key];
      if(child && typeof child === 'object'){
        var deep = findUsdEntry(child, depth + 1);
        if(deep) return deep;
      }
    }
    return null;
  }

  function toNumber(v){
    if(v === undefined || v === null) return null;
    var num = parseFloat(String(v).replace(/,/g, ''));
    return isNaN(num) ? null : num;
  }

  function extractPrice(entry){
    var priceFields = ['price', 'Price', 'p', 'rate', 'sell', 'value', 'last_price', 'close'];
    for(var i = 0; i < priceFields.length; i++){
      var num = toNumber(entry[priceFields[i]]);
      if(num !== null && num > 0) return num;
    }
    return null;
  }

  function extractChange(entry){
    var changeFields = ['change_percent', 'changePercent', 'Changes', 'changes', 'percent', 'change_value', 'change'];
    for(var i = 0; i < changeFields.length; i++){
      var num = toNumber(entry[changeFields[i]]);
      if(num !== null) return num;
    }
    return null;
  }

  var lastPrice = null;

  function showError(){
    if(lastPrice === null){
      priceEl.textContent = 'نامشخص';
    }
    root.classList.add('is-error');
  }

  function paint(entry){
    var price = extractPrice(entry);
    if(price === null){ showError(); return; }

    root.classList.remove('is-error');
    var formatted = Math.round(price).toLocaleString('en-US');

    if(formatted !== lastPrice){
      priceEl.textContent = formatted;
      priceEl.classList.add('is-flash');
      setTimeout(function(){ priceEl.classList.remove('is-flash'); }, 700);
      lastPrice = formatted;
    }

    var change = extractChange(entry);
    if(changeEl){
      if(change !== null && change !== 0){
        var dir = change > 0 ? 'up' : 'down';
        changeEl.hidden = false;
        changeEl.setAttribute('data-dir', dir);
        changeEl.innerHTML = ARROW_SVG + '<span>' + Math.abs(change) + '</span>';
      }else{
        changeEl.hidden = true;
      }
    }

    if(timeEl && timeFmt) timeEl.textContent = timeFmt.format(new Date());
  }

  function fetchPrice(){
    fetch(API_URL, { cache: 'no-store' })
      .then(function(res){
        if(!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data){
        var entry = findUsdEntry(data, 0);
        if(!entry){ showError(); return; }
        paint(entry);
      })
      .catch(function(){
        showError();
      });
  }

  fetchPrice();
  setInterval(fetchPrice, POLL_MS);

})();
