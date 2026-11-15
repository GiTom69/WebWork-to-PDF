#!/usr/bin/env python3
"""
Compiles technion_webwork_pdf_bookmarklet.js into a single-line snippet.txt
while enforcing Safari/Chrome/Firefox bookmarklet safety constraints.
"""
import re
from pathlib import Path

 INPUT_FILE = Path("technion_webwork_pdf_bookmarklet.js")
OUTPUT_FILE = Path("snippet.txt")


def check_syntax_balance(code: str) -> str:
    stack = []
    in_str = None
    for i, ch in enumerate(code):
        if in_str:
            if ch == in_str:
                in_str = None
        else:
            if ch in ("'", '"'):
                in_str = ch
            elif ch in "([{":
                stack.append((ch, i))
            elif ch in ")]}":
                if not stack:
                    return f"Unmatched {ch} at index {i}"
                top, pos = stack.pop()
                if (top, ch) not in (("(", ")"), ("[", "]"), ("{", "}")):
                    return f"Mismatched {top} at {pos} and {ch} at {i}"
    if in_str:
        return f"Unclosed string literal ({in_str})"
    if stack:
        return f"Unclosed brackets: {stack}"
    return "OK"


def collapse_string_array(match: re.Match) -> str:
    array_body, sep = match.group(1), match.group(2)
    items = re.findall(r"'([^']*)'", array_body)
    # Only collapse arrays consisting purely of string literals
    if re.sub(r"'[^']*'|,|\s+", "", array_body) == "":
        joined = sep.join(items)
        if "@page" in joined:
            joined = re.sub(r"\s*([{};:,])\s*", r"\1", joined)
            joined = joined.replace(" !important", "!important")
        return "'" + joined + "'"
    return match.group(0)


def minify_bookmarklet(source_code: str) -> str:
    # 1. Strip line and block comments
    code = re.sub(r"^\s*//.*$", "", source_code, flags=re.MULTILINE)
    code = re.sub(r"/\*[\s\S]*?\*/", "", code)

    # 2. Collapse pure string literal arrays (e.g., style.textContent, junkSelectors)
    code = re.sub(r"\[([\s\S]*?)\]\.join\('([ ,]?)'\)", collapse_string_array, code)

    # 3. Shorten internal CSS class names & IDs (ww-pdf-* -> wp-*)
    id_class_map = {
        "ww-pdf-hidden-orig": "wp-ho",
        "ww-pdf-toolbar-title": "wp-tt",
        "ww-pdf-toolbar": "wp-tb",
        "ww-pdf-controls": "wp-ct",
        "ww-pdf-btn-primary": "wp-b1",
        "ww-pdf-btn-secondary": "wp-b2",
        "ww-pdf-btn": "wp-b",
        "ww-pdf-sheet": "wp-sh",
        "ww-pdf-header": "wp-hd",
        "ww-pdf-card-head": "wp-ch",
        "ww-pdf-card-set": "wp-cs",
        "ww-pdf-card": "wp-cd",
        "ww-pdf-body": "wp-bd",
        "ww-pdf-root": "wp-r",
        "ww-pdf-style": "wp-s",
        "ww-pdf-status": "wp-st",
        "ww-pdf-list": "wp-ls",
        "ww-ans-box": "wp-ab",
        "ww-ans-text": "wp-at",
        "ww-hide-saved": "wp-hs",
        "ww-show-scratch": "wp-ss",
        "ww-scratchpad": "wp-sp",
        "ww-one-per-page": "wp-op",
        "ww-tex-wrap": "wp-tw",
        "ww-chk-blank": "wp-cb",
        "ww-chk-scratch": "wp-cs2",
        "ww-chk-onepage": "wp-co",
        "ww-btn-print": "wp-bp",
        "ww-btn-close": "wp-bc",
    }
    for old, new in sorted(id_class_map.items(), key=lambda x: -len(x[0])):
        code = code.replace(old, new)

    # 4. Shorten local variable & function identifiers
    ident_map = {
        "existingRoot": "eR",
        "existingStyle": "eS",
        "BALLOT_BOX": "BX",
        "findProblemLinks": "fL",
        "setPrefixParts": "sP",
        "setPrefix": "sPf",
        "curParts": "cP",
        "currentParts": "cP2",
        "pathParts": "pP",
        "lastPart": "lP",
        "cleanKey": "cK",
        "origChildren": "oC",
        "setTitle": "sT",
        "blankChk": "bC",
        "scratchChk": "sC",
        "onePageChk": "oP",
        "cleanProblemDOM": "cD",
        "junkSelectors": "jS",
        "isDisplay": "iD",
        "isMathJaxReady": "mR",
        "restoreScriptTags": "rS",
        "runTypeset": "rT",
        "startPromise": "sPm",
        "ensureMathJaxAndTypeset": "eM",
        "sampleDoc": "sD",
        "targetEl": "tE",
        "allScripts": "aS",
        "configScript": "cS",
        "engineScript": "eSc",
        "loadEngine": "lE",
        "firstParsedDoc": "fD",
        "statusEl": "stE",
        "listEl": "lEl",
    }
    for old, new in sorted(ident_map.items(), key=lambda x: -len(x[0])):
        code = re.sub(r"\b" + re.escape(old) + r"\b", new, code)

    # 5. Convert anonymous functions to ES6 arrow functions
    code = re.sub(r"function\s*\(\s*\)\s*\{", "()=>{", code)
    code = re.sub(r"function\s*\(\s*([a-zA-Z0-9_$]+)\s*\)\s*\{", r"\1=>{", code)
    code = re.sub(
        r"function\s*\(\s*([a-zA-Z0-9_$]+(?:\s*,\s*[a-zA-Z0-9_$]+)+)\s*\)\s*\{",
        r"(\1)=>{",
        code,
    )

    # 6. Strip unnecessary whitespace while preserving strings and regex literals
    token_pattern = re.compile(
        r"('[^']*'|\"[^\"]*\"|/\^\[0-9\]\+\$/|/MathJax\|MJX/i|/mathjax-config/i|/MathJax\[\.\]js\|tex-chtml\|tex-mml\|tex-svg/i|/\^WeBWorK \*:?\ \*/i|\s+)"
    )

    parts = token_pattern.split(code)
    out = []
    for i, part in enumerate(parts):
        if not part:
            continue
        if part[0] in ("'", '"'):
            if part.startswith("'") and re.match(r"^'\s+<", part):
                part = "'" + part[1:].lstrip()
            out.append(part)
        elif part.startswith("/"):
            out.append(part)
        elif part.isspace():
            prev_ch = out[-1][-1] if out else ""
            next_non_empty = next((p for p in parts[i + 1 :] if p and not p.isspace()), "")
            next_ch = next_non_empty[0] if next_non_empty else ""
            if (prev_ch.isalnum() or prev_ch in "_$") and (next_ch.isalnum() or next_ch in "_$"):
                out.append(" ")
        else:
            out.append(part)

    minified = "".join(out)
    # Collapse HTML array `.join('')`
    minified = re.sub(
        r"\[('[^']*'(:?\+[^,\]]+)?(?:,'[^']*'(:?\+[^,\]]+)?)+)\]\.join\(''\)",
        lambda m: m.group(1).replace("','", ""),
        minified,
    )

    uri = "javascript:" + minified

    # 7. Validate constraints
    for forbidden in ("#", "%", "\\"):
        assert forbidden not in uri, f"Forbidden character {forbidden!r} found!"
    assert all(ord(c) < 128 for c in uri), "Non-ASCII character found!"
    balance = check_syntax_balance(minified)
    assert balance == "OK", f"Syntax balance check failed: {balance}"

    return uri


if __name__ == "__main__":
    raw_js = INPUT_FILE.read_text(encoding="utf-8")
    snippet = minify_bookmarklet(raw_js)
    OUTPUT_FILE.write_text(snippet, encoding="utf-8")
    print(f"Successfully generated {OUTPUT_FILE} ({len(snippet)} chars).")
