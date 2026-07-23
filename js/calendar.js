(function(){
  'use strict';
  // ---------- Jalali (Shamsi) calendar, built on Intl's persian calendar ----------
  var calBtn = document.getElementById('calendarBtn');
  var calPopover = document.getElementById('calendarPopover');
  var calChipDate = document.getElementById('calChipDate');
  var calTitle = document.getElementById('calTitle');
  var calDays = document.getElementById('calDays');
  var calFoot = document.getElementById('calFoot');
  var calPrev = document.getElementById('calPrev');
  var calNext = document.getElementById('calNext');

  // ---------- Day notes (stored per Jalali date, shared via NBNotes) ----------
  var noteModalOverlay = document.getElementById('noteModalOverlay');
  var noteModalTitle = document.getElementById('noteModalTitle');
  var noteModalTextarea = document.getElementById('noteModalTextarea');
  var noteModalSave = document.getElementById('noteModalSave');
  var noteModalDelete = document.getElementById('noteModalDelete');
  var noteModalClose = document.getElementById('noteModalClose');
  var currentNoteKey = null;

  function openNoteModal(key, label){
    if(!noteModalOverlay || !window.NBNotes) return;
    currentNoteKey = key;
    var notes = window.NBNotes.load();
    noteModalTextarea.value = notes[key] || '';
    noteModalTitle.textContent = label;
    noteModalOverlay.removeAttribute('hidden');
    requestAnimationFrame(function(){ noteModalTextarea.focus(); });
  }
  function closeNoteModal(){
    if(!noteModalOverlay) return;
    noteModalOverlay.setAttribute('hidden', '');
    currentNoteKey = null;
  }
  if(noteModalSave){
    noteModalSave.addEventListener('click', function(){
      if(!currentNoteKey) return;
      window.NBNotes.setNote(currentNoteKey, noteModalTextarea.value);
      closeNoteModal();
    });
  }
  if(noteModalDelete){
    noteModalDelete.addEventListener('click', function(){
      if(!currentNoteKey) return;
      window.NBNotes.deleteNote(currentNoteKey);
      closeNoteModal();
    });
  }
  if(noteModalClose){
    noteModalClose.addEventListener('click', closeNoteModal);
  }
  if(noteModalOverlay){
    noteModalOverlay.addEventListener('click', function(e){
      if(e.target === noteModalOverlay){ closeNoteModal(); }
    });
  }

  // Notes-list section (or anywhere else) can ask the calendar to open the
  // edit modal for a given day without knowing anything about this file's
  // internals — it just dispatches this event.
  window.addEventListener('nb:open-note', function(e){
    if(!e.detail || !e.detail.key) return;
    openNoteModal(e.detail.key, e.detail.label || (window.NBNotes && window.NBNotes.labelFor(e.detail.key)) || '');
  });

  var monthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  var persianOpts = { calendar: 'persian', numberingSystem: 'latn', year: 'numeric', month: 'numeric', day: 'numeric' };
  var persianFmt, chipFmt;
  var calSupported = true;
  try{
    persianFmt = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', persianOpts);
    chipFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long', day: 'numeric', month: 'long' });
  }catch(e){ calSupported = false; }

  function jalaliParts(date){
    var parts = persianFmt.formatToParts(date);
    var o = {};
    parts.forEach(function(p){ o[p.type] = parseInt(p.value, 10); });
    return { y: o.year, m: o.month, d: o.day };
  }

  function addDays(date, n){
    var d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }

  // Given any date inside the target jalali month, find the Gregorian date of day 1
  function findMonthStart(anchor){
    var cur = new Date(anchor);
    var p = jalaliParts(cur);
    while(p.d !== 1){
      cur = addDays(cur, -1);
      p = jalaliParts(cur);
    }
    return cur;
  }

  // ---------- Reusable month-grid calendar ----------
  // Builds one independent calendar instance (its own month cursor) bound to
  // a given set of elements. The header popover calendar and the inline
  // calendar in the "یادداشت‌ها" section are both just instances of this,
  // so month navigation, "has-note" dots and day clicks behave identically
  // everywhere a calendar shows up on the page.
  function createMonthCalendar(refs){
    if(!refs || !refs.days) return null;
    var viewAnchor = new Date();

    function render(){
      if(!calSupported) return;
      var todayParts = jalaliParts(new Date());
      var start = findMonthStart(viewAnchor);
      var startParts = jalaliParts(start);

      // Persian week starts Saturday. JS getDay(): Sun=0..Sat=6 -> shift so Sat=0.
      var leadEmpty = (start.getDay() + 1) % 7;

      var count = 0;
      var cursor = new Date(start);
      while(true){
        var p = jalaliParts(cursor);
        if(p.m !== startParts.m) break;
        count++;
        cursor = addDays(cursor, 1);
        if(count > 31) break;
      }

      if(refs.title){ refs.title.textContent = monthNames[startParts.m - 1] + ' ' + startParts.y; }
      refs.days.innerHTML = '';

      for(var i = 0; i < leadEmpty; i++){
        var pad = document.createElement('button');
        pad.className = 'muted';
        pad.textContent = '';
        pad.disabled = true;
        refs.days.appendChild(pad);
      }

      var notes = window.NBNotes ? window.NBNotes.load() : {};
      for(var d = 1; d <= count; d++){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = d.toLocaleString('fa-IR');
        if(startParts.y === todayParts.y && startParts.m === todayParts.m && d === todayParts.d){
          btn.classList.add('today');
        }
        var dateKey = startParts.y + '-' + startParts.m + '-' + d;
        var dayLabel = monthNames[startParts.m - 1] + ' ' + d.toLocaleString('fa-IR') + '، ' + startParts.y.toLocaleString('fa-IR');
        if(notes[dateKey]){
          btn.classList.add('has-note');
          btn.title = 'یادداشت این روز: ' + notes[dateKey].slice(0, 40) + ' — برای ویرایش کلیک کنید';
        }else{
          btn.title = 'برای نوشتن یادداشت این روز کلیک کنید';
        }
        btn.dataset.noteKey = dateKey;
        btn.dataset.noteLabel = dayLabel;
        refs.days.appendChild(btn);
      }

      if(refs.foot){
        refs.foot.textContent = 'امروز: ' + monthNames[todayParts.m - 1] + ' ' + todayParts.d.toLocaleString('fa-IR') + '، ' + todayParts.y.toLocaleString('fa-IR');
      }
    }

    // Single delegated listener for all day buttons instead of one closure per
    // button — cheaper to set up and avoids rebuilding 30+ listeners every
    // time the calendar re-renders (month change, saving/deleting a note).
    refs.days.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-note-key]');
      if(!btn) return;
      e.stopPropagation();
      openNoteModal(btn.dataset.noteKey, btn.dataset.noteLabel);
    });

    if(refs.prev){
      refs.prev.addEventListener('click', function(e){
        e.stopPropagation();
        var start = findMonthStart(viewAnchor);
        viewAnchor = addDays(start, -1);
        render();
      });
    }
    if(refs.next){
      refs.next.addEventListener('click', function(e){
        e.stopPropagation();
        var start = findMonthStart(viewAnchor);
        var p = jalaliParts(start);
        var cursor = start, count = 0;
        while(true){
          var cp = jalaliParts(cursor);
          if(cp.m !== p.m) break;
          cursor = addDays(cursor, 1);
          count++;
          if(count > 31) break;
        }
        viewAnchor = cursor;
        render();
      });
    }
    if(refs.today){
      refs.today.addEventListener('click', function(e){
        e.stopPropagation();
        viewAnchor = new Date();
        render();
      });
    }

    return {
      render: render,
      resetToToday: function(){ viewAnchor = new Date(); render(); }
    };
  }

  // Header popover calendar (opens on demand)
  var headerCalendar = createMonthCalendar({
    title: calTitle, days: calDays, foot: calFoot, prev: calPrev, next: calNext
  });

  // Inline calendar in the "یادداشت‌ها" section (always visible on the page)
  var notesCalendar = createMonthCalendar({
    title: document.getElementById('notesCalTitle'),
    days: document.getElementById('notesCalDays'),
    foot: document.getElementById('notesCalFoot'),
    prev: document.getElementById('notesCalPrev'),
    next: document.getElementById('notesCalNext'),
    today: document.getElementById('notesCalToday')
  });
  if(notesCalendar){ notesCalendar.render(); }

  // Keep every calendar instance's "has-note" dots in sync whenever notes
  // change, no matter which calendar (or the notes list) triggered it.
  window.addEventListener('nb:notes-changed', function(){
    if(headerCalendar){ headerCalendar.render(); }
    if(notesCalendar){ notesCalendar.render(); }
  });

  function updateChip(){
    if(!calSupported){
      calChipDate.textContent = 'تقویم در دسترس نیست';
      return;
    }
    calChipDate.textContent = chipFmt.format(new Date());
  }

  updateChip();
  setInterval(updateChip, 60000);

  calBtn.addEventListener('click', function(){
    var open = calPopover.hasAttribute('hidden');
    if(open){
      if(headerCalendar){ headerCalendar.resetToToday(); }
      if(window.innerWidth <= 640){
        var headerEl = document.querySelector('header');
        var rect = headerEl.getBoundingClientRect();
        calPopover.style.top = (rect.bottom + 8) + 'px';
      }else{
        calPopover.style.top = '';
      }
      calPopover.removeAttribute('hidden');
      calBtn.setAttribute('aria-expanded', 'true');
    }else{
      calPopover.setAttribute('hidden', '');
      calBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', function(e){
    if(noteModalOverlay && !noteModalOverlay.hasAttribute('hidden') && noteModalOverlay.contains(e.target)){ return; }
    if(!calPopover.contains(e.target) && e.target !== calBtn && !calBtn.contains(e.target)){
      calPopover.setAttribute('hidden', '');
      calBtn.setAttribute('aria-expanded', 'false');
    }
  });

  if(!calSupported){
    updateChip();
  }

})();
