import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { runHygieneCheck } from "../verify-hygiene.mjs";

test("hygiene script detects violations in temporary fixtures", (t) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "occasio-hygiene-test-"));

  t.after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const srcDir = path.join(tmpDir, "shared/src");
  fs.mkdirSync(srcDir, { recursive: true });

  // Test 1: Clean file passes with 0 violations
  const cleanFile = path.join(srcDir, "clean.ts");
  fs.writeFileSync(
    cleanFile,
    `/**\n * Valid helper function.\n */\nexport function compute(): number {\n  return 42;\n}\n`
  );
  const cleanViolations = runHygieneCheck(tmpDir, ["shared/src"]);
  assert.equal(cleanViolations.length, 0, "Clean file should have 0 violations");

  // Test 2: File with console.log is flagged
  const consoleFile = path.join(srcDir, "console-bad.ts");
  fs.writeFileSync(consoleFile, `console.log("bad");\n`);
  const consoleViolations = runHygieneCheck(tmpDir, ["shared/src"]);
  assert.ok(
    consoleViolations.some((v) => v.rule === "no-console"),
    "Should detect no-console violation"
  );
  fs.unlinkSync(consoleFile);

  // Test 3: File with 'any' type annotation is flagged
  const anyFile = path.join(srcDir, "any-bad.ts");
  fs.writeFileSync(anyFile, "const x: " + "any = 123;\n");
  const anyViolations = runHygieneCheck(tmpDir, ["shared/src"]);
  assert.ok(
    anyViolations.some((v) => v.rule === "no-any"),
    "Should detect no-any violation"
  );
  fs.unlinkSync(anyFile);

  // Test 4: File exceeding 250 lines is flagged
  const largeFile = path.join(srcDir, "large-bad.ts");
  const longLines = Array.from({ length: 255 }, (_, i) => `// line ${i}`).join("\n");
  fs.writeFileSync(largeFile, longLines);
  const largeViolations = runHygieneCheck(tmpDir, ["shared/src"]);
  assert.ok(
    largeViolations.some((v) => v.rule === "max-lines"),
    "Should detect max-lines violation"
  );
  fs.unlinkSync(largeFile);

  // Test 5: Missing TSDoc on exported function is flagged
  const tsdocFile = path.join(srcDir, "tsdoc-bad.ts");
  fs.writeFileSync(tsdocFile, `export function missingDoc(): void {}\n`);
  const tsdocViolations = runHygieneCheck(tmpDir, ["shared/src"]);
  assert.ok(
    tsdocViolations.some((v) => v.rule === "missing-tsdoc"),
    "Should detect missing-tsdoc violation"
  );
  fs.unlinkSync(tsdocFile);
});
