# Technion WeBWorK to PDF Bookmarklet

A client-side bookmarklet that compiles an entire Technion WeBWorK homework set into a single, formatted, printable practice worksheet (PDF). 

Supports bilingual (Hebrew/English) courses, dynamic MathJax rendering, and multi-page print layouts across Chrome, Firefox, and Safari on PC and tablets.

---

## Features

- **Full Set Compilation**: Automatically fetches and merges all problems from the active homework set in parallel while reusing your existing Moodle LTI / WeBWorK session.
- **Run from Anywhere**: Launch the bookmarklet from either the **Homework Set Overview** page or any **individual Problem** page.
- **Interactive-to-Paper Conversion**: Replaces text inputs, dropdown menus, and radio/checkbox inputs with clean write-in answer boxes and printable ballot symbols (`☐`).
- **Pre-Print Controls**:
  - **Blank answer boxes**: Hides previously saved answers for a clean practice sheet.
  - **Add scratchpad space**: Appends a dedicated lined/dashed work area below each problem.
  - **1 problem per page**: Expands each problem and its scratchpad to fill a full A4 page (`break-after: page`).
- **Bilingual & MathJax Support**: Preserves right-to-left (RTL) Hebrew text alongside left-to-right (LTR) LaTeX equations, supporting both MathJax v2 and v3.

---

## Installation & Usage

### 1. Desktop (Windows, macOS, Linux — Chrome, Firefox, Safari, Edge)

1. Open [`snippet.txt`](./snippet.txt) and copy the single-line `javascript:(function...` code.
2. Right-click your browser's **Bookmarks Bar** and select **Add Page...** or **Add Bookmark...**.
3. Set the **Name** to `WeBWorK to PDF`.
4. Paste the copied code into the **URL / Address** field and save.
5. **To use**: Open your homework set on `webwork.technion.ac.il`, click **WeBWorK to PDF** on your Bookmarks Bar, adjust your layout options, and click **Print / Save PDF**.

---

### 2. Tablets (Samsung Galaxy Tab & iPad)

> **Browser Compatibility Note**: Use **Chrome** (on Android or iPad) or **Safari** (on iPad). *Firefox on iPadOS is not supported because Mozilla disables bookmarklet execution on iOS/iPadOS.*

#### Option A: Chrome on Samsung Tab or iPad (Lowest Friction via Chrome Sync)
1. Install the bookmarklet on your **PC in Google Chrome** first (using the Desktop steps above) with **Chrome Sync** enabled—the tiny loader bookmark will automatically sync to your tablet.
   *(If adding manually on the tablet instead: bookmark any page, tap **Edit**, set Name to `WeBWorK to PDF`, paste the code from [`snippet.txt`](./snippet.txt) into the URL field, and ensure the leading `javascript:` prefix was not stripped by your keyboard).*
2. Open your WeBWorK homework set on `webwork.technion.ac.il`.
3. **To launch**:
   - **iPad + Chrome**: Open **Bookmarks** (or type `WeBWorK to PDF` in the Address Bar) and tap the bookmark.
   - **Samsung Tab + Chrome**: Tap the **Address Bar**, type `WeBWorK to PDF`, and tap the matching suggestion with the **Star icon** (do not press Enter/Search on the keyboard).
4. Tap **Print / Save PDF** to save as PDF or share directly into **GoodNotes**, **Notability**, or **Samsung Notes**.

#### Option B: Safari on iPad
1. Enable Safari's Favorites Bar (**Settings → Safari → Show Favorites Bar**).
2. Copy the single-line code from [`snippet.txt`](./snippet.txt).
3. In Safari, add a bookmark for any webpage into your **Favorites**, then open the **Bookmarks sidebar → Edit**, select that bookmark, rename it to `WeBWorK to PDF`, replace its URL with the copied code, and tap **Done**.
4. **To launch**: Open your WeBWorK homework set and tap **WeBWorK to PDF** directly on your **Favorites Bar** (or inside the Bookmarks menu). *Do not launch via the Safari Address Bar, as Safari blocks scripts triggered from the search field.*

---

## Repository Structure

| File | Description |
| :--- | :--- |
| **`snippet.txt`** | Lightweight, pure-ASCII `javascript:` loader URI ready to paste directly into a browser bookmark. |
| **`technion_webwork_pdf_bookmarklet.js`** | Full readable and commented source code served dynamically when the bookmarklet runs. |

---

## How It Works

1. **Link Discovery**: Scans the page for URLs matching the current course and homework set path (`/webwork2/<course>/<set>/<problem>`), ignoring 6-digit Technion course numbers in breadcrumb navigation. If triggered inside a Moodle LTI `<iframe>` wrapper, it automatically navigates to the direct WeBWorK frame first.
2. **Parallel Fetching**: Requests all problem pages concurrently via `fetch(..., { credentials: 'include' })` and parses them with `DOMParser`.
3. **DOM Cleaning**: Extracts `.problem-content` / `#problem_body`, strips navigation and submission buttons, resolves relative image URLs, and normalizes `<script type="math/tex">` nodes.
4. **MathJax Typesetting**: Invokes the page's local MathJax engine (or injects the course's MathJax config) to render all equations before printing.

---

## Customization

To customize the worksheet layout or styling, edit [`technion_webwork_pdf_bookmarklet.js`](./technion_webwork_pdf_bookmarklet.js) and commit your changes to `main`. Because `snippet.txt` dynamically loads the script from this repository, existing bookmarks will receive updates automatically without needing to be reinstalled.
