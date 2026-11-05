# Technion WeBWorK to Offline PDF Bookmarklet

A zero-install, cross-browser bookmarklet (**Google Chrome** & **Mozilla Firefox**) that converts online homework sets on [Technion WeBWorK](https://webwork.technion.ac.il/) into clean, formatted PDF worksheets for offline practice.

## Background & Motivation

WeBWorK includes a server-side `pdflatex` Hardcopy generator ([WeBWorK 2.17 Release Notes](https://wiki.openwebwork.org/wiki/Release_notes_for_WeBWorK_2.17)), but course staff and administrators frequently disable student access by raising the `download_hardcopy_format_pdf` role threshold ([WeBWorK Permissions](https://wiki.openwebwork.org/wiki/Permissions)) to avoid server-side LaTeX compilation spikes.

Additionally, [Technion WeBWorK](https://webwork.technion.ac.il/) authenticates students through [Moodle LTI single sign-on](https://forums.openwebwork.org/mod/forum/discuss.php?d=3973) and attaches a short-lived session `key` parameter to URLs, making external CLI scrapers high-friction to run. By executing directly inside your authenticated browser tab, this bookmarklet reuses your active session and local [MathJax](https://docs.mathjax.org/en/v2.3/output.html) instance with a single click.

## Key Features

* **One-Click Set Assembly:** Works from either a Homework Set Overview page (`/webwork2/<course>/<set>/`) or any individual Problem page (`/webwork2/<course>/<set>/<problem>/`), fetching all problems in the set concurrently via `Promise.all()`.
* **Technion Path Filtering:** Validates the `/webwork2/<course>/<set>/<problem>` path prefix and problem number range (`1–500`) so 6-digit Technion course codes in the breadcrumb navigation are never mistaken for problem links.
* **Paper-Friendly Input Normalization:** Converts `<input type="text">` and `<textarea>` fields into lined write-in boxes, transforms `<select>` dropdowns into inline choice brackets (`[ Option A / Option B ]`), and replaces radio/checkbox inputs with printable ballot boxes (`☐`).
* **Interactive Pre-Print Toolbar:**
  * **Blank answer boxes:** Toggles visibility of previously saved/submitted answers so you can practice from scratch on a clean sheet.
  * **Add scratchpad space:** Appends a dashed work area beneath each problem for handwritten derivations.
  * **Back to WeBWorK:** Restores the original interactive WeBWorK DOM immediately without reloading the page.
* **Mixed Hebrew (RTL) & Math (LTR) Support:** Applies `dir="auto"` to problem paragraphs while isolating `.MathJax`, `.MathJax_Display`, `mjx-container`, and answer boxes in `dir="ltr"` so Hebrew instructions and mathematical notation render in the proper reading order.
* **Cross-Browser Compatibility (Chrome & Firefox):**
  * Wraps execution in `javascript:void((function(){...})());` so Firefox never replaces the page with `[object Promise]`.
  * Avoids `#` and `%` characters inside the minified bookmarklet URI (`rgb(...)` colors, viewport/pixel units, and `document.getElementById`) so browser bookmark managers never truncate the script at a URL fragment or fail on percent-decoding.
  * Overrides `display`, `height`, and `overflow` on `html`, `body`, and the print container inside `@media print` to prevent Firefox from truncating multi-page printouts after Page 1.

## Project Files

| File | Purpose |
| :--- | :--- |
| `technion_webwork_pdf_bookmarklet.js` | Contains the minified single-line `javascript:void(...)` Bookmarklet URI (Section 1) and the full commented source code (Section 2). |
| `README.md` | Project documentation, installation instructions, architecture details, and troubleshooting guide. |

## Installation (Chrome & Firefox)

1. Open `technion_webwork_pdf_bookmarklet.js` and copy the entire single line under **Section 1** (starting with `javascript:void((function(){...`).
2. Create a new bookmark in your browser:
   * **Google Chrome:** Press `Ctrl+Shift+O` (or `Cmd+Option+B` on macOS) to open the Bookmark Manager, click the three-dot menu in the top right, and select **Add new bookmark** (or right-click your Bookmarks Bar and select **Add page...**).
   * **Mozilla Firefox:** Press `Ctrl+Shift+O` (or `Cmd+Shift+O` on macOS) to open the Library, or right-click your Bookmarks Toolbar and select **Add Bookmark...**.
3. Set the bookmark fields:
   * **Name:** `WeBWorK to PDF`
   * **URL / Location:** Paste the copied `javascript:void(...)` single line.
4. Click **Save**.

## Usage

1. Log in to your course via Moodle and open any homework set on [Technion WeBWorK](https://webwork.technion.ac.il/).
2. Click the **WeBWorK to PDF** bookmark on your Bookmarks Bar.
3. Wait 1–2 seconds for the toolbar status to change from `Fetching N problems...` to `Ready (N problems loaded)`.
4. Adjust the toolbar checkboxes (**Blank answer boxes** and **Add scratchpad space**) as needed.
5. Click **Print / Save PDF** and choose **Save as PDF** as your print destination:
   * Recommended print settings: **Layout:** Portrait, **Margins:** Default, **Background graphics:** Checked (optional, for shaded answer boxes).
6. Click **Back to WeBWorK** (or click the bookmarklet a second time) to return to the normal WeBWorK interface.

## How It Works Under the Hood

1. **Link Discovery (`findProblemLinks`):** Reads all anchor tags on the page, resolves relative URLs against `window.location.href`, and filters for links that match the current set prefix (`/webwork2/<courseId>/<setId>/<problemNum>`) with a numeric final path segment between `1` and `500`.
2. **Parallel Fetching:** Requests all discovered problem URLs concurrently using `fetch(url, { credentials: 'include' })` and parses each HTML string into an isolated DOM tree via `new DOMParser().parseFromString(html, 'text/html')`.
3. **DOM Sanitization (`cleanProblemDOM`):** Clones `.problem-content` (or `#problem_body` / `.problem-main-form`), strips interactive buttons and hidden inputs, resolves relative image paths for dynamically generated PG plots, and replaces form controls with print-styled elements.
4. **MathJax Typesetting (`ensureMathJaxAndTypeset`):** Triggers `window.MathJax.typesetPromise` (v3) or `window.MathJax.Hub.Queue` (v2) on the assembled problem list. If the user launched the bookmarklet from a Set Overview page that did not load [MathJax](https://docs.mathjax.org/en/v2.3/output.html), the script dynamically injects the same-origin MathJax `<script>` tag referenced in the first fetched problem page so it complies with the server's Content Security Policy (`script-src 'self'`).

## Customization & Rebuilding

If you modify the readable source code in Section 2 of `technion_webwork_pdf_bookmarklet.js`, keep two rules in mind before re-minifying into a `javascript:` URI:

* **No `#` characters:** Use `rgb(...)` or named CSS colors instead of hex codes (`#1e293b`), and use `document.getElementById('id')` or `[id="..."]` instead of `querySelector('#id')`.
* **No `%` characters:** Use `vw`, `vh`, `px`, `em`, or `rem` instead of `%` in CSS strings so the browser does not attempt to decode `%` sequences as URL escape codes.

## Troubleshooting

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| Alert says *"Please open a Homework Set page or Problem page..."* | Bookmarklet was clicked on the main course selection page or Moodle rather than inside a specific homework set. | Navigate into a specific homework set (`/webwork2/<course>/<set>/`) and click the bookmarklet again. |
| Formulas appear as raw LaTeX (`\int_0^1 ...`) | Print dialog was opened before MathJax finished typesetting. | Wait until the top-left toolbar indicator reads `Ready (N problems loaded)` before clicking **Print / Save PDF**. |
| Session expired / blank problem cards | The WeBWorK `key` token timed out due to inactivity. | Re-open WeBWorK from your Technion Moodle course page to refresh your LTI session, then run the bookmarklet. |
