import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join, basename, extname } from 'path';

const FOLDER = './public/media';

const files = readdirSync(FOLDER).filter(f =>
  ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase())
);

for (const file of files) {
  const inputPath = join(FOLDER, file);
  const outputName = basename(file, extname(file)) + '.webp';
  const outputPath = join(FOLDER, outputName);

  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath);

  console.log(`✓ Converted: ${file} → ${outputName}`);
}

console.log('All done.');