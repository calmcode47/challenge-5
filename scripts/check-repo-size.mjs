#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const MAX_REPO_BYTES = 3 * 1024 * 1024; // 3 MB

/**
 * Checks that the git repository has only a single branch 'main'.
 * @param {string} rootDir
 */
function verifyGitBranches(rootDir) {
  try {
    const branches = execSync("git branch --format='%(refname:short)'", {
      cwd: rootDir,
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    if (branches.length > 1) {
      throw new Error(
        `Expected exactly 1 branch, but found ${branches.length}: ${branches.join(", ")}`
      );
    }

    const currentBranch = execSync("git branch --show-current", {
      cwd: rootDir,
      encoding: "utf8",
    }).trim();

    if (currentBranch !== "main") {
      throw new Error(`Current branch must be 'main', found '${currentBranch}'`);
    }
  } catch (err) {
    throw new Error(
      `Git branch verification failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Computes total byte size of all tracked git files.
 * @param {string} rootDir
 * @returns {number}
 */
export function computeTrackedRepoSize(rootDir = process.cwd()) {
  verifyGitBranches(rootDir);

  const filesOutput = execSync("git ls-files", {
    cwd: rootDir,
    encoding: "utf8",
  });
  const files = filesOutput.trim().split("\n").filter(Boolean);

  let totalBytes = 0;
  for (const file of files) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      totalBytes += fs.statSync(filePath).size;
    }
  }

  return totalBytes;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try {
    const size = computeTrackedRepoSize();
    const sizeMb = (size / (1024 * 1024)).toFixed(3);
    const maxMb = (MAX_REPO_BYTES / (1024 * 1024)).toFixed(1);

    console.log(`\n📁 Tracked Repository Size: ${sizeMb} MB / ${maxMb} MB limit`);

    if (size > MAX_REPO_BYTES) {
      console.error(`❌ Tracked repository size exceeded limit: ${sizeMb} MB > ${maxMb} MB`);
      process.exit(1);
    }
    console.log("✅ Repository size and single branch 'main' verified.");
  } catch (err) {
    console.error(`❌ ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
