#!/usr/bin/env node

import * as fs from 'node:fs';

function log(s: unknown) {
  // eslint-disable-next-line no-console
  console.log(s);
}

function logError(s: unknown) {
  return log(s);
}

const args = process.argv.slice(2);
if (!args.length) {
  log('Usage: keepcp [src] [dest]');
  process.exit(1);
}

const src = args[0];
const dest = args[1];
if (!src) {
  logError('Missing src');
  process.exit(1);
}
if (!dest) {
  logError('Missing dest');
  process.exit(1);
}

function checkFileExists(file: string) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
fs.watchFile(src, async (curr, prev) => {
  if (await checkFileExists(src)) {
    try {
      log(`${prev.mtime.toTimeString()} -> ${curr.mtime.toTimeString()}`);
      await fs.promises.copyFile(src, dest);
    } catch (err) {
      logError(err);
    }
  }
});

log(`Started watching ${src}...`);
