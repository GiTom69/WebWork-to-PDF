/* ==========================================================================
   Technion WeBWorK to Offline PDF Generator
   --------------------------------------------------------------------------
   A zero-install browser bookmarklet that fetches all problems from a 
   Technion WeBWorK homework set, formats them into a clean, printable 
   worksheet, and triggers the browser's native Print/PDF exporter.
   ========================================================================== */

/* --------------------------------------------------------------------------
   SECTION 1: Minified Bookmarklet URI (Copy into Browser Bookmark URL Field)
   -------------------------------------------------------------------------- */
// javascript:void((function () { var existingRoot = document.getElementById('ww-pdf-root'); if (existingRoot) { existingRoot.remove(); var existingStyle = document.getElementById('ww-pdf-style'); if (existingStyle) existingStyle.remove(); Array.from(document.body.children).forEach(function (el) { el.classList.remove('ww-pdf-hidden-orig'); }); return; } var BS = String.fromCharCode(92); var BALLOT_BOX = String.fromCharCode(9744) + ' '; function findProblemLinks() { var curParts = window.location.pathname.split('/').filter(Boolean); var setPrefixParts = curParts.length >= 3 ? curParts.slice(0, 3) : curParts; var setPrefix = '/' + setPrefixParts.join('/') + '/'; var anchors = Array.from(document.querySelectorAll('a[href]')); var seen = new Set(); var results = []; anchors.forEach(function (a) { var href = a.getAttribute('href') || ''; if (!href || href.indexOf('javascript:') === 0) return; var url; try { url = new URL(href, window.location.href); } catch (e) { return; } if (url.pathname.indexOf(setPrefix) !== 0) return; if (url.pathname.indexOf('hardcopy') !== -1) return; var pathParts = url.pathname.split('/').filter(Boolean); if (pathParts.length !== setPrefixParts.length + 1) return; var lastPart = pathParts[pathParts.length - 1] || ''; if (!/^[0-9]+$/.test(lastPart)) return; var num = parseInt(lastPart, 10); if (num < 1 || num > 500) return; var cleanKey = url.origin + url.pathname; if (!seen.has(cleanKey)) { seen.add(cleanKey); results.push({ num: num, url: url.href }); } }); results.sort(function (a, b) { return a.num - b.num; }); return results; } var links = findProblemLinks(); if (links.length === 0) { var currentParts = window.location.pathname.split('/').filter(Boolean); var last = currentParts[currentParts.length - 1] || '1'; if (document.querySelector('.problem-content, .problem-main-form, [id="problem_body"]')) { links = [{ num: parseInt(last, 10) || 1, url: window.location.href }]; } else { alert('WeBWorK PDF Exporter: Please open a Homework Set page or Problem page on webwork.technion.ac.il first.'); return; } } var style = document.createElement('style'); style.id = 'ww-pdf-style'; style.textContent = [ '.ww-pdf-hidden-orig { display: none !important; }', '.ww-pdf-root { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: rgb(20, 24, 31); background: rgb(248, 250, 252); min-height: 100vh; padding: 0 0 48px 0; display: block; -webkit-print-color-adjust: exact; print-color-adjust: exact; }', '.ww-pdf-toolbar { position: sticky; top: 0; z-index: 99999; background: rgb(15, 23, 42); color: white; padding: 12px 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.18); direction: ltr; }', '.ww-pdf-toolbar-title { font-weight: 600; font-size: 15px; }', '.ww-pdf-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; font-size: 13px; }', '.ww-pdf-controls label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; -webkit-user-select: none; user-select: none; color: rgb(226, 232, 240); }', '.ww-pdf-btn { border: none; border-radius: 6px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; -webkit-appearance: none; appearance: none; }', '.ww-pdf-btn-primary { background: rgb(37, 99, 235); color: white; }', '.ww-pdf-btn-secondary { background: rgb(51, 65, 85); color: white; }', '.ww-pdf-sheet { max-width: 820px; margin: 24px auto; padding: 0 20px; display: block; }', '.ww-pdf-header { border-bottom: 2px solid rgb(30, 41, 59); padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: baseline; direction: ltr; }', '.ww-pdf-header h1 { font-size: 20px; margin: 0; color: rgb(15, 23, 42); }', '.ww-pdf-header span { font-size: 13px; color: rgb(100, 116, 139); }', '.ww-pdf-card { background: white; border: 1px solid rgb(203, 213, 225); border-radius: 8px; padding: 18px 22px; margin-bottom: 18px; box-sizing: border-box; -webkit-column-break-inside: avoid; break-inside: avoid; page-break-inside: avoid; display: block; }', '.ww-pdf-card-head { font-weight: 700; font-size: 14px; color: rgb(30, 41, 59); border-bottom: 1px solid rgb(226, 232, 240); padding-bottom: 6px; margin-bottom: 12px; display: flex; justify-content: space-between; direction: ltr; }', '.ww-pdf-body { font-size: 14px; line-height: 1.6; overflow-x: visible; }', '.ww-pdf-body img { max-width: 520px; height: auto; display: block; margin: 10px 0; }', '.ww-ans-box { display: inline-block; min-width: 120px; min-height: 24px; padding: 2px 8px; margin: 2px 4px; border: 1.5px solid rgb(71, 85, 105); border-radius: 4px; background: rgb(248, 250, 252); vertical-align: middle; font-family: ui-monospace, monospace; font-size: 13px; direction: ltr; text-align: left; }', '.ww-hide-saved .ww-ans-text { visibility: hidden; }', '.ww-scratchpad { display: none; margin-top: 14px; height: 110px; border: 1px dashed rgb(148, 163, 184); border-radius: 6px; padding: 6px 10px; font-size: 11px; color: rgb(148, 163, 184); direction: ltr; box-sizing: border-box; }', '.ww-show-scratch .ww-scratchpad { display: block; }', '.ww-one-per-page .ww-pdf-card { display: flex; flex-direction: column; min-height: 86vh; }', '.ww-one-per-page .ww-scratchpad { display: block !important; flex: 1 1 auto; height: auto; min-height: 160px; }', '.MathJax, .MathJax_Display, .MathJax_CHTML, .MathJax_SVG, mjx-container, .ww-tex-wrap { direction: ltr !important; unicode-bidi: isolate; }', '@media print {', '  html, body { background: white !important; display: block !important; height: auto !important; overflow: visible !important; position: static !important; margin: 0 !important; padding: 0 !important; }', '  .ww-pdf-toolbar { display: none !important; }', '  .ww-pdf-root { background: white !important; padding: 0 !important; min-height: 0 !important; display: block !important; }', '  .ww-pdf-sheet { max-width: none !important; margin: 0 !important; padding: 0 !important; display: block !important; }', '  .ww-pdf-card { border: 1px solid rgb(180, 190, 200) !important; box-shadow: none !important; margin-bottom: 14px !important; -webkit-column-break-inside: avoid !important; break-inside: avoid !important; page-break-inside: avoid !important; }', '  .ww-one-per-page .ww-pdf-card { display: flex !important; flex-direction: column !important; margin-bottom: 0 !important; min-height: 92vh !important; break-after: page !important; page-break-after: always !important; }', '  .ww-one-per-page .ww-pdf-card:first-child { min-height: calc(92vh - 64px) !important; }', '  .ww-one-per-page .ww-pdf-card:last-child { break-after: auto !important; page-break-after: auto !important; }', '  .ww-one-per-page .ww-scratchpad { display: block !important; flex: 1 1 auto !important; height: auto !important; min-height: 140px !important; }', '}' ].join(' '); document.head.appendChild(style); var origChildren = Array.from(document.body.children); origChildren.forEach(function (el) { var sig = (el.id || '') + ' ' + (el.getAttribute('class') || ''); if (/MathJax|MJX/i.test(sig)) return; el.classList.add('ww-pdf-hidden-orig'); }); var root = document.createElement('div'); root.id = 'ww-pdf-root'; root.className = 'ww-pdf-root ww-hide-saved tex2jax_process'; var setTitle = (document.title || 'WeBWorK Practice Sheet').replace(/^WeBWorK *:? */i, ''); root.innerHTML = [ '<div class="ww-pdf-toolbar">', '  <div class="ww-pdf-toolbar-title" id="ww-pdf-status">Fetching ' + links.length + ' problems...</div>', '  <div class="ww-pdf-controls">', '    <label><input type="checkbox" id="ww-chk-blank" checked> Blank answer boxes</label>', '    <label><input type="checkbox" id="ww-chk-scratch"> Add scratchpad space</label>', '    <label><input type="checkbox" id="ww-chk-per-page"> 1 problem per page</label>', '    <button class="ww-pdf-btn ww-pdf-btn-primary" id="ww-btn-print">Print / Save PDF</button>', '    <button class="ww-pdf-btn ww-pdf-btn-secondary" id="ww-btn-close">Back to WeBWorK</button>', '  </div>', '</div>', '<div class="ww-pdf-sheet">', '  <div class="ww-pdf-header">', '    <h1>' + setTitle + '</h1>', '    <span>Offline Practice Sheet (' + links.length + ' Problems)</span>', '  </div>', '  <div id="ww-pdf-list" class="tex2jax_process"></div>', '</div>' ].join(''); document.body.appendChild(root); document.getElementById('ww-chk-blank').addEventListener('change', function (e) { root.classList.toggle('ww-hide-saved', e.target.checked); }); document.getElementById('ww-chk-scratch').addEventListener('change', function (e) { root.classList.toggle('ww-show-scratch', e.target.checked); }); document.getElementById('ww-chk-per-page').addEventListener('change', function (e) { root.classList.toggle('ww-one-per-page', e.target.checked); if (e.target.checked) { var scratchChk = document.getElementById('ww-chk-scratch'); if (scratchChk && !scratchChk.checked) { scratchChk.checked = true; root.classList.add('ww-show-scratch'); } } }); document.getElementById('ww-btn-print').addEventListener('click', function () { window.print(); }); document.getElementById('ww-btn-close').addEventListener('click', function () { root.remove(); style.remove(); origChildren.forEach(function (el) { el.classList.remove('ww-pdf-hidden-orig'); }); }); function cleanProblemDOM(doc, baseUrl) { var container = doc.querySelector('.problem-content') || doc.getElementById('problem_body') || doc.querySelector('.problem-main-form') || doc.querySelector('[id*="problem"]'); if (!container) return null; var clone = document.importNode(container, true); var junkSelectors = [ 'input[type="submit"]', 'input[type="button"]', 'input[type="hidden"]', 'button', '.submit-buttons-container', '.problem-Batteries', '.showMeAnotherBox', '.AuthorComment', '.pg-editor-link', '.MathJax_Preview' ]; clone.querySelectorAll(junkSelectors.join(',')).forEach(function (el) { el.remove(); }); clone.querySelectorAll('script[type*="math/tex"]').forEach(function (sc) { var tex = (sc.textContent || sc.innerText || '').trim(); var isDisplay = (sc.getAttribute('type') || '').indexOf('mode=display') !== -1; var wrap = document.createElement(isDisplay ? 'div' : 'span'); wrap.className = 'math-tex tex2jax_process ww-tex-wrap'; wrap.setAttribute('data-tex', tex); wrap.setAttribute('data-display', isDisplay ? '1' : '0'); wrap.textContent = isDisplay ? BS + '[' + tex + BS + ']' : BS + '(' + tex + BS + ')'; sc.replaceWith(wrap); }); clone.querySelectorAll('img[src]').forEach(function (img) { try { img.src = new URL(img.getAttribute('src'), baseUrl).href; } catch (e) {} }); clone.querySelectorAll('input[type="text"], input[type="number"], input:not([type]), textarea').forEach(function (inp) { var box = document.createElement('span'); box.className = 'ww-ans-box'; var val = inp.value || inp.getAttribute('value') || ''; var inner = document.createElement('span'); inner.className = 'ww-ans-text'; inner.textContent = val; box.appendChild(inner); inp.replaceWith(box); }); clone.querySelectorAll('select').forEach(function (sel) { var opts = Array.from(sel.querySelectorAll('option')) .map(function (o) { return (o.textContent || '').trim(); }) .filter(function (t) { return t && t !== '?'; }); var span = document.createElement('span'); span.className = 'ww-ans-box'; span.textContent = '[ ' + (opts.join(' / ') || 'Select') + ' ]'; sel.replaceWith(span); }); clone.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(function (rc) { var sym = document.createElement('span'); sym.textContent = BALLOT_BOX; sym.style.fontSize = '16px'; rc.replaceWith(sym); }); clone.querySelectorAll('p, div, td, li').forEach(function (p) { if (!p.getAttribute('dir')) p.setAttribute('dir', 'auto'); }); return clone; } function isMathJaxReady() { if (!window.MathJax) return false; if (window.MathJax.typesetPromise) return true; if (window.MathJax.Hub && window.MathJax.Hub.Queue) return true; return false; } function restoreScriptTags(targetEl) { targetEl.querySelectorAll('.ww-tex-wrap[data-tex]').forEach(function (w) { var s = document.createElement('script'); s.type = w.getAttribute('data-display') === '1' ? 'math/tex; mode=display' : 'math/tex'; s.text = w.getAttribute('data-tex') || ''; w.replaceWith(s); }); } function runTypeset(targetEl, onDone) { if (!window.MathJax) { onDone(); return; } if (window.MathJax.typesetPromise) { var startPromise = window.MathJax.startup && window.MathJax.startup.promise ? window.MathJax.startup.promise : Promise.resolve(); startPromise .then(function () { if (window.MathJax.texReset) window.MathJax.texReset(); if (window.MathJax.typesetClear) window.MathJax.typesetClear([targetEl]); return window.MathJax.typesetPromise([targetEl]); }) .then(function () { if (!targetEl.querySelector('mjx-container') && targetEl.querySelector('.ww-tex-wrap[data-tex]')) { restoreScriptTags(targetEl); return window.MathJax.typesetPromise([targetEl]); } }) .then(onDone) .catch(onDone); return; } if (window.MathJax.Hub && window.MathJax.Hub.Queue) { restoreScriptTags(targetEl); window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, targetEl]); window.MathJax.Hub.Queue(onDone); return; } onDone(); } function ensureMathJaxAndTypeset(sampleDoc, targetEl, onDone) { if (isMathJaxReady()) { runTypeset(targetEl, onDone); return; } if (sampleDoc) { sampleDoc.querySelectorAll('script[type="text/x-mathjax-config"]').forEach(function (cfg) { var sc = document.createElement('script'); sc.type = 'text/x-mathjax-config'; sc.text = cfg.textContent || ''; document.head.appendChild(sc); }); var allScripts = Array.from(sampleDoc.querySelectorAll('script[src]')); var configScript = allScripts.find(function (s) { return /mathjax-config/i.test(s.getAttribute('src') || ''); }); var engineScript = allScripts.find(function (s) { var src = s.getAttribute('src') || ''; return !/mathjax-config/i.test(src) && /MathJax[.]js|tex-chtml|tex-mml|tex-svg/i.test(src); }); function loadEngine() { var es = document.createElement('script'); if (engineScript) { es.src = new URL(engineScript.getAttribute('src'), window.location.href).href; } else { es.src = '/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full'; } document.head.appendChild(es); } if (configScript) { var cs = document.createElement('script'); cs.src = new URL(configScript.getAttribute('src'), window.location.href).href; cs.onload = loadEngine; cs.onerror = loadEngine; document.head.appendChild(cs); } else { loadEngine(); } } var attempts = 0; var timer = setInterval(function () { attempts++; if (isMathJaxReady()) { clearInterval(timer); runTypeset(targetEl, onDone); } else if (attempts > 80) { clearInterval(timer); onDone(); } }, 100); } var listEl = document.getElementById('ww-pdf-list'); var statusEl = document.getElementById('ww-pdf-status'); var firstParsedDoc = null; Promise.all( links.map(function (item) { return fetch(item.url, { credentials: 'include' }) .then(function (res) { return res.text(); }) .then(function (html) { var parser = new DOMParser(); var doc = parser.parseFromString(html, 'text/html'); if (!firstParsedDoc) firstParsedDoc = doc; return { num: item.num, url: item.url, doc: doc }; }) .catch(function () { return { num: item.num, url: item.url, doc: null }; }); }) ).then(function (items) { items.forEach(function (item) { var card = document.createElement('div'); card.className = 'ww-pdf-card'; var head = document.createElement('div'); head.className = 'ww-pdf-card-head'; head.innerHTML = '<span>Problem ' + item.num + '</span><span></span>'; card.appendChild(head); var body = document.createElement('div'); body.className = 'ww-pdf-body'; var cleaned = item.doc ? cleanProblemDOM(item.doc, item.url) : null; if (cleaned) { body.appendChild(cleaned); } else { body.textContent = 'Could not extract problem content for Problem ' + item.num + '.'; } card.appendChild(body); var scratch = document.createElement('div'); scratch.className = 'ww-scratchpad'; scratch.textContent = 'Notes / Work:'; card.appendChild(scratch); listEl.appendChild(card); }); statusEl.textContent = 'Rendering LaTeX formulas...'; ensureMathJaxAndTypeset(firstParsedDoc, listEl, function () { statusEl.textContent = 'Ready (' + items.length + ' problems loaded)'; }); }); })());

/* --------------------------------------------------------------------------
   SECTION 2: Readable / Unminified Source Code
   -------------------------------------------------------------------------- */
/**
 * Technion WeBWorK -> Offline Practice PDF Bookmarklet
 * Verified for Google Chrome, Mozilla Firefox, and Apple Safari (macOS, iPadOS, iOS)
 *
 * Features:
 *  - Works from either a Homework Set Overview page or any individual Problem page
 *  - Filters out 6-digit Technion course codes in breadcrumbs by verifying set path prefix
 *  - Reuses your active Moodle LTI / WeBWorK session key automatically
 *  - Fetches all problems in parallel and extracts problem statements & plots
 *  - Converts <input>, <select>, and radio/checkboxes into clean write-in boxes
 *  - Bulletproof MathJax v2 & v3 rendering (supports script[type="math/tex"] and \(...\))
 *  - Optional "1 problem per page" mode where the remaining page height becomes a scratchpad
 *  - Zero #, %, or \ characters in URI (immune to Safari NSURL & iCloud Sync mangling)
 *  - Fixes Firefox & Safari multi-page print pagination & Hebrew/English BiDi alignment
 */

(function () {
  var existingRoot = document.getElementById('ww-pdf-root');
  if (existingRoot) {
    existingRoot.remove();
    var existingStyle = document.getElementById('ww-pdf-style');
    if (existingStyle) existingStyle.remove();
    Array.from(document.body.children).forEach(function (el) {
      el.classList.remove('ww-pdf-hidden-orig');
    });
    return;
  }

  var BS = String.fromCharCode(92);
  var BALLOT_BOX = String.fromCharCode(9744) + ' ';

  /* 1. Discover problem URLs belonging to the current Homework Set */
  function findProblemLinks() {
    var curParts = window.location.pathname.split('/').filter(Boolean);
    var setPrefixParts = curParts.length >= 3 ? curParts.slice(0, 3) : curParts;
    var setPrefix = '/' + setPrefixParts.join('/') + '/';

    var anchors = Array.from(document.querySelectorAll('a[href]'));
    var seen = new Set();
    var results = [];

    anchors.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (!href || href.indexOf('javascript:') === 0) return;
      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (e) {
        return;
      }
      if (url.pathname.indexOf(setPrefix) !== 0) return;
      if (url.pathname.indexOf('hardcopy') !== -1) return;

      var pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length !== setPrefixParts.length + 1) return;

      var lastPart = pathParts[pathParts.length - 1] || '';
      if (!/^[0-9]+$/.test(lastPart)) return;

      var num = parseInt(lastPart, 10);
      if (num < 1 || num > 500) return;

      var cleanKey = url.origin + url.pathname;
      if (!seen.has(cleanKey)) {
        seen.add(cleanKey);
        results.push({ num: num, url: url.href });
      }
    });

    results.sort(function (a, b) {
      return a.num - b.num;
    });
    return results;
  }

  var links = findProblemLinks();
  if (links.length === 0) {
    var currentParts = window.location.pathname.split('/').filter(Boolean);
    var last = currentParts[currentParts.length - 1] || '1';
    if (document.querySelector('.problem-content, .problem-main-form, [id="problem_body"]')) {
      links = [{ num: parseInt(last, 10) || 1, url: window.location.href }];
    } else {
      alert('WeBWorK PDF Exporter: Please open a Homework Set page or Problem page on webwork.technion.ac.il first.');
      return;
    }
  }

  /* 2. Inject cross-browser screen & print CSS (Safari/Firefox-safe block layout, zero #, %, or \ symbols) */
  var style = document.createElement('style');
  style.id = 'ww-pdf-style';
  style.textContent = [
    '.ww-pdf-hidden-orig { display: none !important; }',
    '.ww-pdf-root { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: rgb(20, 24, 31); background: rgb(248, 250, 252); min-height: 100vh; padding: 0 0 48px 0; display: block; -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
    '.ww-pdf-toolbar { position: sticky; top: 0; z-index: 99999; background: rgb(15, 23, 42); color: white; padding: 12px 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.18); direction: ltr; }',
    '.ww-pdf-toolbar-title { font-weight: 600; font-size: 15px; }',
    '.ww-pdf-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; font-size: 13px; }',
    '.ww-pdf-controls label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; -webkit-user-select: none; user-select: none; color: rgb(226, 232, 240); }',
    '.ww-pdf-btn { border: none; border-radius: 6px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; -webkit-appearance: none; appearance: none; }',
    '.ww-pdf-btn-primary { background: rgb(37, 99, 235); color: white; }',
    '.ww-pdf-btn-secondary { background: rgb(51, 65, 85); color: white; }',
    '.ww-pdf-sheet { max-width: 820px; margin: 24px auto; padding: 0 20px; display: block; }',
    '.ww-pdf-header { border-bottom: 2px solid rgb(30, 41, 59); padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: baseline; direction: ltr; }',
    '.ww-pdf-header h1 { font-size: 20px; margin: 0; color: rgb(15, 23, 42); }',
    '.ww-pdf-header span { font-size: 13px; color: rgb(100, 116, 139); }',
    '.ww-pdf-card { background: white; border: 1px solid rgb(203, 213, 225); border-radius: 8px; padding: 18px 22px; margin-bottom: 18px; box-sizing: border-box; -webkit-column-break-inside: avoid; break-inside: avoid; page-break-inside: avoid; display: block; }',
    '.ww-pdf-card-head { font-weight: 700; font-size: 14px; color: rgb(30, 41, 59); border-bottom: 1px solid rgb(226, 232, 240); padding-bottom: 6px; margin-bottom: 12px; display: flex; justify-content: space-between; direction: ltr; }',
    '.ww-pdf-body { font-size: 14px; line-height: 1.6; overflow-x: visible; }',
    '.ww-pdf-body img { max-width: 520px; height: auto; display: block; margin: 10px 0; }',
    '.ww-ans-box { display: inline-block; min-width: 120px; min-height: 24px; padding: 2px 8px; margin: 2px 4px; border: 1.5px solid rgb(71, 85, 105); border-radius: 4px; background: rgb(248, 250, 252); vertical-align: middle; font-family: ui-monospace, monospace; font-size: 13px; direction: ltr; text-align: left; }',
    '.ww-hide-saved .ww-ans-text { visibility: hidden; }',
    '.ww-scratchpad { display: none; margin-top: 14px; height: 110px; border: 1px dashed rgb(148, 163, 184); border-radius: 6px; padding: 6px 10px; font-size: 11px; color: rgb(148, 163, 184); direction: ltr; box-sizing: border-box; }',
    '.ww-show-scratch .ww-scratchpad { display: block; }',
    '.ww-one-per-page .ww-pdf-card { display: flex; flex-direction: column; min-height: 86vh; }',
    '.ww-one-per-page .ww-scratchpad { display: block !important; flex: 1 1 auto; height: auto; min-height: 160px; }',
    '.MathJax, .MathJax_Display, .MathJax_CHTML, .MathJax_SVG, mjx-container, .ww-tex-wrap { direction: ltr !important; unicode-bidi: isolate; }',
    '@media print {',
    '  html, body { background: white !important; display: block !important; height: auto !important; overflow: visible !important; position: static !important; margin: 0 !important; padding: 0 !important; }',
    '  .ww-pdf-toolbar { display: none !important; }',
    '  .ww-pdf-root { background: white !important; padding: 0 !important; min-height: 0 !important; display: block !important; }',
    '  .ww-pdf-sheet { max-width: none !important; margin: 0 !important; padding: 0 !important; display: block !important; }',
    '  .ww-pdf-card { border: 1px solid rgb(180, 190, 200) !important; box-shadow: none !important; margin-bottom: 14px !important; -webkit-column-break-inside: avoid !important; break-inside: avoid !important; page-break-inside: avoid !important; }',
    '  .ww-one-per-page .ww-pdf-card { display: flex !important; flex-direction: column !important; margin-bottom: 0 !important; min-height: 92vh !important; break-after: page !important; page-break-after: always !important; }',
    '  .ww-one-per-page .ww-pdf-card:first-child { min-height: calc(92vh - 64px) !important; }',
    '  .ww-one-per-page .ww-pdf-card:last-child { break-after: auto !important; page-break-after: auto !important; }',
    '  .ww-one-per-page .ww-scratchpad { display: block !important; flex: 1 1 auto !important; height: auto !important; min-height: 140px !important; }',
    '}'
  ].join(' ');
  document.head.appendChild(style);

  /* 3. Hide original children without hiding MathJax SVG glyph caches (SVGAnimatedString-safe) */
  var origChildren = Array.from(document.body.children);
  origChildren.forEach(function (el) {
    var sig = (el.id || '') + ' ' + (el.getAttribute('class') || '');
    if (/MathJax|MJX/i.test(sig)) return;
    el.classList.add('ww-pdf-hidden-orig');
  });

  var root = document.createElement('div');
  root.id = 'ww-pdf-root';
  root.className = 'ww-pdf-root ww-hide-saved tex2jax_process';

  var setTitle = (document.title || 'WeBWorK Practice Sheet').replace(/^WeBWorK *:? */i, '');
  root.innerHTML = [
    '<div class="ww-pdf-toolbar">',
    '  <div class="ww-pdf-toolbar-title" id="ww-pdf-status">Fetching ' + links.length + ' problems...</div>',
    '  <div class="ww-pdf-controls">',
    '    <label><input type="checkbox" id="ww-chk-blank" checked> Blank answer boxes</label>',
    '    <label><input type="checkbox" id="ww-chk-scratch"> Add scratchpad space</label>',
    '    <label><input type="checkbox" id="ww-chk-per-page"> 1 problem per page</label>',
    '    <button class="ww-pdf-btn ww-pdf-btn-primary" id="ww-btn-print">Print / Save PDF</button>',
    '    <button class="ww-pdf-btn ww-pdf-btn-secondary" id="ww-btn-close">Back to WeBWorK</button>',
    '  </div>',
    '</div>',
    '<div class="ww-pdf-sheet">',
    '  <div class="ww-pdf-header">',
    '    <h1>' + setTitle + '</h1>',
    '    <span>Offline Practice Sheet (' + links.length + ' Problems)</span>',
    '  </div>',
    '  <div id="ww-pdf-list" class="tex2jax_process"></div>',
    '</div>'
  ].join('');
  document.body.appendChild(root);

  document.getElementById('ww-chk-blank').addEventListener('change', function (e) {
    root.classList.toggle('ww-hide-saved', e.target.checked);
  });
  document.getElementById('ww-chk-scratch').addEventListener('change', function (e) {
    root.classList.toggle('ww-show-scratch', e.target.checked);
  });
  document.getElementById('ww-chk-per-page').addEventListener('change', function (e) {
    root.classList.toggle('ww-one-per-page', e.target.checked);
    if (e.target.checked) {
      var scratchChk = document.getElementById('ww-chk-scratch');
      if (scratchChk && !scratchChk.checked) {
        scratchChk.checked = true;
        root.classList.add('ww-show-scratch');
      }
    }
  });
  document.getElementById('ww-btn-print').addEventListener('click', function () {
    window.print();
  });
  document.getElementById('ww-btn-close').addEventListener('click', function () {
    root.remove();
    style.remove();
    origChildren.forEach(function (el) {
      el.classList.remove('ww-pdf-hidden-orig');
    });
  });

  /* 4. Transform interactive inputs and normalize math markup inside a cloned problem node */
  function cleanProblemDOM(doc, baseUrl) {
    var container =
      doc.querySelector('.problem-content') ||
      doc.getElementById('problem_body') ||
      doc.querySelector('.problem-main-form') ||
      doc.querySelector('[id*="problem"]');

    if (!container) return null;
    var clone = document.importNode(container, true);

    var junkSelectors = [
      'input[type="submit"]',
      'input[type="button"]',
      'input[type="hidden"]',
      'button',
      '.submit-buttons-container',
      '.problem-Batteries',
      '.showMeAnotherBox',
      '.AuthorComment',
      '.pg-editor-link',
      '.MathJax_Preview'
    ];
    clone.querySelectorAll(junkSelectors.join(',')).forEach(function (el) {
      el.remove();
    });

    /* Convert <script type="math/tex"> into dual-compatible wrapper spans carrying data-tex */
    clone.querySelectorAll('script[type*="math/tex"]').forEach(function (sc) {
      var tex = (sc.textContent || sc.innerText || '').trim();
      var isDisplay = (sc.getAttribute('type') || '').indexOf('mode=display') !== -1;
      var wrap = document.createElement(isDisplay ? 'div' : 'span');
      wrap.className = 'math-tex tex2jax_process ww-tex-wrap';
      wrap.setAttribute('data-tex', tex);
      wrap.setAttribute('data-display', isDisplay ? '1' : '0');
      wrap.textContent = isDisplay ? BS + '[' + tex + BS + ']' : BS + '(' + tex + BS + ')';
      sc.replaceWith(wrap);
    });

    clone.querySelectorAll('img[src]').forEach(function (img) {
      try {
        img.src = new URL(img.getAttribute('src'), baseUrl).href;
      } catch (e) {}
    });

    clone.querySelectorAll('input[type="text"], input[type="number"], input:not([type]), textarea').forEach(function (inp) {
      var box = document.createElement('span');
      box.className = 'ww-ans-box';
      var val = inp.value || inp.getAttribute('value') || '';
      var inner = document.createElement('span');
      inner.className = 'ww-ans-text';
      inner.textContent = val;
      box.appendChild(inner);
      inp.replaceWith(box);
    });

    clone.querySelectorAll('select').forEach(function (sel) {
      var opts = Array.from(sel.querySelectorAll('option'))
        .map(function (o) { return (o.textContent || '').trim(); })
        .filter(function (t) { return t && t !== '?'; });
      var span = document.createElement('span');
      span.className = 'ww-ans-box';
      span.textContent = '[ ' + (opts.join(' / ') || 'Select') + ' ]';
      sel.replaceWith(span);
    });

    clone.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(function (rc) {
      var sym = document.createElement('span');
      sym.textContent = BALLOT_BOX;
      sym.style.fontSize = '16px';
      rc.replaceWith(sym);
    });

    clone.querySelectorAll('p, div, td, li').forEach(function (p) {
      if (!p.getAttribute('dir')) p.setAttribute('dir', 'auto');
    });

    return clone;
  }

  /* 5. Load MathJax (if started from Set Overview) and typeset all formulas (MathJax v2 & v3) */
  function isMathJaxReady() {
    if (!window.MathJax) return false;
    if (window.MathJax.typesetPromise) return true;
    if (window.MathJax.Hub && window.MathJax.Hub.Queue) return true;
    return false;
  }

  function restoreScriptTags(targetEl) {
    targetEl.querySelectorAll('.ww-tex-wrap[data-tex]').forEach(function (w) {
      var s = document.createElement('script');
      s.type = w.getAttribute('data-display') === '1' ? 'math/tex; mode=display' : 'math/tex';
      s.text = w.getAttribute('data-tex') || '';
      w.replaceWith(s);
    });
  }

  function runTypeset(targetEl, onDone) {
    if (!window.MathJax) {
      onDone();
      return;
    }
    /* MathJax v3 branch */
    if (window.MathJax.typesetPromise) {
      var startPromise =
        window.MathJax.startup && window.MathJax.startup.promise
          ? window.MathJax.startup.promise
          : Promise.resolve();
      startPromise
        .then(function () {
          if (window.MathJax.texReset) window.MathJax.texReset();
          if (window.MathJax.typesetClear) window.MathJax.typesetClear([targetEl]);
          return window.MathJax.typesetPromise([targetEl]);
        })
        .then(function () {
          if (!targetEl.querySelector('mjx-container') && targetEl.querySelector('.ww-tex-wrap[data-tex]')) {
            restoreScriptTags(targetEl);
            return window.MathJax.typesetPromise([targetEl]);
          }
        })
        .then(onDone)
        .catch(onDone);
      return;
    }
    /* MathJax v2 branch: restore native <script type="math/tex"> so TeX input jax processes them directly */
    if (window.MathJax.Hub && window.MathJax.Hub.Queue) {
      restoreScriptTags(targetEl);
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, targetEl]);
      window.MathJax.Hub.Queue(onDone);
      return;
    }
    onDone();
  }

  function ensureMathJaxAndTypeset(sampleDoc, targetEl, onDone) {
    if (isMathJaxReady()) {
      runTypeset(targetEl, onDone);
      return;
    }

    if (sampleDoc) {
      sampleDoc.querySelectorAll('script[type="text/x-mathjax-config"]').forEach(function (cfg) {
        var sc = document.createElement('script');
        sc.type = 'text/x-mathjax-config';
        sc.text = cfg.textContent || '';
        document.head.appendChild(sc);
      });

      var allScripts = Array.from(sampleDoc.querySelectorAll('script[src]'));
      var configScript = allScripts.find(function (s) {
        return /mathjax-config/i.test(s.getAttribute('src') || '');
      });
      var engineScript = allScripts.find(function (s) {
        var src = s.getAttribute('src') || '';
        return !/mathjax-config/i.test(src) && /MathJax[.]js|tex-chtml|tex-mml|tex-svg/i.test(src);
      });

      function loadEngine() {
        var es = document.createElement('script');
        if (engineScript) {
          es.src = new URL(engineScript.getAttribute('src'), window.location.href).href;
        } else {
          es.src = '/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full';
        }
        document.head.appendChild(es);
      }

      if (configScript) {
        var cs = document.createElement('script');
        cs.src = new URL(configScript.getAttribute('src'), window.location.href).href;
        cs.onload = loadEngine;
        cs.onerror = loadEngine;
        document.head.appendChild(cs);
      } else {
        loadEngine();
      }
    }

    var attempts = 0;
    var timer = setInterval(function () {
      attempts++;
      if (isMathJaxReady()) {
        clearInterval(timer);
        runTypeset(targetEl, onDone);
      } else if (attempts > 80) {
        clearInterval(timer);
        onDone();
      }
    }, 100);
  }

  /* 6. Fetch all problems in parallel and render cards */
  var listEl = document.getElementById('ww-pdf-list');
  var statusEl = document.getElementById('ww-pdf-status');
  var firstParsedDoc = null;

  Promise.all(
    links.map(function (item) {
      return fetch(item.url, { credentials: 'include' })
        .then(function (res) { return res.text(); })
        .then(function (html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          if (!firstParsedDoc) firstParsedDoc = doc;
          return { num: item.num, url: item.url, doc: doc };
        })
        .catch(function () {
          return { num: item.num, url: item.url, doc: null };
        });
    })
  ).then(function (items) {
    items.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'ww-pdf-card';

      var head = document.createElement('div');
      head.className = 'ww-pdf-card-head';
      head.innerHTML = '<span>Problem ' + item.num + '</span><span></span>';
      card.appendChild(head);

      var body = document.createElement('div');
      body.className = 'ww-pdf-body';

      var cleaned = item.doc ? cleanProblemDOM(item.doc, item.url) : null;
      if (cleaned) {
        body.appendChild(cleaned);
      } else {
        body.textContent = 'Could not extract problem content for Problem ' + item.num + '.';
      }
      card.appendChild(body);

      var scratch = document.createElement('div');
      scratch.className = 'ww-scratchpad';
      scratch.textContent = 'Notes / Work:';
      card.appendChild(scratch);

      listEl.appendChild(card);
    });

    statusEl.textContent = 'Rendering LaTeX formulas...';
    ensureMathJaxAndTypeset(firstParsedDoc, listEl, function () {
      statusEl.textContent = 'Ready (' + items.length + ' problems loaded)';
    });
  });
})();