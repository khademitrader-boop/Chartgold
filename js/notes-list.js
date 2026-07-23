(function(){
  'use strict';
  var listEl = document.getElementById('notesList');
  var emptyEl = document.getElementById('notesEmpty');
  if(!listEl || !window.NBNotes) return;

  var monthNames = window.NBNotes.monthNames;

  function compareKeysDesc(a, b){
    var pa = window.NBNotes.parseKey(a);
    var pb = window.NBNotes.parseKey(b);
    if(pa.y !== pb.y) return pb.y - pa.y;
    if(pa.m !== pb.m) return pb.m - pa.m;
    return pb.d - pa.d;
  }

  function escapeHtml(str){
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render(){
    var notes = window.NBNotes.load();
    var keys = Object.keys(notes).sort(compareKeysDesc);

    listEl.innerHTML = '';

    if(!keys.length){
      emptyEl.removeAttribute('hidden');
      return;
    }
    emptyEl.setAttribute('hidden', '');

    keys.forEach(function(key){
      var p = window.NBNotes.parseKey(key);
      var item = document.createElement('article');
      item.className = 'note-item';
      item.dataset.noteKey = key;
      item.innerHTML =
        '<div class="note-item-date">' +
          '<span class="note-item-day">' + p.d.toLocaleString('fa-IR') + '</span>' +
          '<span class="note-item-month">' + monthNames[p.m - 1] + ' ' + p.y.toLocaleString('fa-IR') + '</span>' +
        '</div>' +
        '<p class="note-item-text">' + escapeHtml(notes[key]) + '</p>' +
        '<div class="note-item-actions">' +
          '<button type="button" class="note-item-btn note-item-edit" aria-label="ویرایش یادداشت">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>' +
          '</button>' +
          '<button type="button" class="note-item-btn note-item-delete" aria-label="حذف یادداشت">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>' +
          '</button>' +
        '</div>';
      listEl.appendChild(item);
    });
  }

  listEl.addEventListener('click', function(e){
    var item = e.target.closest('.note-item');
    if(!item) return;
    var key = item.dataset.noteKey;

    if(e.target.closest('.note-item-delete')){
      window.NBNotes.deleteNote(key);
      return;
    }
    // Edit button, or a tap anywhere else on the card, opens it for editing.
    window.dispatchEvent(new CustomEvent('nb:open-note', {
      detail: { key: key, label: window.NBNotes.labelFor(key) }
    }));
  });

  window.addEventListener('nb:notes-changed', render);
  render();
})();
