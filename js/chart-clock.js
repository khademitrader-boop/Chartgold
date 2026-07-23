(function(){
  'use strict';

  /* ---------- Clock ---------- */
  var clockHM = document.getElementById('clockHM');
  var clockSec = document.getElementById('clockSec');

  // Build the formatter once and reuse it. The previous version constructed
  // a brand new Intl.DateTimeFormat every single second, forever, which is
  // needless work on every tick for the lifetime of the tab - cheap per
  // call, but there's no reason to pay it 3600+ times an hour.
  var fmt;
  try{
    fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }catch(e){}

  function tickClock(){
    if(!fmt) return;
    var parts = {};
    fmt.formatToParts(new Date()).forEach(function(p){ parts[p.type] = p.value; });
    if(clockHM) clockHM.textContent = parts.hour + ':' + parts.minute;
    if(clockSec) clockSec.textContent = ':' + parts.second;
  }
  tickClock();
  setInterval(tickClock, 1000);

})();
