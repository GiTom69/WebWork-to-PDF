# Technion WeBWorK to Offline PDF Bookmarklet

A zero-install browser bookmarklet for Chrome, Firefox, Safari, and iPadOS that converts [Technion WeBWorK](https://webwork.technion.ac.il/) homework sets into clean, printable PDF worksheets for offline practice and tablet note-taking.

| Before (Hardcopy PDF Blocked) | After (Clean Printable Worksheet) |
| :---: | :---: |
| <img src="before.png" alt="Before - Hardcopy PDF Blocked" height="300"> | <img src="after.png" alt="After - Generated Printable Worksheet" height="300"> |


## Table of Contents

- [Key Features](#key-features)
- [Setup](#setup)
- [How to Use](#how-to-use)
  - [Desktop](#desktop)
  - [Mobile & iPad (GoodNotes / Notability)](#mobile--ipad-goodnotes--notability)
- [Background & Motivation](#background--motivation)
- [How It Works Under the Hood](#how-it-works-under-the-hood)
- [Troubleshooting](#troubleshooting)
- [Customization](#customization)

## Key Features

- **One-Click Set Assembly:** Automatically fetches and merges all problems from a homework set or problem page in parallel.
- **Paper- & Stylus-Friendly:** Replaces text fields and dropdowns with write-in lines, and choice inputs with printable ballot boxes (`☐`).
- **Pre-Print Controls:** Toggle blank answer boxes for clean re-attempts, or append scratchpad areas for derivations.
- **Bilingual Support:** Handles mixed Hebrew text (RTL) and mathematical formulas (LTR) with proper alignment.
- **Zero Dependencies:** Pure JavaScript bookmarklet requiring no extensions, CLI tools, or external installs.


## Setup

1. Copy the single-line code from [**`snippet.txt`**](snippet.txt) (or the minified section of [**`technion_webwork_pdf_bookmarklet.js`**](technion_webwork_pdf_bookmarklet.js)).
2. Create a new bookmark in your browser:
   - **Name:** `WeBWorK to PDF`
   - **URL / Location:** Paste the copied code.

*(Tip: In desktop Chrome or Firefox, right-click your bookmarks bar and click **Add Bookmark...** or **Add page...**).*

## How to Use

### Desktop

1. Log in to WeBWorK via Moodle and open your homework set (or any problem page).
2. Click the **WeBWorK to PDF** bookmark.
3. Wait 1–2 seconds for problems to load.
4. *(Optional)* Toggle **Blank answer boxes** or **Add scratchpad space**.
5. Click **Print / Save PDF** (destination: **Save as PDF**).
6. Click **Back to WeBWorK** when finished.

### Mobile & iPad (GoodNotes / Notability)

- **Launch via Address Bar:** Open your WeBWorK set, tap your browser's **Address Bar**, type `WeBWorK to PDF`, and tap the matching bookmark from the suggestions list.
- **Save to Tablet Note Apps (iPad):**
  1. Tap **Print / Save PDF** on the generated worksheet.
  2. On the iOS print preview, **pinch outward** with two fingers to generate a true PDF.
  3. Tap **Share** and send directly to **GoodNotes**, **Notability**, or **Files**.

## Background & Motivation

Technion WeBWorK disables the built-in Hardcopy PDF generator for students, while Moodle LTI authentication prevents external scrapers from accessing problem sets. 

This bookmarklet runs directly inside your active, authenticated browser tab to fetch and compile all problems into a clean, formatted worksheet with full MathJax rendering—in one click.

## How It Works Under the Hood

1. **Link Discovery:** Scans the active set page for problem URLs matching `/webwork2/<course>/<set>/<problem>`.
2. **Parallel Fetching:** Downloads all problem pages concurrently via authenticated `fetch()` and parses them into DOM trees.
3. **DOM Cleaning:** Strips interactive buttons and hidden forms, rewrites relative image paths, and converts input fields into printable lines and checkboxes.
4. **MathJax Typesetting:** Invokes the page's local MathJax engine (or injects the course's MathJax config) to render all equations before printing.

## Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| *"Please open a Homework Set page..."* alert | Bookmarklet clicked outside of a homework set. | Navigate into a specific homework set (`/webwork2/...`) and try again. |
| Mobile Chrome opens a search page | Bookmark clicked from the `⋮` menu instead of address bar. | Type the bookmark name into the address bar and select the suggestion. |
| Formulas appear as raw LaTeX | Print was triggered before MathJax finished rendering. | Wait for the status indicator to read `Ready (... problems loaded)`. |
| Blank cards / session expired | WeBWorK session timed out. | Re-open WeBWorK from Moodle to refresh your session, then rerun. |

## Customization

To edit the bookmarklet:
1. Modify the readable source code in Section 2 of [**`technion_webwork_pdf_bookmarklet.js`**](technion_webwork_pdf_bookmarklet.js).
2. When minifying back into a single-line `javascript:` URI, avoid `#` and `%` characters (use `rgb(...)` colors, `[id="..."]`, and `px`/`em`/`rem` units) to ensure cross-browser compatibility.
