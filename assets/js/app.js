/**
 * Baba Academy Admissions — Admin UI
 * UI logic, AJAX, forms, pagination, accessibility — production-ready.
 * Text Domain: baba-academy
 */

(() => {
  'use strict';

  /* -------------------------------------------------------------
   * Guard: ssmData availability (soft warning, no hard break)
   * ----------------------------------------------------------- */
  if (typeof window.ssmData === 'undefined') {
    console.warn('[BabaAcademy] ssmData not found; UI will not initialize.');
    return;
  }

  /* -------------------------------------------------------------
   * Utilities
   * ----------------------------------------------------------- */
  const { ajaxUrl, nonce, i18n, limits } = window.ssmData || {};
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts || false);
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const money = (n) => {
    const val = Number(n || 0);
    try {
      return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);
    } catch (e) {
      return 'Rs ' + val.toLocaleString('en-US');
    }
  };

  const wpAjax = async (action, data = {}, { method = 'POST', isForm = false } = {}) => {
    const body = isForm ? data : new URLSearchParams({ action, nonce, ...data });
    const url = isForm ? `${ajaxUrl}?action=${encodeURIComponent(action)}&nonce=${encodeURIComponent(nonce)}` : ajaxUrl;
    const res = await fetch(url, {
      method,
      credentials: 'same-origin',
      headers: isForm ? undefined : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body
    });
    let json;
    try { json = await res.json(); } catch (e) { json = { success: false, data: { msg: i18n?.error || 'خرابی' } }; }
    return json;
  };

  const mountTemplate = (tplId, mountId) => {
    const tpl = document.getElementById(tplId);
    const host = document.getElementById(mountId);
    if (!tpl || !host) {
      console.warn('[BabaAcademy] template or host missing:', tplId, mountId);
      return null;
    }
    host.innerHTML = '';
    host.appendChild(tpl.content.cloneNode(true));
    return host;
  };

  const focusFirst = (ctx) => {
    const el = $('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', ctx);
    if (el) el.focus();
  };

  const liveRegion = (() => {
    let region = $('#ssm-live-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'ssm-live-region';
      region.className = 'screen-reader-text';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    return (msg) => { region.textContent = msg || ''; };
  })();

  /* -------------------------------------------------------------
   * Endpoints
   * ----------------------------------------------------------- */
  const EP = {
    listCourses: 'ssm-ba_list_courses',
    saveCourse: 'ssm-ba_save_course',
    createAdmission: 'ssm-ba_create_admission',
    listAdmissions: 'ssm-ba_list_admissions',
    whoami: 'ssm-ba_whoami'
  };

  /* -------------------------------------------------------------
   * State
   * ----------------------------------------------------------- */
  const State = {
    courses: [],
    dash: {
      page: 1,
      pages: 1,
      course_id: '',
      status: ''
    }
  };

  /* -------------------------------------------------------------
   * Shared: load courses
   * ----------------------------------------------------------- */
  async function fetchCourses() {
    const res = await wpAjax(EP.listCourses, {});
    if (res?.success) {
      State.courses = res.data.items || [];
    } else {
      State.courses = [];
    }
    return State.courses;
  }

  function fillCourseSelect(selectEl, includeBlank = true) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    if (includeBlank) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'منتخب کریں';
      selectEl.appendChild(opt);
    }
    State.courses.forEach(c => {
      const o = document.createElement('option');
      o.value = String(c.id);
      o.textContent = c.title + ' — ' + money(c.fixed_fee);
      o.dataset.fee = String(c.fixed_fee);
      selectEl.appendChild(o);
    });
  }

  /* -------------------------------------------------------------
   * Screen: New Admission
   * ----------------------------------------------------------- */
  async function initNewAdmission() {
    const mount = mountTemplate('ssm-ba-tpl-new', 'ssm-ba-app-new');
    if (!mount) return;

    liveRegion(i18n?.loading || 'لوڈ ہورہا ہے...');
    await fetchCourses();
    fillCourseSelect($('#course-select'));

    const form = $('#form-admission');
    const selCourse = $('#course-select');
    const totalFee = $('#total-fee');
    const paidAmount = $('#paid-amount');
    const remainingAmount = $('#remaining-amount');

    const recalcRemaining = () => {
      const total = Number(totalFee.value || 0);
      const paid = Math.max(0, Number(paidAmount.value || 0));
      const remain = Math.max(0, total - paid);
      remainingAmount.value = String(remain);
    };

    on(selCourse, 'change', () => {
      const opt = selCourse.options[selCourse.selectedIndex];
      const fee = Number(opt?.dataset?.fee || 0);
      totalFee.value = String(fee);
      recalcRemaining();
    });

    on(paidAmount, 'input', () => {
      const v = Number(paidAmount.value || 0);
      if (v < 0) paidAmount.value = '0';
      recalcRemaining();
    });

    on(form, 'submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);

      // enforce fixed fee copy and simple guards
      const cid = Number(fd.get('course_id') || 0);
      const course = State.courses.find(c => c.id === cid);
      if (!course) {
        alert('کورس منتخب کریں۔');
        return;
      }
      fd.set('total_fee', String(course.fixed_fee));

      // upload size hint
      const file = form.querySelector('input[type="file"]')?.files?.[0];
      if (file && file.size > (limits?.uploadMaxMB || 5) * 1024 * 1024) {
        alert(`فائل زیادہ بڑی ہے۔ زیادہ سے زیادہ ${limits?.uploadMaxMB || 5}MB`);
        return;
      }

      // Button state
      const btn = form.querySelector('button[type="submit"]');
      const oldTxt = btn.textContent;
      btn.disabled = true;
      btn.textContent = (i18n?.loading || 'لوڈ ہورہا ہے...');

      const res = await wpAjax(EP.createAdmission, fd, { method: 'POST', isForm: true });

      btn.disabled = false;
      btn.textContent = oldTxt;

      if (res?.success) {
        alert('داخلہ محفوظ ہوگیا۔');
        form.reset();
        totalFee.value = '';
        remainingAmount.value = '';
        focusFirst(form);
      } else {
        alert(res?.data?.msg || (i18n?.error || 'کوئی مسئلہ پیش آگیا۔'));
      }
    });

    focusFirst(mount);
    liveRegion('');
  }

  /* -------------------------------------------------------------
   * Screen: Courses (Fixed Fee)
   * ----------------------------------------------------------- */
  async function initCourses() {
    const mount = mountTemplate('ssm-ba-tpl-courses', 'ssm-ba-app-courses');
    if (!mount) return;

    const form = $('#form-course');
    const rows = $('#course-rows');

    const render = () => {
      rows.innerHTML = '';
      if (!State.courses.length) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="3">ابھی کوئی کورس موجود نہیں۔</td>`;
        rows.appendChild(tr);
        return;
      }
      State.courses.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${esc(c.title)}</td>
          <td>${money(c.fixed_fee)}</td>
          <td>${c.status ? 'فعال' : 'غیر فعال'}</td>
        `;
        rows.appendChild(tr);
      });
    };

    liveRegion(i18n?.loading || 'لوڈ ہورہا ہے...');
    await fetchCourses();
    render();
    liveRegion('');

    on(form, 'submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const title = (fd.get('title') || '').toString().trim();
      const fixed_fee = Number(fd.get('fixed_fee') || 0);
      if (!title || fixed_fee <= 0) {
        alert('عنوان اور درست فیس درکار ہے۔');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const oldTxt = btn.textContent;
      btn.disabled = true;
      btn.textContent = (i18n?.loading || 'لوڈ ہورہا ہے...');

      const res = await wpAjax(EP.saveCourse, { title, fixed_fee });

      btn.disabled = false;
      btn.textContent = oldTxt;

      if (res?.success) {
        form.reset();
        await fetchCourses();
        render();
        alert('کورس شامل ہوگیا۔');
      } else {
        alert(res?.data?.msg || (i18n?.error || 'خرابی'));
      }
    });
  }

  /* -------------------------------------------------------------
   * Screen: Dashboard (Admissions List + Filters + Pagination)
   * ----------------------------------------------------------- */
  async function initDashboard() {
    const mount = mountTemplate('ssm-ba-tpl-dashboard', 'ssm-ba-app-dashboard');
    if (!mount) return;

    const tbody = $('#adm-rows');
    const info = $('#pg-info');
    const prev = $('#pg-prev');
    const next = $('#pg-next');
    const btnRefresh = $('#btn-refresh');
    const filterCourse = $('#filter-course');
    const filterStatus = $('#filter-status');

    liveRegion(i18n?.loading || 'لوڈ ہورہا ہے...');
    await fetchCourses();
    // Fill filter course select
    filterCourse.innerHTML = `<option value="">تمام کورسز</option>`;
    State.courses.forEach(c => {
      const o = document.createElement('option');
      o.value = String(c.id);
      o.textContent = c.title;
      filterCourse.appendChild(o);
    });

    const fetchPage = async (page = 1) => {
      const payload = {
        page,
        course_id: filterCourse.value || '',
        status: filterStatus.value || ''
      };
      const res = await wpAjax(EP.listAdmissions, payload);
      if (!res?.success) {
        tbody.innerHTML = `<tr><td colspan="9">${esc(res?.data?.msg || 'ڈیٹا لوڈ نہ ہوسکا')}</td></tr>`;
        info.textContent = '';
        return;
      }
      const { items, pages } = res.data;
      State.dash.page = res.data.page || 1;
      State.dash.pages = pages || 1;

      tbody.innerHTML = '';
      if (!items.length) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="9">کوئی ریکارڈ نہیں ملا۔</td>`;
        tbody.appendChild(tr);
      } else {
        items.forEach(r => {
          const statusText = r.status === 1 ? 'ادا شدہ' : (r.days_left != null && r.days_left < 0 ? 'اوورڈیو' : 'زیرِالتواء');
          const shot = r.screenshot_url ? `<a href="${esc(r.screenshot_url)}" target="_blank" rel="noopener">دیکھیں</a>` : '—';
          const days = (r.days_left == null) ? '—' : (r.days_left >= 0 ? `${r.days_left} دن باقی` : `${Math.abs(r.days_left)} دن اوورڈیو`);
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${esc(r.student_name)}<br><small>${esc(r.phone)}</small></td>
            <td>${esc(r.course)}</td>
            <td>${money(r.total_fee)}</td>
            <td>${money(r.paid_amount)}</td>
            <td>${money(r.remaining_amount)}</td>
            <td>${r.due_date ? esc(r.due_date) : '—'}</td>
            <td>${esc(days)}</td>
            <td>${esc(statusText)}</td>
            <td>${shot}</td>
          `;
          tbody.appendChild(tr);
        });
      }
      info.textContent = `صفحہ ${State.dash.page} از ${State.dash.pages}`;
      prev.disabled = State.dash.page <= 1;
      next.disabled = State.dash.page >= State.dash.pages;
    };

    on(prev, 'click', () => {
      if (State.dash.page > 1) fetchPage(State.dash.page - 1);
    });
    on(next, 'click', () => {
      if (State.dash.page < State.dash.pages) fetchPage(State.dash.page + 1);
    });
    on(btnRefresh, 'click', () => fetchPage(1));
    on(filterCourse, 'change', () => fetchPage(1));
    on(filterStatus, 'change', () => fetchPage(1));

    await fetchPage(1);
    liveRegion('');
    focusFirst(mount);
  }

  /* -------------------------------------------------------------
   * Screen: Settings (placeholder content already static)
   * ----------------------------------------------------------- */
  function initSettings() {
    // Template mounts; no extra JS needed yet
    mountTemplate('ssm-ba-tpl-settings', 'ssm-ba-app-settings');
  }

  /* -------------------------------------------------------------
   * Bootstrap per-screen (soft-init)
   * ----------------------------------------------------------- */
  const boot = () => {
    // Only init screens that exist on current page
    if (document.getElementById('ssm-ba-app-new')) initNewAdmission();
    if (document.getElementById('ssm-ba-app-courses')) initCourses();
    if (document.getElementById('ssm-ba-app-dashboard')) initDashboard();
    if (document.getElementById('ssm-ba-app-settings')) initSettings();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

