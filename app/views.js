// HTML for the deal finder pages, built from the deal data. Every value is
// escaped before it goes into the page. The look follows the broadcast news
// package grammar: a lemon brand plate, mono datelines, ink cards with a
// lemon top edge, and a rotated verdict stamp on each deal.

import { CHECKED_LABEL } from './data.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
const saved = (d) => d.was - d.price;
const stampClass = (v) => (v === 'NEW LOW' ? 'stamp-new' : v === 'STRONG DEAL' ? 'stamp-strong' : 'stamp-routine');
const checkedShort = () => CHECKED_LABEL;

export function priceText(d) {
  return `${usd(d.price)}${d.unit ? d.unit : ''}`;
}

export function dealCard(d) {
  return `<article class="card">
  <div class="card-eyebrow"><span>${escape(d.store)}</span><span>${escape(d.category)}</span></div>
  <h2><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h2>
  <div class="price-board">
    <span class="sale">${priceText(d)}</span>
    <span class="was"><s>${usd(d.was)}${d.unit ? d.unit : ''}</s></span>
    <span class="pct">${percentOff(d)}% OFF</span>
  </div>
  <div class="save-bar" role="img" aria-label="${percentOff(d)} percent off"><span style="width:${percentOff(d)}%"></span></div>
  <p class="save-line">You save ${usd(saved(d))}</p>
  <p class="evidence">${escape(d.evidence)}</p>
  <div class="card-foot">
    <span class="stamp ${stampClass(d.verdict)}">${escape(d.verdict)}</span>
    <a class="shop" href="${escape(d.url)}" target="_blank" rel="noopener">Shop at ${escape(d.store)} &rarr;</a>
  </div>
  <p class="source-line">CHECKED ${escape(checkedShort())} · ${escape(d.source)}</p>
</article>`;
}

export function dealRows(list) {
  if (list.length === 0) {
    return '<li class="empty">No deal matches those filters. Clear the search or widen the discount.</li>';
  }
  return list.map((d) => `<li>${dealCard(d)}</li>`).join('');
}

export function filterBar(categories, stores, state) {
  const opt = (value, label, current) =>
    `<option value="${escape(value)}"${value === current ? ' selected' : ''}>${escape(label)}</option>`;
  return `<section class="controls" aria-label="Search and filter deals">
  <div class="control-row">
    <label class="search-label">Search <input id="q" type="search" placeholder="Try &ldquo;headphones&rdquo;, &ldquo;LEGO&rdquo;, &ldquo;TV&rdquo;&hellip;" value="${escape(state.q)}"></label>
    <label>Category
      <select id="category">
        ${opt('', 'All categories', state.category)}
        ${categories.map((c) => opt(c, c, state.category)).join('')}
      </select>
    </label>
    <label>Store
      <select id="store">
        ${opt('', 'All stores', state.store)}
        ${stores.map((s) => opt(s, s, state.store)).join('')}
      </select>
    </label>
    <label>Min. discount
      <select id="mindisc">
        ${opt('0', 'Any discount', state.mindisc)}
        ${opt('20', '20% off or more', state.mindisc)}
        ${opt('40', '40% off or more', state.mindisc)}
        ${opt('50', '50% off or more', state.mindisc)}
      </select>
    </label>
    <label>Sort by
      <select id="sort">
        ${opt('discount', 'Biggest discount', state.sort)}
        ${opt('saving', 'Biggest saving ($)', state.sort)}
        ${opt('price-asc', 'Lowest price', state.sort)}
        ${opt('price-desc', 'Highest price', state.sort)}
      </select>
    </label>
    <button id="clear" type="button">Clear</button>
  </div>
  <p class="count-line"><strong id="count"></strong> · Prices checked <span id="checked-at">${escape(checkedShort())}</span></p>
</section>`;
}

export function listPage(categories, stores, state, shown, total) {
  return `<section class="rundown">
  <p class="kicker">BLACK FRIDAY · FRIDAY 27 NOV 2026 · ${total} DEALS CHECKED TODAY</p>
  <h1>The deals worth your money</h1>
  <p class="lede">Every price below was read at the store or in a deals roundup that names the store, on Black Friday itself. Each deal carries its verdict: <strong>NEW LOW</strong> is the lowest price seen this year, <strong>STRONG DEAL</strong> is a deep cut worth acting on, <strong>ROUTINE SALE</strong> is a real discount this product sees often.</p>
</section>
${filterBar(categories, stores, state)}
<ul class="grid" id="deal-grid">${dealRows(shown)}</ul>`;
}

export function dealPage(d, siblings) {
  const others = siblings.filter((x) => x.id !== d.id && x.title === d.title);
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <p class="detail-eyebrow"><span>${escape(d.store)}</span><span>${escape(d.category)}</span><span>CHECKED ${escape(checkedShort())}</span></p>
  <h1>${escape(d.title)}</h1>
  <div class="detail-board">
    <div class="detail-price">
      <span class="sale big">${priceText(d)}</span>
      <span class="was big-was"><s>${usd(d.was)}${d.unit ? d.unit : ''}</s></span>
      <span class="pct big-pct">${percentOff(d)}% OFF</span>
    </div>
    <p class="save-line big-save">You save ${usd(saved(d))} — ${percentOff(d)}% off the usual price.</p>
    <div class="save-bar" role="img" aria-label="${percentOff(d)} percent off"><span style="width:${percentOff(d)}%"></span></div>
  </div>
  <p class="stamp-line"><span class="stamp ${stampClass(d.verdict)}">${escape(d.verdict)}</span></p>
  <h2>Why this verdict</h2>
  <p class="evidence big-evidence">${escape(d.evidence)}</p>
  ${d.compare ? `<p class="compare"><strong>Same product, another store:</strong> ${escape(d.compare)}</p>` : ''}
  ${others.length ? `<p class="compare"><strong>Also listed:</strong> the same product at ${others.map((o) => `${escape(o.store)} for ${priceText(o)}`).join(' and ')}.</p>` : ''}
  <dl class="facts">
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${priceText(d)}</dd>
    <dt>Usual price</dt><dd>${usd(d.was)}${d.unit ? d.unit : ''}</dd>
    <dt>Discount</dt><dd>${percentOff(d)}% off — you save ${usd(saved(d))}</dd>
    <dt>Checked</dt><dd>${escape(checkedShort())}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="shop big-shop" href="${escape(d.url)}" target="_blank" rel="noopener">Shop it at ${escape(d.store)} &rarr;</a></p>
  <p class="fineprint">Prices move fast on Black Friday and can sell out. The link opens the product search at ${escape(d.store)} — check the price on the page before you pay.</p>
</article>`;
}

export function missingPage() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
