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

let counter = 1;

// eslint-disable-next-line @typescript-eslint/no-shadow
async function copyIfNeeded(src: string, dest: string) {
  if (await checkFileExists(src)) {
    await fs.promises.copyFile(src, dest);
    log(`Updated - ${counter++}`);
    return true;
  }
  return false;
}

try {
  await copyIfNeeded(src, dest);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  fs.watchFile(src, async () => {
    try {
      await copyIfNeeded(src, dest);
    } catch (err) {
      logError(err);
    }
  });

  log(`Started watching ${src}...`);
} catch (err) {
  logError(err);
}
