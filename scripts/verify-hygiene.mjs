#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

// Assembled dynamically to prevent self-matching during script inspection
const FORBIDDEN_DIRECTIVES = [
  "@" + "ts-ignore",
  "@" + "ts-nocheck",
  "eslint-" + "disable",
  "TO" + "DO",
  "FIX" + "ME",
  "HA" + "CK",
  "X" + "XX",
];

const LOREM_PATTERN = new RegExp("lorem" + "\\s+" + "ipsum", "i");
const DANGEROUS_HTML = "dangerously" + "SetInnerHTML";
const PRIVATE_KEY_HEADER = "-----" + "BEGIN";
const STORAGE_NAMES = ["local" + "Storage", "session" + "Storage"];

function hasAnyType(line) {
  const anyTypePattern = new RegExp(":\\s*a" + "ny\\b|<a" + "ny>|\\bas\\s+a" + "ny\\b");
  return anyTypePattern.test(line);
}

function getDirectiveViolation(line) {
  for (const directive of FORBIDDEN_DIRECTIVES) {
    if (new RegExp(`\\b${directive}\\b`).test(line)) return directive;
  }
  if (LOREM_PATTERN.test(line)) return "lorem" + " ipsum";
  return null;
}

function getDangerousApiViolation(line) {
  if (line.includes(DANGEROUS_HTML)) return DANGEROUS_HTML;
  if (/\.innerHTML\s*=/.test(line)) return "innerHTML";
  if (/\beval\s*\(/.test(line)) return "eval";
  if (/new\s+Function\s*\(/.test(line)) return "new Function";
  return null;
}

function getSecretViolation(line) {
  if (/AIza[0-9A-Za-z_-]{20,}/.test(line)) return "AIza secret key pattern";
  if (/sk-[A-Za-z0-9]{20,}/.test(line)) return "sk- secret key pattern";
  if (line.includes(PRIVATE_KEY_HEADER)) return "private key block pattern";
  if (/api[_-]?key\s*[:=]\s*['"][^'"]{8,}/i.test(line)) return "api_key pattern";
  return null;
}

function getRestrictedImportViolation(line) {
  if (/from\s+['"]framer-motion['"]/.test(line)) return "forbidden import 'framer-motion'";
  if (/from\s+['"]react-router-dom['"]/.test(line)) return "forbidden import 'react-router-dom'";
  return null;
}

function getLocationScopedViolation(relPath, line) {
  const norm = relPath.replace(/\\/g, "/");
  const isStorageAllowed =
    norm.includes("state/persistence.ts") || norm.includes("state/persistence.test.ts");
  if (!isStorageAllowed) {
    for (const name of STORAGE_NAMES) {
      if (new RegExp(`\\b${name}\\b`).test(line))
        return "storage used outside state/persistence.ts";
    }
  }
  const isThreeAllowed =
    norm.startsWith("frontend/src/three/") ||
    norm.includes("BudgetRing") ||
    norm.includes("scripts/");
  if (!isThreeAllowed && /from\s+['"](three|@react-three\/[^'"]+)['"]/.test(line)) {
    return "three / @react-three imported outside three/ or BudgetRing";
  }
  return null;
}

function checkLineContent(rel, line, lineNum, isTest, isScript, prevLine, violations) {
  if (hasAnyType(line))
    violations.push({ path: rel, line: lineNum, rule: "no-any", snippet: line.trim() });
  const directive = getDirectiveViolation(line);
  if (directive)
    violations.push({ path: rel, line: lineNum, rule: directive, snippet: line.trim() });
  if (!isScript && /console\.(log|debug|info|warn|error)/.test(line)) {
    violations.push({ path: rel, line: lineNum, rule: "no-console", snippet: line.trim() });
  }
  const danger = getDangerousApiViolation(line);
  if (danger) violations.push({ path: rel, line: lineNum, rule: danger, snippet: line.trim() });
  const secret = getSecretViolation(line);
  if (secret) violations.push({ path: rel, line: lineNum, rule: secret, snippet: line.trim() });
  const restricted = getRestrictedImportViolation(line);
  if (restricted)
    violations.push({ path: rel, line: lineNum, rule: restricted, snippet: line.trim() });
  const scoped = getLocationScopedViolation(rel, line);
  if (scoped) violations.push({ path: rel, line: lineNum, rule: scoped, snippet: line.trim() });
  if (
    !isTest &&
    !isScript &&
    /^export\s+(function|const|class)\s+/.test(line) &&
    !prevLine.endsWith("*/")
  ) {
    violations.push({ path: rel, line: lineNum, rule: "missing-tsdoc", snippet: line.trim() });
  }
}

function checkSourceFileLineByLine(rootDir, filePath, violations) {
  const rel = path.relative(rootDir, filePath).replace(/\\/g, "/");
  const isScript = rel.startsWith("scripts/");
  const isTest = rel.includes(".test.") || rel.includes(".spec.") || rel.includes("__tests__");
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  if (!isTest && lines.length > 250) {
    violations.push({
      path: rel,
      line: lines.length,
      rule: "max-lines",
      snippet: `File has ${lines.length} lines (> 250)`,
    });
  }
  for (let idx = 0; idx < lines.length; idx += 1) {
    const prevLine = idx > 0 ? lines[idx - 1].trim() : "";
    checkLineContent(rel, lines[idx], idx + 1, isTest, isScript, prevLine, violations);
  }
}

function collectSourceFiles(dir, results) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", "coverage", ".git", ".vite"].includes(entry.name)) continue;
      collectSourceFiles(fullPath, results);
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
}

function checkBinaryAssets(rootDir, violations) {
  const assetsDir = path.join(rootDir, "frontend/public");
  if (!fs.existsSync(assetsDir)) return;
  const files = fs.readdirSync(assetsDir, { recursive: true, withFileTypes: true });
  for (const f of files) {
    if (!f.isFile()) continue;
    const full = path.join(f.parentPath || assetsDir, f.name);
    const stat = fs.statSync(full);
    const isWoff2 = f.name.endsWith(".woff2");
    const limit = isWoff2 ? 40 * 1024 : 50 * 1024;
    if (stat.size > limit) {
      const rel = path.relative(rootDir, full).replace(/\\/g, "/");
      violations.push({
        path: rel,
        line: 1,
        rule: "binary-size-exceeded",
        snippet: `${stat.size} bytes (limit ${limit} bytes)`,
      });
    }
  }
}

/**
 * Main hygiene verification execution function.
 * @param {string} [rootDir=process.cwd()]
 * @param {string[]} [scanDirs]
 * @returns {Array<{ path: string, line: number, rule: string, snippet: string }>}
 */
export function runHygieneCheck(
  rootDir = process.cwd(),
  scanDirs = ["shared/src", "frontend/src", "scripts"]
) {
  const violations = [];
  const files = [];
  for (const d of scanDirs) collectSourceFiles(path.resolve(rootDir, d), files);
  for (const f of files) checkSourceFileLineByLine(rootDir, f, violations);
  checkBinaryAssets(rootDir, violations);
  return violations;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const violations = runHygieneCheck();
  if (violations.length > 0) {
    console.error(`\n❌ Found ${violations.length} hygiene violation(s):\n`);
    for (const v of violations) console.error(`${v.path}:${v.line}  [${v.rule}]  ${v.snippet}`);
    process.exit(1);
  }
  console.log("✅ Codebase hygiene verified clean (0 violations).");
}
