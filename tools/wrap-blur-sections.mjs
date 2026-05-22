/**
 * Replace blur-section wrappers (div or footer, multiline OK) with BlurSection.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "components");

function stripBlurToken(className) {
  return className
    .replace(/\bblur-section\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findMatchingClose(src, innerStart, tagName) {
  let depth = 1;
  const re = new RegExp(`<\\/?${tagName}\\b`, "g");
  re.lastIndex = innerStart;
  let m;
  while ((m = re.exec(src))) {
    const isClose = src[m.index + 1] === "/";
    const gt = src.indexOf(">", m.index);
    if (gt === -1) return null;
    const tagSlice = src.slice(m.index, gt + 1);
    if (/\/>\s*$/.test(tagSlice.trimEnd())) {
      continue;
    }
    if (isClose) {
      depth -= 1;
      if (depth === 0) {
        return { start: m.index, end: gt + 1 };
      }
    } else {
      depth += 1;
    }
  }
  return null;
}

function processSource(s) {
  let result = s;
  let changed = false;
  const openRe =
    /<(div|footer)([\s\S]*?)className="([^"]*\bblur-section\b[^"]*)"\s*>/g;

  while (true) {
    openRe.lastIndex = 0;
    const m = openRe.exec(result);
    if (!m) break;

    const tagName = m[1];
    const fullOpen = m[0];
    const cls = m[3];
    const openStart = m.index;
    const innerStart = openStart + fullOpen.length;
    const close = findMatchingClose(result, innerStart, tagName);
    if (!close) {
      console.warn("Unbalanced", tagName, "blur-section near", openStart);
      break;
    }

    const newCls = stripBlurToken(cls);
    const openReplace =
      tagName === "footer"
        ? `<BlurSection as="footer" className="${newCls}">`
        : `<BlurSection className="${newCls}">`;

    const before = result.slice(0, openStart);
    const middle = result.slice(innerStart, close.start);
    const after = result.slice(close.end);
    result = before + openReplace + middle + "</BlurSection>" + after;
    changed = true;
  }

  if (!changed) return null;

  if (!result.includes("@/components/template/blur/BlurSection")) {
    const line =
      'import BlurSection from "@/components/template/blur/BlurSection";\n';
    if (result.startsWith('"use client"')) {
      const i = result.indexOf("\n");
      result = result.slice(0, i + 1) + line + result.slice(i + 1);
    } else if (result.startsWith("'use client'")) {
      const i = result.indexOf("\n");
      result = result.slice(0, i + 1) + line + result.slice(i + 1);
    } else {
      result = line + result;
    }
  }

  return result;
}

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "node_modules") continue;
      walk(p);
    } else if (name.name.endsWith(".tsx")) {
      if (p.includes(`${path.sep}template${path.sep}blur${path.sep}`)) continue;
      const src = fs.readFileSync(p, "utf8");
      if (!src.includes("blur-section")) continue;
      const next = processSource(src);
      if (next && next !== src) {
        fs.writeFileSync(p, next, "utf8");
        console.log("updated", p);
      }
    }
  }
}

walk(ROOT);
