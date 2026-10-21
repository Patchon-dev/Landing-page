import { mkdir, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const assets = new URL('../src/assets/', import.meta.url);
const output = new URL('optimized/', assets);
await mkdir(new URL('flags/', output), { recursive: true });
let total = 0;
for (const width of [60, 120, 180]) {
  const target = new URL(`profile-${width}.webp`, output);
  await sharp(fileURLToPath(new URL('Daniel Lopes.png', assets)))
    .rotate().resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 }).toFile(fileURLToPath(target));
  total += (await stat(target)).size;
}
for (const filename of await readdir(new URL('flags/', assets))) {
  if (!filename.endsWith('.svg')) continue;
  const target = new URL(`flags/${filename.replace(/\.svg$/, '.webp')}`, output);
  await sharp(fileURLToPath(new URL(`flags/${filename}`, assets)), { density: 144 })
    .resize(42, 30, { fit: 'cover' }).webp({ lossless: true, effort: 6 })
    .toFile(fileURLToPath(target));
  total += (await stat(target)).size;
}
console.log(`Generated responsive profile images and flags (${(total / 1024).toFixed(1)} KB combined).`);
