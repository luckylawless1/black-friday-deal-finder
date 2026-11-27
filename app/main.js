// The deal finder: search, filters, sorting and hash routes. All state lives
// in this file; the deals live in data.js and the HTML in views.js.
//
//   #/            the deal grid, with search and filters
//   #/deal/<id>   one deal, with its verdict and evidence
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals, CATEGORIES, STORES, CHECKED_LABEL } from './data.js';
import { listPage, dealPage, missingPage, dealRows } from './views.js';

const app = document.getElementById('app');
const countEl = () => document.getElementById('count');
const gridEl = () => document.getElementById('deal-grid');

const state = { q: '', category: '', store: '', mindisc: '0', sort: 'discount' };

function percentOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function applyFilters(list, s) {
  const q = s.q.trim().toLowerCase();
  const min = Number(s.mindisc) || 0;
  const kept = list.filter((d) => {
    // Search matches the title, store, category, verdict and the deal's
    // keywords, so "headphones" finds the AirPods too and "TV" finds
    // every television even when its title says only the model.
    const haystack = `${d.title} ${d.store} ${d.category} ${d.verdict} ${d.keywords || ''}`.toLowerCase();
    if (q !== '' && haystack.indexOf(q) === -1) return false;
    if (s.category !== '' && d.category !== s.category) return false;
    if (s.store !== '' && d.store !== s.store) return false;
    if (percentOff(d) < min) return false;
    return true;
  });
  const sorted = kept.slice();
  if (s.sort === 'discount') sorted.sort((a, b) => percentOff(b) - percentOff(a) || a.price - b.price);
  else if (s.sort === 'saving') sorted.sort((a, b) => b.was - b.price - (a.was - a.price));
  else if (s.sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (s.sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

function updateCount(shown) {
  const el = countEl();
  if (!el) return;
  el.textContent =
    shown.length === deals.length
      ? `${deals.length} deals`
      : `${shown.length} of ${deals.length} deals`;
}

function refreshGrid() {
  const shown = applyFilters(deals, state);
  const grid = gridEl();
  if (grid) grid.innerHTML = dealRows(shown);
  updateCount(shown);
}

function bindControls() {
  const q = document.getElementById('q');
  const category = document.getElementById('category');
  const store = document.getElementById('store');
  const mindisc = document.getElementById('mindisc');
  const sort = document.getElementById('sort');
  const clear = document.getElementById('clear');
  if (q) q.addEventListener('input', () => { state.q = q.value; refreshGrid(); });
  if (category) category.addEventListener('change', () => { state.category = category.value; refreshGrid(); });
  if (store) store.addEventListener('change', () => { state.store = store.value; refreshGrid(); });
  if (mindisc) mindisc.addEventListener('change', () => { state.mindisc = mindisc.value; refreshGrid(); });
  if (sort) sort.addEventListener('change', () => { state.sort = sort.value; refreshGrid(); });
  if (clear) {
    clear.addEventListener('click', () => {
      state.q = '';
      state.category = '';
      state.store = '';
      state.mindisc = '0';
      state.sort = 'discount';
      render();
    });
  }
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : 'Not found'} | Deal Desk`;
    app.innerHTML = found ? dealPage(found, deals) : missingPage();
  } else {
    document.title = 'Deal Desk — Black Friday 2026 deal finder';
    const shown = applyFilters(deals, state);
    app.innerHTML = listPage(CATEGORIES, STORES, state, shown, deals.length);
    bindControls();
    updateCount(shown);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();

// Footer stamp, set once: the page always shows when prices were checked.
const stamp = document.getElementById('checked-stamp');
if (stamp) stamp.textContent = CHECKED_LABEL;
