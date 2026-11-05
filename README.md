# Technion WeBWorK to Offline PDF Bookmarklet

A zero-install, cross-platform bookmarklet for **Google Chrome**, **Mozilla Firefox**, **Apple Safari (macOS, iPadOS, iOS)**, and **Mobile Chrome / Firefox** that converts online homework sets on [Technion WeBWorK](https://webwork.technion.ac.il/) into clean, formatted PDF worksheets for offline practice and tablet note-taking.

## Background & Motivation

WeBWorK includes a server-side `pdflatex` Hardcopy generator ([WeBWorK 2.17 Release Notes](https://wiki.openwebwork.org/wiki/Release_notes_for_WeBWorK_2.17)), but course staff and administrators frequently disable student access by raising the `download_hardcopy_format_pdf` role threshold ([WeBWorK Permissions](https://wiki.openwebwork.org/wiki/Permissions)) to avoid server-side LaTeX compilation spikes.

Additionally, [Technion WeBWorK](https://webwork.technion.ac.il/) authenticates students through [Moodle LTI single sign-on](https://forums.openwebwork.org/mod/forum/discuss.php?d=3973) and attaches a short-lived session `key` parameter to URLs, making external CLI scrapers high-friction to run. By executing directly inside your authenticated browser tab, this bookmarklet reuses your active session and local [MathJax](https://docs.mathjax.org/en/v2.3/output.html) instance with a single click.

## Key Features

* **One-Click Set Assembly:** Works from either a Homework Set Overview page (`/webwork2/<course>/<set>/`) or any individual Problem page (`/webwork2/<course>/<set>/<problem>/`), fetching all problems in the set concurrently via `Promise.all()`.

* **Technion Path Filtering:** Validates the `/webwork2/<course>/<set>/<problem>` path prefix and problem number range (`1–500`) so 6-digit Technion course codes in the breadcrumb navigation are never mistaken for problem links.

* **Paper- & Stylus-Friendly Inputs:** Converts `<input type="text">` and `<textarea>` fields into lined write-in boxes, transforms `<select>` dropdowns into inline choice brackets (`[ Option A / Option B ]`), and replaces radio/checkbox inputs with printable ballot boxes (`☐`).

* **Interactive Pre-Print Toolbar:**

  * **Blank answer boxes:** Toggles visibility of previously saved/submitted answers so you can practice from scratch on a clean sheet.

  * **Add scratchpad space:** Appends a dashed work area beneath each problem for handwritten derivations.

  * **Back to WeBWorK:** Restores the original interactive WeBWorK DOM immediately without reloading the page.

* **Mixed Hebrew (RTL) & Math (LTR) Support:** Applies `dir="auto"` to problem paragraphs while isolating `.MathJax`, `.MathJax_Display`, `.MathJax_CHTML`, `.MathJax_SVG`, `mjx-container`, and answer boxes in `dir="ltr"` so Hebrew instructions and mathematical notation render in the proper reading order.

* **Universal Compatibility (Chrome, Firefox & Safari on Desktop & Mobile):**

  * Wraps execution in `javascript:void((function(){...})());` so Firefox, Safari, and mobile browsers never replace the page with `[object Promise]`.

  * Eliminates all `#`, `%`, and `\` (backslash) characters inside the minified bookmarklet URI (`rgb(...)` colors, viewport/pixel units, `[0-9]`/`[.]` character classes, and `String.fromCharCode`) so browser bookmark managers, Safari's `NSURL` parser, and iCloud Bookmark Sync never truncate or strip characters from the script.

  * Uses `el.getAttribute('class')` instead of `el.className` when hiding background DOM elements so WebKit's `SVGAnimatedString` on `<svg>` glyph caches is handled cleanly.

  * Combines `-webkit-column-break-inside: avoid`, `break-inside: avoid`, and `-webkit-print-color-adjust: exact` with block-level `@media print` overrides so Safari, Firefox, and Chrome paginate multi-page worksheets without clipping after Page 1.

## Project Files

| File | Purpose |
| :--- | :--- |
| `technion_webwork_pdf_bookmarklet.js` | Contains the minified single-line `javascript:void(...)` Bookmarklet URI (Section 1) and the full commented source code (Section 2). |
| `README.md` | Project documentation, desktop & mobile installation guides (Chrome, Firefox, Safari), architecture details, and troubleshooting guide. |

## Desktop Installation (Chrome, Firefox & macOS Safari)

1. Open `technion_webwork_pdf_bookmarklet.js` and copy the entire single line under **Section 1** (starting with `javascript:void((function(){...`).

2. Create a new bookmark in your desktop browser:

   * **Google Chrome:** Press `Ctrl+Shift+O` (or `Cmd+Option+B` on macOS) to open the Bookmark Manager, click the three-dot menu in the top right, and select **Add new bookmark** (or right-click your Bookmarks Bar and select **Add page...**).

   * **Mozilla Firefox:** Press `Ctrl+Shift+O` (or `Cmd+Shift+O` on macOS) to open the Library, or right-click your Bookmarks Toolbar and select **Add Bookmark...**.

   * **Apple Safari (macOS):** Bookmark any page (`Cmd+D`) to your **Favorites** bar, then right-click the new bookmark on the Favorites bar, select **Edit Address...**, and paste the `javascript:void(...)` line.

3. Set the bookmark fields:

   * **Name:** `WeBWorK to PDF`

   * **URL / Location / Address:** Paste the copied `javascript:void(...)` single line.

4. **One-Time macOS Safari Security Toggle:**

   By default, macOS Safari blocks `javascript:` bookmarklets until enabled in Developer settings ([Always Allow Safari Bookmarklets](https://mjtsai.com/blog/2024/06/24/always-allow-safari-bookmarklets/), [Bookmarklet Support Guide](https://webdirections.org/bluesky-poster/)):

   1. Open **Safari → Settings → Advanced** and check **Show features for web developers** (or **Show Develop menu in menu bar** on older macOS releases).

   2. Open **Safari → Settings → Developer** (or the **Develop** menu in the top menu bar) and check **Allow JavaScript from Smart Search Field**.

   3. The first time you click the bookmarklet on [Technion WeBWorK](https://webwork.technion.ac.il/), click **Allow** when Safari prompts for confirmation.

## Mobile & Tablet Setup & Usage (iPad, iPhone, Android)

The exact same bookmarklet code works on mobile and tablet browsers without changes. Because mobile browsers don't always execute `javascript:` URIs when tapped from standard bookmark menus, follow these platform-specific steps:

### 1. Adding the Bookmarklet to Mobile

* **Option A — Browser Sync (Fastest):** If your browser syncs bookmarks across devices (Apple iCloud for Safari, or Google Account sync for Chrome), adding the bookmark on your desktop automatically syncs it to your phone or iPad.

* **Option B — Manual Mobile Creation:**

  1. Bookmark any webpage in your mobile browser and name it `WeBWorK to PDF`.

  2. Edit the newly created bookmark.

  3. Replace the entire URL field with the single-line `javascript:void(...)` code copied from `technion_webwork_pdf_bookmarklet.js`.

  4. Save the bookmark.

### 2. Running on iPad & iPhone (Safari)

* **iPad Favorites Bar (1-Tap):**

  1. On your iPad, open **Settings → Safari** and toggle **Show Favorites Bar** to **ON**.

  2. Put the `WeBWorK to PDF` bookmark in your **Favorites** folder.

  3. Open your homework set on WeBWorK and tap **WeBWorK to PDF** directly from the top bar.

* **Address Bar Search Method (iPhone & iPad):**

  1. Log in to WeBWorK and open your homework set.

  2. Tap the browser **Address Bar / URL Bar**.

  3. Start typing `WeBWorK to PDF`.

  4. Scroll to the search suggestions and tap the bookmark item (marked with a star or bookmark icon). The script executes in your active tab.

* **Pinch-to-PDF Workflow (Apple Pencil / GoodNotes / Notability):**

  1. On the generated worksheet overlay, tap **Print / Save PDF**.

  2. In the iOS print preview screen, **pinch outward with two fingers** on the page preview (or tap the Share icon in the top right).

  3. iOS instantly converts the preview into a true PDF.

  4. Tap the **Share** button and select **Save to Files**, or send it straight to **GoodNotes**, **Notability**, or **Apple Notes** to solve problems with your Apple Pencil.

### 3. Running on Android (Chrome & Firefox)

* **Google Chrome:**

  1. Open your WeBWorK set.

  2. Tap the Chrome **Address Bar** (do *not* tap through the `⋮ → Bookmarks` menu, as Chrome mobile tries to open bookmarklets as web URLs).

  3. Type `WeBWorK to PDF`.

  4. Tap the matching bookmark suggestion from the autocomplete dropdown list.

  5. In the print dialog, select **Save as PDF** from the top printer destination dropdown.

* **Firefox for Android:**

  * Can be launched either via the address bar search suggestions or tapped directly from the **Bookmarks** menu. Choose **Save as PDF** in the print dialog.

## Desktop Usage

1. Log in to your course via Moodle and open any homework set on [Technion WeBWorK](https://webwork.technion.ac.il/).

2. Click the **WeBWorK to PDF** bookmark on your Bookmarks / Favorites Bar.

3. Wait 1–2 seconds for the toolbar status to change from `Fetching N problems...` to `Ready (N problems loaded)`.

4. Adjust the toolbar checkboxes (**Blank answer boxes** and **Add scratchpad space**) as needed.

5. Click **Print / Save PDF** and choose **Save as PDF** as your print destination:

   * Recommended print settings: **Layout:** Portrait, **Margins:** Default, **Background graphics / Print backgrounds:** Checked (optional, for shaded answer boxes).

6. Click **Back to WeBWorK** (or click the bookmarklet a second time) to return to the normal WeBWorK interface.

## How It Works Under the Hood

1. **Link Discovery (`findProblemLinks`):** Reads all anchor tags on the page, resolves relative URLs against `window.location.href`, and filters for links that match the current set prefix (`/webwork2/<courseId>/<setId>/<problemNum>`) with a numeric final path segment between `1` and `500`.

2. **Parallel Fetching:** Requests all discovered problem URLs concurrently using `fetch(url, { credentials: 'include' })` and parses each HTML string into an isolated DOM tree via `new DOMParser().parseFromString(html, 'text/html')`.

3. **DOM Adoption & Sanitization (`cleanProblemDOM`):** Adopts `.problem-content` (or `#problem_body` / `.problem-main-form`) into the active `window.document` via `document.importNode()`, strips interactive buttons and `.MathJax_Preview` placeholders, converts `<script type="math/tex">` tags into dual-compatible wrapper elements, resolves relative image paths for dynamically generated PG plots, and replaces form controls with print-styled elements.

4. **MathJax v2 & v3 Typesetting (`ensureMathJaxAndTypeset`):** If launched from a Set Overview page where [MathJax](https://docs.mathjax.org/en/v2.3/output.html) is not yet loaded, the script injects both the WeBWorK `mathjax-config.js` script and the main MathJax engine script from the first fetched problem page. Once ready, it runs `window.MathJax.typesetPromise` (for MathJax v3) or restores live `<script type="math/tex">` nodes and queues `window.MathJax.Hub.Queue(['Typeset', ...])` (for MathJax v2).

## Customization & Rebuilding

If you modify the readable source code in Section 2 of `technion_webwork_pdf_bookmarklet.js`, keep three rules in mind before re-minifying into a `javascript:` URI:

* **No `#` characters:** Use `rgb(...)` or named CSS colors instead of hex codes (`#1e293b`), and use `document.getElementById('id')` or `[id="..."]` instead of `querySelector('#id')`.

* **No `%` characters:** Use `vw`, `vh`, `px`, `em`, or `rem` instead of `%` in CSS strings so the browser does not attempt to decode `%` sequences as URL escape codes.

* **No `\` (backslash) characters:** Use character classes like `[0-9]` and `[.]` instead of `\d` and `\.` in regular expressions, and construct literal backslashes or Unicode symbols at runtime via `String.fromCharCode(92)` and `String.fromCharCode(9744)` so Safari's `NSURL` parser and iCloud Bookmark Sync never strip backslashes.

## Troubleshooting

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| Alert says *"Please open a Homework Set page or Problem page..."* | Bookmarklet was clicked on the main course selection page or Moodle rather than inside a specific homework set. | Navigate into a specific homework set (`/webwork2/<course>/<set>/`) and click the bookmarklet again. |
| Clicking the bookmarklet does nothing on macOS Safari | macOS Safari blocks `javascript:` bookmarklets by default. | Enable **Safari → Settings → Advanced → Show features for web developers**, then check **Settings → Developer → Allow JavaScript from Smart Search Field**. |
| Chrome Mobile opens a blank page or search results | Clicked the bookmark directly from the three-dot `⋮ → Bookmarks` menu. | Type the bookmark name into the address bar and select it from the suggestions list instead. |
| Formulas appear as raw LaTeX (`\int_0^1 ...`) | Print dialog was opened before MathJax finished typesetting, or using an older version of the bookmarklet. | Update the bookmark URL with Section 1 of the latest `technion_webwork_pdf_bookmarklet.js` and wait until the toolbar reads `Ready (N problems loaded)`. |
| Session expired / blank problem cards | The WeBWorK `key` token timed out due to inactivity. | Re-open WeBWorK from your Technion Moodle course page to refresh your LTI session, then run the bookmarklet. |
