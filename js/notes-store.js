(function(){
  'use strict';
  // ---------- Shared day-notes store ----------
  // Both calendar.js (writing notes from the calendar popover) and
  // notes-list.js (reading notes for the "یادداشت‌ها" section) talk to
  // localStorage through this single module, so there is one source of
  // truth and one place that fires the "notes changed" event.
  var KEY = 'nb_calendar_notes_v1';
  var monthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

  function load(){
    try{ return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch(e){ return {}; }
  }

  function save(notes){
    try{ localStorage.setItem(KEY, JSON.stringify(notes)); }catch(e){}
    window.dispatchEvent(new CustomEvent('nb:notes-changed'));
  }

  function setNote(key, text){
    var notes = load();
    var val = (text || '').trim();
    if(val){ notes[key] = val; }
    else{ delete notes[key]; }
    save(notes);
  }

  function deleteNote(key){
    var notes = load();
    delete notes[key];
    save(notes);
  }

  function parseKey(key){
    var parts = key.split('-');
    return { y: parseInt(parts[0], 10), m: parseInt(parts[1], 10), d: parseInt(parts[2], 10) };
  }

  function labelFor(key){
    var p = parseKey(key);
    return monthNames[p.m - 1] + ' ' + p.d.toLocaleString('fa-IR') + '، ' + p.y.toLocaleString('fa-IR');
  }

  window.NBNotes = {
    KEY: KEY,
    monthNames: monthNames,
    load: load,
    save: save,
    setNote: setNote,
    deleteNote: deleteNote,
    parseKey: parseKey,
    labelFor: labelFor
  };
})();
