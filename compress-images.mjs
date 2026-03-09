import sharp from 'sharp';
import { join } from 'path';

const PUBLIC = './public';

const targets = [
  ...Array.from({length:6}, (_, i) => `gallery/gallery-${i+1}.jpg`),
  ...Array.from({length:6}, (_, i) => `gallery/gallery-${i+1}b.jpg`),
  'credibility-bg.jpg',
  'cta-bg.jpg',
];

for (const file of targets) {
  const input = join(PUBLIC, file);
  const output = input.replace('.jpg', '.webp');
  try {
    const info = await sharp(input)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(output);
    console.log(`✓ ${file} → ${(info.size / 1024).toFixed(0)} KB`);
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}
console.log('Done!');
