// assets/script.js - نسخة مستقرة مع ربط جميع الأزرار
(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2,'0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parseDate = s => {
    if (!s || typeof s !== 'string') return new Date();
    const parts = s.split('-');
    if (parts.length !== 3) return new Date();
    const [y,m,d] = parts.map(Number);
    return new Date(y, m-1, d);
  };
  const addDays = (d,n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
  const startWeek = d => addDays(d, -((d.getDay()+6)%7));
  const sameDay = (a,b) => iso(a) === iso(b);
  const esc = s => String(s??'').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  
  const colors = {
    work: ['#8b5cf6','#ede9fe','#5b21b6'],
    personal: ['#06b6d4','#cffafe','#155e75'],
    health: ['#10b981','#d1fae5','#065f46'],
    birthdays: ['#f59e0b','#fef3c7','#92400e'],
    study: ['#3b82f6','#dbeafe','#1e40af']
  };

  let currentUser = localStorage.getItem('chrona_user') || null;
  let userProfile = JSON.parse(localStorage.getItem('chrona_profile') || '{"fullName":"","email":"","phone":""}');
  let isAdmin = false;
  const API_BASE = window.location.origin;

  let state = {
    view: localStorage.getItem('chrona-view') || 'month',
    cursor: localStorage.getItem('chrona-cursor') || iso(new Date()),
    theme: localStorage.getItem('chrona-theme') || 'dark',
    visible: JSON.parse(localStorage.getItem('chrona-visible') || '{"work":true,"personal":true,"health":true,"birthdays":true,"study":true}'),
    events: []
  };

  const saveUIState = () => {
    localStorage.setItem('chrona-view', state.view);
    localStorage.setItem('chrona-cursor', state.cursor);
    localStorage.setItem('chrona-theme', state.theme);
    localStorage.setItem('chrona-visible', JSON.stringify(state.visible));
  };

  const fmt = (d, opt) => new Intl.DateTimeFormat('en-US', opt).format(d);
  const shownEvents = () => state.events.filter(e => state.visible[e.calendar] !== false);
  
  async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (currentUser) headers['X-Username'] = currentUser;
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(API_BASE + endpoint, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  function migrateLocalEvent(e) {
    if (e.start && !e.time) return e;
    return {
      id: e.id || uid(),
      title: e.title,
      date: e.date,
      start: e.time || e.start || "09:00",
      end: e.endTime || e.end || "10:00",
      calendar: e.calendar || e.type || "work",
      location: e.location || "",
      notes: e.notes || "",
      guests: e.guests || "",
      recurrence: e.recurrence || "none",
      description: e.description || "",
      alert: e.alert || "now",
      color: e.color || null,
      type: e.type || e.calendar || "work",
      status: e.status || "pending",
      createdAt: e.createdAt,
      updatedAt: e.updatedAt
    };
  }

  async function loadEvents() {
    try {
      const data = await apiCall('/events');
      state.events = (data.events || []).map(migrateLocalEvent);
    } catch (err) {
      toast('Failed to load events');
      if (err.message.includes('401') || err.message.includes('not found')) logout();
    }
  }

  // ---- تهيئة التطبيق ----
  function init() {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    bindGlobalEvents();
    if (currentUser) showApp(); else renderAuth();
  }

  // ---- ربط الأحداث العالمية ----
  function bindGlobalEvents() {
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-action]');
      if (!b) return;
      const action = b.dataset.action;
      if (action === 'new-event') openEvent({ date: b.dataset.date || state.cursor, start: b.dataset.time || '09:00', end: '10:00', calendar: 'work' });
      else if (action === 'today') { state.cursor = iso(new Date()); render(); }
      else if (action === 'prev' || action === 'next') navigate(action === 'next' ? 1 : -1);
      else if (action === 'sidebar') $('#sidebar').classList.toggle('-translate-x-full');
      else if (action === 'theme') { state.theme = state.theme === 'dark' ? 'light' : 'dark'; document.documentElement.classList.toggle('dark'); saveUIState(); render(); }
      else if (action === 'view') { state.view = b.dataset.view; saveUIState(); render(); }
      else if (action === 'event') openEvent(state.events.find(x => x.id === b.dataset.id));
      else if (action === 'day') { state.cursor = b.dataset.date; state.view = 'day'; render(); }
      else if (action === 'toggle-cal') { state.visible[b.dataset.cal] = !state.visible[b.dataset.cal]; saveUIState(); render(); }
      else if (action === 'search') openSearch();
      else if (action === 'more') openMore();
      else if (action === 'admin') openAdmin();
    });

    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') closeModal();
      if (!$('.modal-backdrop') && e.key.toLowerCase() === 'c') openEvent({ date: state.cursor, start: '09:00', end: '10:00', calendar: 'work' });
      if (!$('.modal-backdrop') && e.key.toLowerCase() === 't') { state.cursor = iso(new Date()); render(); }
      if (!$('.modal-backdrop') && e.key === 'ArrowLeft') navigate(-1);
      if (!$('.modal-backdrop') && e.key === 'ArrowRight') navigate(1);
    });

    $('#importFile')?.addEventListener('change', importFile);
  }

  // ---- عرض التطبيق ----
  async function showApp() {
    $('#authRoot').classList.add('hidden');
    $('#appRoot').classList.remove('hidden');
    $('#avatarText').textContent = (userProfile.fullName || currentUser).slice(0, 2).toUpperCase();
    await loadEvents();
    try {
      await apiCall('/admin/users');
      isAdmin = true;
      $('#adminBtn').classList.remove('hidden');
    } catch { isAdmin = false; $('#adminBtn').classList.add('hidden'); }
    render();
  }

  // ---- التنقل ----
  function navigate(dir) {
    let d = parseDate(state.cursor);
    if (state.view === 'month') d.setMonth(d.getMonth() + dir);
    else if (state.view === 'week') d = addDays(d, dir * 7);
    else d = addDays(d, dir);
    state.cursor = iso(d);
    render();
  }

  // ---- العرض ----
  function render() {
    saveUIState();
    const d = parseDate(state.cursor);
    $('#themeIcon').textContent = state.theme === 'dark' ? '☀' : '☾';
    $('#periodTitle').textContent = state.view === 'month' ? fmt(d, { month: 'long', year: 'numeric' }) :
      state.view === 'week' ? `${fmt(startWeek(d), { month: 'short', day: 'numeric' })} – ${fmt(addDays(startWeek(d), 6), { month: 'short', day: 'numeric', year: 'numeric' })}` :
      fmt(d, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    renderSwitchers();
    renderMini();
    renderCalendars();
    renderView();
    updateInsight();
  }

  function renderSwitchers() {
    const html = ['month', 'week', 'day', 'agenda'].map(v =>
      `<button class="view-btn ${state.view === v ? 'active' : ''}" data-action="view" data-view="${v}">${v[0].toUpperCase() + v.slice(1)}</button>`
    ).join('');
    $('#viewSwitcher').innerHTML = html;
    $('#mobileViewSwitcher').innerHTML = html;
  }

  function renderMini() {
    const d = parseDate(state.cursor);
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const start = addDays(first, -((first.getDay() + 6) % 7));
    let days = '';
    for (let i = 0; i < 42; i++) {
      const x = addDays(start, i);
      days += `<button data-action="day" data-date="${iso(x)}" class="mini-day ${sameDay(x, new Date()) ? 'is-today' : ''} ${iso(x) === state.cursor ? 'is-selected' : ''} ${x.getMonth() !== d.getMonth() ? 'opacity-30' : ''}">${x.getDate()}</button>`;
    }
    $('#miniCalendar').innerHTML = `
      <div class="mb-3 flex items-center justify-between">
        <span class="font-display text-sm font-bold">${fmt(d, { month: 'long', year: 'numeric' })}</span>
        <div>
          <button class="icon-btn !h-7 !min-w-7" data-action="prev">‹</button>
          <button class="icon-btn !h-7 !min-w-7" data-action="next">›</button>
        </div>
      </div>
      <div class="mini-grid mb-1 text-[9px] font-bold text-slate-400">${['M','T','W','T','F','S','S'].map(x => `<div>${x}</div>`).join('')}</div>
      <div class="mini-grid">${days}</div>
    `;
  }

  function renderCalendars() {
    $('#calendarList').innerHTML = '<p class="mb-3 px-3 text-[11px] font-bold uppercase tracking-[.18em] text-slate-400">My calendars</p>' +
      Object.entries(colors).map(([k, c]) =>
        `<button class="cal-toggle ${state.visible[k] ? '' : 'off'}" data-action="toggle-cal" data-cal="${k}">
          <span class="dot" style="background:${c[0]}"></span>
          <span class="flex-1 text-left capitalize">${k}</span>
          <span>${state.visible[k] ? '✓' : '○'}</span>
        </button>`
      ).join('');
  }

  function renderView() {
    if (state.view === 'month') renderMonth();
    else if (state.view === 'week' || state.view === 'day') renderTimeGrid();
    else renderAgenda();
  }

  function chip(e, i = 0) {
    const c = e.color ? [e.color, e.color + '22', e.color] : (colors[e.calendar] || colors.work);
    return `<button data-action="event" data-id="${e.id}" class="event-chip" style="background:${c[1]};color:${c[2]};animation-delay:${i*25}ms"><span class="mr-1 opacity-60">${e.start}</span>${esc(e.title)}</button>`;
  }

  function renderMonth() {
    const d = parseDate(state.cursor);
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const start = addDays(first, -((first.getDay() + 6) % 7));
    const events = shownEvents();
    let cells = '';
    for (let i = 0; i < 42; i++) {
      const x = addDays(start, i);
      const dayEvents = events.filter(e => e.date === iso(x)).sort((a, b) => a.start.localeCompare(b.start));
      cells += `<div class="month-cell ${x.getMonth() !== d.getMonth() ? 'outside' : ''} ${sameDay(x, new Date()) ? 'today' : ''}" data-action="new-event" data-date="${iso(x)}">
        <button class="day-num" data-action="day" data-date="${iso(x)}">${x.getDate()}</button>
        ${dayEvents.slice(0, 3).map(chip).join('')}
        ${dayEvents.length > 3 ? `<button class="more-chip" data-action="day" data-date="${iso(x)}">+${dayEvents.length - 3} more</button>` : ''}
      </div>`;
    }
    $('#calendarView').innerHTML = `
      <div class="month-head">${['MON','TUE','WED','THU','FRI','SAT','SUN'].map(x => `<div>${x}</div>`).join('')}</div>
      <div class="month-grid">${cells}</div>
    `;
  }

  function renderTimeGrid() {
    const base = parseDate(state.cursor);
    const days = state.view === 'day' ? [base] : Array.from({ length: 7 }, (_, i) => addDays(startWeek(base), i));
    const hours = Array.from({ length: 24 }, (_, i) => i);
    let head = '<div></div>' + days.map(d =>
      `<div class="week-day-head ${sameDay(d, new Date()) ? 'text-violet-500' : ''}">
        <div class="text-[10px] uppercase text-slate-400">${fmt(d, { weekday: 'short' })}</div>
        <button data-action="day" data-date="${iso(d)}" class="font-display mt-1 text-lg font-bold">${d.getDate()}</button>
      </div>`
    ).join('');
    let rows = '';
    hours.forEach(h => {
      rows += `<div class="hour-label">${h === 0 ? '' : `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`}</div>`;
      days.forEach(d => {
        const ev = shownEvents().filter(e => e.date === iso(d) && Number(e.start.slice(0,2)) === h);
        rows += `<div class="hour-slot" data-action="new-event" data-date="${iso(d)}" data-time="${pad(h)}:00">` +
          ev.map(e => {
            const c = e.color ? [e.color, e.color + '22', e.color] : colors[e.calendar];
            const mins = Number(e.start.slice(3));
            return `<button data-action="event" data-id="${e.id}" class="week-event" style="top:${mins/60*64}px;background:${c[1]};color:${c[2]}">${esc(e.title)}<br><span class="font-normal opacity-70">${e.start}</span></button>`;
          }).join('') +
        `</div>`;
      });
    });
    $('#calendarView').innerHTML = `<div class="week-wrap"><div class="week-grid" style="grid-template-columns:64px repeat(${days.length},minmax(${state.view === 'day' ? '500' : '110'}px,1fr))">${head}${rows}</div></div>`;
    setTimeout(() => { $('.week-wrap').scrollTop = 7 * 64; }, 0);
  }

  function renderAgenda() {
    const from = parseDate(state.cursor);
    const events = shownEvents()
      .filter(e => parseDate(e.date) >= addDays(from, -1))
      .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
      .slice(0, 60);
    if (!events.length) {
      $('#calendarView').innerHTML = `<div class="empty-state"><div><div class="text-5xl">◌</div><h3 class="mt-3 font-display text-xl font-bold text-slate-600 dark:text-slate-300">Your horizon is clear</h3><p class="mt-1">Create an event to begin planning.</p></div></div>`;
      return;
    }
    let last = '';
    $('#calendarView').innerHTML = '<div class="agenda">' + events.map(e => {
      const d = e.date !== last ? (last = e.date, `<div class="agenda-date">${fmt(parseDate(e.date), { weekday: 'long', month: 'long', day: 'numeric' })}</div>`) : '';
      const c = e.color ? [e.color, e.color + '22', e.color] : colors[e.calendar];
      return `${d}<button class="agenda-card w-full text-left" data-action="event" data-id="${e.id}">
        <span class="h-11 w-1 rounded-full" style="background:${c[0]}"></span>
        <span class="w-20 text-xs font-bold text-slate-400">${e.start}</span>
        <span class="min-w-0 flex-1"><strong class="block truncate">${esc(e.title)}</strong><small class="text-slate-400">${esc(e.location || e.calendar)}</small></span>
        <span class="text-slate-400">›</span>
      </button>`;
    }).join('') + '</div>';
  }

  // ---- مودال الملف الشخصي (مع ربط آمن للأزرار) ----
  function openProfileModal() {
    const p = userProfile;
    const modalHtml = `
      <div class="modal-backdrop" id="profileModalBackdrop">
        <form id="profileForm" class="modal-card">
          <div class="mb-6 flex items-start justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[.18em] text-violet-500">Profile</p>
              <h2 class="font-display mt-1 text-2xl font-bold">Edit Your Info</h2>
            </div>
            <button type="button" class="icon-btn" data-close-modal>✕</button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="field-label">Full Name</label>
              <input class="field" name="fullName" value="${esc(p.fullName || '')}" placeholder="Your full name">
            </div>
            <div>
              <label class="field-label">Email</label>
              <input class="field" name="email" type="email" value="${esc(p.email || '')}" placeholder="you@example.com">
            </div>
            <div>
              <label class="field-label">Phone Number</label>
              <input class="field" name="phone" value="${esc(p.phone || '')}" placeholder="+123456789">
            </div>
            <div class="my-6 border-t border-slate-200 dark:border-white/10 pt-6">
              <h3 class="font-display text-lg font-bold mb-4">Change Password</h3>
              <div class="space-y-4">
                <div>
                  <label class="field-label">Current Password</label>
                  <input class="field" name="currentPassword" type="password" placeholder="Enter current password">
                </div>
                <div>
                  <label class="field-label">New Password</label>
                  <input class="field" name="newPassword" type="password" minlength="6" placeholder="Enter new password">
                </div>
                <button type="button" id="changePassBtn" class="secondary w-full sm:w-auto">Update Password</button>
              </div>
            </div>
          </div>
          <div class="mt-6 flex flex-wrap items-center gap-2">
            <span class="flex-1"></span>
            <button type="button" class="secondary" data-close-modal>Cancel</button>
            <button class="primary" type="submit">Save Profile</button>
          </div>
        </form>
      </div>
    `;
    $('#modalRoot').innerHTML = modalHtml;

    const backdrop = $('#profileModalBackdrop');
    // إغلاق عند النقر على الخلفية
    backdrop?.addEventListener('click', e => {
      if (e.target === backdrop) closeModal();
    });

    // ربط جميع أزرار الإغلاق
    $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));

    // ربط إرسال النموذج
    const form = $('#profileForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = Object.fromEntries(new FormData(form));
        try {
          const data = await apiCall('/user/profile', 'PUT', {
            fullName: fd.fullName,
            email: fd.email,
            phone: fd.phone
          });
          userProfile = data.profile;
          localStorage.setItem('chrona_profile', JSON.stringify(userProfile));
          $('#avatarText').textContent = (userProfile.fullName || currentUser).slice(0, 2).toUpperCase();
          toast('Profile updated ✨');
          closeModal();
        } catch (err) { toast(err.message); }
      });
    }

    // ربط زر تغيير كلمة المرور
    const changeBtn = $('#changePassBtn');
    if (changeBtn) {
      changeBtn.addEventListener('click', async () => {
        const fd = Object.fromEntries(new FormData(form));
        if (!fd.currentPassword || !fd.newPassword) return toast('Both password fields are required');
        try {
          const data = await apiCall('/user/password', 'PUT', { currentPassword: fd.currentPassword, newPassword: fd.newPassword });
          toast(data.message || 'Password updated');
          if (form) {
            form.querySelector('[name="currentPassword"]').value = '';
            form.querySelector('[name="newPassword"]').value = '';
          }
        } catch (err) { toast(err.message); }
      });
    }
  }
  window.openProfileModal = openProfileModal;

  // ---- مودال إنشاء/تعديل الحدث (مع ربط آمن) ----
  function openEvent(event = {}) {
    const isEdit = !!event.id;
    const modalHtml = `
      <div class="modal-backdrop" id="eventModalBackdrop">
        <form id="eventForm" class="modal-card">
          <div class="mb-6 flex items-start justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[.18em] text-violet-500">${isEdit ? 'Event details' : 'New moment'}</p>
              <h2 class="font-display mt-1 text-2xl font-bold">${isEdit ? 'Edit event' : 'Create an event'}</h2>
            </div>
            <button type="button" class="icon-btn" data-close-modal>✕</button>
          </div>
          <div class="space-y-4">
            <div><label class="field-label">Title</label><input class="field text-lg font-semibold" name="title" required autofocus value="${esc(event.title || '')}" placeholder="What’s happening?" /></div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div><label class="field-label">Date</label><input class="field" type="date" name="date" required value="${event.date || state.cursor}" /></div>
              <div><label class="field-label">Starts</label><input class="field" type="time" name="start" required value="${event.start || '09:00'}" /></div>
              <div><label class="field-label">Ends</label><input class="field" type="time" name="end" required value="${event.end || '10:00'}" /></div>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div><label class="field-label">Calendar</label><select class="field capitalize" name="calendar">${Object.keys(colors).map(k => `<option ${event.calendar === k ? 'selected' : ''} value="${k}">${k}</option>`).join('')}</select></div>
              <div><label class="field-label">Status</label><select class="field" name="status">${['pending','in-progress','completed'].map(k => `<option ${event.status === k ? 'selected' : ''} value="${k}">${k}</option>`).join('')}</select></div>
              <div><label class="field-label">Repeat</label><select class="field" name="recurrence">${['none','daily','weekly','monthly','yearly'].map(k => `<option ${event.recurrence === k ? 'selected' : ''} value="${k}">${k === 'none' ? 'Does not repeat' : `Repeats ${k}`}</option>`).join('')}</select></div>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div><label class="field-label">Alert</label><select class="field" name="alert">${[['now','Immediate'],['10min','10 min before'],['1hour','1 hour before'],['1day','1 day before']].map(([v,l]) => `<option ${event.alert === v ? 'selected' : ''} value="${v}">${l}</option>`).join('')}</select></div>
              <div><label class="field-label">Custom Color</label><input class="field !p-1 !h-10" type="color" name="color" value="${event.color || '#8b5cf6'}" /></div>
            </div>
            <div><label class="field-label">Location / call link</label><input class="field" name="location" value="${esc(event.location || '')}" placeholder="Add a place or URL" /></div>
            <div><label class="field-label">Guests</label><input class="field" name="guests" value="${esc(event.guests || '')}" placeholder="Emails, separated by commas" /></div>
            <div><label class="field-label">Description</label><textarea class="field min-h-[60px] resize-y" name="description" placeholder="Brief description">${esc(event.description || '')}</textarea></div>
            <div><label class="field-label">Notes</label><textarea class="field min-h-[60px] resize-y" name="notes" placeholder="Add context, links, or an agenda">${esc(event.notes || '')}</textarea></div>
          </div>
          <div class="mt-6 flex flex-wrap items-center gap-2">
            ${isEdit ? '<button type="button" id="deleteEvent" class="secondary danger">Delete</button>' : ''}
            <span class="flex-1"></span>
            <button type="button" class="secondary" data-close-modal>Cancel</button>
            <button class="primary" type="submit">${isEdit ? 'Save changes' : 'Create event'}</button>
          </div>
        </form>
      </div>
    `;
    $('#modalRoot').innerHTML = modalHtml;

    const backdrop = $('#eventModalBackdrop');
    backdrop?.addEventListener('click', e => {
      if (e.target === backdrop) closeModal();
    });

    $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));

    const form = $('#eventForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const o = Object.fromEntries(new FormData(form));
        if (o.end <= o.start && o.end !== '00:00') return toast('End time must be after start time');
        const payload = {
          title: o.title,
          date: o.date,
          start: o.start,
          end: o.end,
          calendar: o.calendar,
          status: o.status,
          recurrence: o.recurrence,
          alert: o.alert,
          color: o.color,
          location: o.location,
          guests: o.guests,
          description: o.description,
          notes: o.notes
        };
        try {
          let updatedEvent;
          if (isEdit) {
            updatedEvent = (await apiCall(`/events/${event.id}`, 'PUT', payload)).event;
            state.events = state.events.map(x => x.id === event.id ? updatedEvent : x);
          } else {
            updatedEvent = (await apiCall('/events', 'POST', payload)).event;
            state.events.push(updatedEvent);
          }
          closeModal();
          render();
          toast(isEdit ? 'Event updated' : 'Event created ✨');
        } catch (err) { toast(err.message); }
      });
    }

    // ربط زر الحذف
    const deleteBtn = $('#deleteEvent');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        try {
          await apiCall(`/events/${event.id}`, 'DELETE');
          state.events = state.events.filter(x => x.id !== event.id);
          closeModal();
          render();
          toast('Event deleted');
        } catch (err) { toast(err.message); }
      });
    }

    setTimeout(() => $('#eventForm [autofocus]')?.focus(), 50);
  }

  // ---- البحث ----
  function openSearch() {
    const events = shownEvents();
    const modalHtml = `
      <div class="modal-backdrop" id="searchModalBackdrop">
        <div class="modal-card !max-w-[680px] !p-3">
          <div class="flex items-center gap-3 border-b border-slate-200 p-3 dark:border-white/10">
            <span class="text-xl text-violet-500">⌕</span>
            <input id="searchInput" class="min-w-0 flex-1 bg-transparent text-lg outline-none" placeholder="Search title, guest, location or notes…" autofocus/>
            <button class="icon-btn" data-close-modal>✕</button>
          </div>
          <div id="searchResults" class="max-h-[55vh] overflow-auto p-2"></div>
          <div class="flex items-center gap-3 border-t border-slate-200 p-3 text-[10px] text-slate-400 dark:border-white/10">
            <kbd>↑↓</kbd> Navigate <kbd>↵</kbd> Open <span class="ml-auto">${events.length} events</span>
          </div>
        </div>
      </div>
    `;
    $('#modalRoot').innerHTML = modalHtml;

    const backdrop = $('#searchModalBackdrop');
    backdrop?.addEventListener('click', e => {
      if (e.target === backdrop) closeModal();
    });
    $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));

    let active = 0, filtered = events;
    const draw = () => {
      $('#searchResults').innerHTML = filtered.length ?
        filtered.slice(0, 20).map((e, i) => {
          const c = e.color ? [e.color, e.color + '22', e.color] : colors[e.calendar];
          return `<button class="search-item ${i === active ? 'active' : ''}" data-result="${e.id}">
            <span class="dot" style="background:${c[0]}"></span>
            <span class="min-w-0 flex-1"><strong class="block truncate">${esc(e.title)}</strong><small class="text-slate-400">${fmt(parseDate(e.date), { month: 'short', day: 'numeric' })} · ${e.start} · ${esc(e.location || e.calendar)}</small></span>
            <span>›</span>
          </button>`;
        }).join('') :
        '<div class="p-10 text-center text-slate-400">No matching events</div>';
      $$('[data-result]').forEach(b => {
        b.addEventListener('click', () => { closeModal(); openEvent(state.events.find(e => e.id === b.dataset.result)); });
      });
    };
    draw();

    const input = $('#searchInput');
    if (input) {
      input.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        filtered = events.filter(x => [x.title, x.location, x.notes, x.guests, x.calendar].join(' ').toLowerCase().includes(q));
        active = 0;
        draw();
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); draw(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); draw(); }
        if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); closeModal(); openEvent(filtered[active]); }
      });
      setTimeout(() => input.focus(), 20);
    }
  }

  // ---- الأدوات ----
  function openMore() {
    const modalHtml = `
      <div class="modal-backdrop" id="moreModalBackdrop">
        <div class="modal-card !max-w-sm">
          <h2 class="font-display mb-4 text-xl font-bold">Calendar tools</h2>
          <div class="grid gap-2">
            <button id="exportJson" class="secondary text-left">↓ Export backup (.json)</button>
            <button id="exportIcs" class="secondary text-left">↓ Export calendar (.ics)</button>
            <button id="importBtn" class="secondary text-left">↑ Import JSON / ICS</button>
            <button id="notifyBtn" class="secondary text-left">♢ Enable notifications</button>
            <button id="shortcuts" class="secondary text-left">⌨ Keyboard shortcuts</button>
          </div>
          <button class="secondary mt-5 w-full" data-close-modal>Close</button>
        </div>
      </div>
    `;
    $('#modalRoot').innerHTML = modalHtml;

    const backdrop = $('#moreModalBackdrop');
    backdrop?.addEventListener('click', e => {
      if (e.target === backdrop) closeModal();
    });
    $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));

    $('#exportJson')?.addEventListener('click', exportJson);
    $('#exportIcs')?.addEventListener('click', exportIcs);
    $('#importBtn')?.addEventListener('click', () => $('#importFile').click());
    $('#notifyBtn')?.addEventListener('click', requestNotify);
    $('#shortcuts')?.addEventListener('click', () => toast('C create · T today · ←/→ navigate · ⌘K search'));
  }

  // ---- لوحة المدير ----
  async function openAdmin() {
    try {
      const users = await apiCall('/admin/users');
      const modalHtml = `
        <div class="modal-backdrop" id="adminModalBackdrop">
          <div class="modal-card !max-w-lg">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-display text-xl font-bold">Admin Panel</h2>
              <button class="icon-btn" data-close-modal>✕</button>
            </div>
            <div id="adminUserList"></div>
            <button class="secondary mt-5 w-full" data-close-modal>Close</button>
          </div>
        </div>
      `;
      $('#modalRoot').innerHTML = modalHtml;

      const backdrop = $('#adminModalBackdrop');
      backdrop?.addEventListener('click', e => {
        if (e.target === backdrop) closeModal();
      });
      $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));

      $('#adminUserList').innerHTML = users.map(u => `
        <div class="admin-user-card" data-username="${u.username}">
          <div><strong class="block">${esc(u.username)}</strong><small class="text-slate-400">${u.isActive ? '✅' : '❌'}</small></div>
          <div>${u.isAdmin ? '👑' : ''}</div>
        </div>
      `).join('');

      $$('.admin-user-card').forEach(card => {
        card.addEventListener('click', async () => {
          try {
            const data = await apiCall(`/dashboard/${card.dataset.username}`);
            $('#adminUserList').innerHTML = `
              <button class="secondary mb-4" id="backToUsers">← Back to users</button>
              <h3 class="font-display text-lg font-bold mb-2">Data for ${esc(card.dataset.username)}</h3>
              <div class="json-viewer">${esc(JSON.stringify(data, null, 2))}</div>
            `;
            $('#backToUsers').addEventListener('click', () => openAdmin());
          } catch (err) { toast(err.message); }
        });
      });
    } catch (err) { toast(err.message); }
  }

  // ---- تصدير واستيراد ----
  function exportJson() {
    download('chrona-backup.json', JSON.stringify({ version: 1, events: state.events }, null, 2), 'application/json');
    toast('Backup exported');
  }
  function exportIcs() {
    const out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Chrona//Calendar//EN',
      ...state.events.flatMap(e => [
        'BEGIN:VEVENT',
        `UID:${e.id}@chrona`,
        `DTSTART:${e.date.replaceAll('-', '')}T${e.start.replace(':', '')}00`,
        `DTEND:${e.date.replaceAll('-', '')}T${e.end.replace(':', '')}00`,
        `SUMMARY:${e.title.replaceAll(',', '\\,')}`,
        `LOCATION:${(e.location || '').replaceAll(',', '\\,')}`,
        `DESCRIPTION:${(e.notes || '').replaceAll('\n', '\\n')}`,
        'END:VEVENT'
      ]),
      'END:VCALENDAR'
    ].join('\r\n');
    download('chrona-calendar.ics', out, 'text/calendar');
    toast('Calendar exported');
  }
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      if (f.name.endsWith('.json')) {
        const d = JSON.parse(text);
        if (!Array.isArray(d.events)) throw Error();
        for (const ev of d.events) {
          await apiCall('/events', 'POST', { ...ev, id: uid() });
        }
      } else {
        const blocks = text.split('BEGIN:VEVENT').slice(1);
        for (const b of blocks) {
          const get = k => (b.match(new RegExp(`${k}:(.*)`)) || [])[1]?.trim() || '';
          const ds = get('DTSTART');
          await apiCall('/events', 'POST', {
            title: get('SUMMARY') || 'Imported',
            date: `${ds.slice(0,4)}-${ds.slice(4,6)}-${ds.slice(6,8)}`,
            start: `${ds.slice(9,11) || '09'}:${ds.slice(11,13) || '00'}`,
            end: '10:00',
            calendar: 'work',
            location: get('LOCATION'),
            notes: get('DESCRIPTION')
          });
        }
      }
      await loadEvents();
      closeModal();
      render();
      toast('Events imported');
    } catch { toast('Could not import file'); }
    e.target.value = '';
  }

  async function requestNotify() {
    if (!('Notification' in window)) return toast('Notifications not supported');
    const p = await Notification.requestPermission();
    toast(p === 'granted' ? 'Notifications enabled' : 'Permission denied');
  }

  function updateInsight() {
    const w = startWeek(new Date());
    const count = state.events.filter(e => {
      const d = parseDate(e.date);
      return d >= w && d <= addDays(w, 6);
    }).length;
    $('#focusInsight').textContent = count > 8 ? `${count} events this week. Protect a focus block.` :
                                      count > 3 ? `${count} events this week — comfortably balanced.` :
                                      'A spacious week. Perfect for focused progress.';
  }

  // ---- إغلاق المودال (عام) ----
  function closeModal() {
    $('#modalRoot').innerHTML = '';
  }
  window.closeModal = closeModal;

  // ---- المصادقة ----
  function renderAuth(mode = 'login') {
    $('#appRoot').classList.add('hidden');
    $('#authRoot').classList.remove('hidden');
    let extraFields = '';
    if (mode === 'signup') {
      extraFields = `
        <div><label class="field-label">Full Name (Optional)</label><input class="field" name="fullName" placeholder="Your name"></div>
        <div><label class="field-label">Username</label><input class="field" name="username" required placeholder="3+ characters"></div>
        <div><label class="field-label">Email</label><input class="field" name="email" type="email" required placeholder="you@example.com"></div>
        <div><label class="field-label">Phone Number (Optional)</label><input class="field" name="phone" placeholder="+123456789"></div>
      `;
    } else if (mode === 'login') {
      extraFields = `<div><label class="field-label">Username or Email</label><input class="field" name="username" required placeholder="Enter username or email"></div>`;
    }

    $('#authRoot').innerHTML = `
      <div class="auth-screen"><div class="orb orb-a"></div><div class="orb orb-b"></div>
      <form id="authForm" class="auth-card">
        <div class="flex items-center gap-3"><span class="logo-mark">C</span><div><p class="font-display text-xl font-bold">Welcome to Chrona</p><p class="text-xs text-slate-400">Your private planning space</p></div></div>
        <div class="auth-tabs" id="authTabs">
          <button type="button" class="auth-tab ${mode === 'login' ? 'active' : ''}" data-mode="login">Log in</button>
          <button type="button" class="auth-tab ${mode === 'signup' ? 'active' : ''}" data-mode="signup">Sign up</button>
        </div>
        <div id="authFields" class="space-y-4 mt-4">${extraFields}
          <div><label class="field-label">Password</label><input class="field" name="password" type="password" required minlength="6" placeholder="6+ characters"></div>
        </div>
        <div id="authError" class="text-red-500 text-sm mt-2 hidden"></div>
        <button class="primary mt-6 w-full" type="submit">${mode === 'login' ? 'Log in' : 'Create Account'}</button>
      </form>
    `;

    // ربط تبديل علامات التبويب
    $$('#authTabs .auth-tab').forEach(b => {
      b.addEventListener('click', () => renderAuth(b.dataset.mode));
    });

    // ربط إرسال النموذج
    const form = $('#authForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errEl = $('#authError');
        errEl.classList.add('hidden');
        const fd = Object.fromEntries(new FormData(form));
        try {
          if (mode === 'login') {
            const data = await apiCall('/auth/login', 'POST', { username: fd.username, password: fd.password });
            if (data.success) {
              currentUser = data.username;
              userProfile = data.profile;
              localStorage.setItem('chrona_user', currentUser);
              localStorage.setItem('chrona_profile', JSON.stringify(userProfile));
              showApp();
            }
          } else if (mode === 'signup') {
            await apiCall('/auth/register', 'POST', {
              username: fd.username,
              email: fd.email,
              password: fd.password,
              phone: fd.phone,
              fullName: fd.fullName
            });
            toast('Registered successfully. Please log in.');
            renderAuth('login');
          }
        } catch (err) {
          errEl.textContent = err.message;
          errEl.classList.remove('hidden');
        }
      });
    }
  }

  function logout() {
    currentUser = null;
    userProfile = {};
    localStorage.removeItem('chrona_user');
    localStorage.removeItem('chrona_profile');
    renderAuth();
  }

  function toast(msg, undo) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `${esc(msg)}${undo ? ' <button class="ml-3 font-bold text-violet-300">Undo</button>' : ''}`;
    if (undo) t.querySelector('button').onclick = () => { undo(); t.remove(); };
    $('#toastRoot').append(t);
    setTimeout(() => t.remove(), undo ? 6000 : 2800);
  }

  // بدء التطبيق
  init();
})();
