import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public/bangladesh');
const topics = [
  'Bangladesh landscape', 'Bangladesh village landscape', 'Sylhet Bangladesh tea garden',
  'Bandarban Bangladesh hills', 'Cox Bazar Bangladesh beach', 'Sundarbans Bangladesh',
  'Bangladesh river boat', 'Bangladesh rice field', 'Dhaka Bangladesh architecture',
  'Bangladesh sunset landscape', 'Rangamati Bangladesh lake', 'Bangladesh waterfall',
];
const headers = { 'User-Agent': 'NexoraBangladeshPhotoImporter/1.0 (personal portfolio image import)' };
const pause = ms => new Promise(r => setTimeout(r, ms));
async function request(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(25000) });
      if (response.ok) return response;
      if (response.status !== 429 && response.status < 500) throw new Error(`HTTP ${response.status}`);
      await pause(1500 * (attempt + 1));
    } catch (error) {
      if (attempt === 2) throw error;
      await pause(1500 * (attempt + 1));
    }
  }
  throw new Error('Download retries exhausted');
}
const plain = text => String(text || '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&');
await mkdir(output, { recursive: true });
let photos = [];
try { photos = JSON.parse(await readFile(resolve(output, 'credits.json'), 'utf8')); } catch {}
const seen = new Set(photos.map(p => p.pageId));
async function saveManifest() {
  await writeFile(resolve(output, 'credits.json'), JSON.stringify(photos, null, 2));
  await writeFile(resolve(root, 'src/data/bangladesh-photos.ts'),
    `// Downloaded by scripts/import-bangladesh-photos.mjs\nexport const bangladeshPhotos: string[] = ${JSON.stringify(photos.map(p => p.path), null, 2)};\n`);
}
for (const topic of topics) {
  if (photos.length >= 80) break;
  console.log(`Searching: ${topic}`);
  try {
    const url = new URL('https://commons.wikimedia.org/w/api.php');
    url.search = new URLSearchParams({ action: 'query', format: 'json', generator: 'search',
      gsrsearch: `${topic} filetype:bitmap`, gsrnamespace: '6', gsrlimit: '40',
      prop: 'imageinfo', iiprop: 'url|extmetadata|mime|size', iiurlwidth: '480' });
    const data = await (await request(url)).json();
    if (data.error) throw new Error(data.error.info);
    const pages = Object.values(data.query?.pages || {}).sort((a,b) => (a.index || 0) - (b.index || 0));
    let count = 0;
    for (const page of pages) {
      if (photos.length >= 80 || count >= 8) break;
      if (seen.has(page.pageid)) continue;
      const info = page.imageinfo?.[0];
      if (!info || !['image/jpeg', 'image/png'].includes(info.mime) || info.width < 400 || info.height < 250) continue;
      const meta = info.extmetadata || {};
      const license = plain(meta.LicenseShortName?.value);
      if (!/CC BY|CC0|Public domain/i.test(license)) continue;
      try {
        const imageResponse = await request(info.thumburl || info.url);
        if (!imageResponse.headers.get('content-type')?.startsWith('image/')) throw new Error('Response is not an image');
        const bytes = Buffer.from(await imageResponse.arrayBuffer());
        if (bytes.length > 3_000_000) continue;
        const ext = info.mime === 'image/png' ? 'png' : 'jpg';
        const name = `bd-${String(photos.length + 1).padStart(3, '0')}.${ext}`;
        await writeFile(resolve(output, name), bytes);
        photos.push({ pageId: page.pageid, title: page.title, topic,
          path: `/bangladesh/${name}`, source: info.descriptionurl, author: plain(meta.Artist?.value),
          license, licenseUrl: meta.LicenseUrl?.value || '', original: info.url,
          note: 'Displayed as a cropped thumbnail in the cursor trail; source image is otherwise unmodified.' });
        seen.add(page.pageid); count++;
        await saveManifest();
        console.log(`${photos.length}/80 saved: ${page.title}`);
        await pause(300);
      } catch (error) { console.warn(`Skipping ${page.title}: ${error.message}`); }
    }
  } catch (error) { console.warn(`Search failed: ${error.message}`); }
}
await saveManifest();
console.log(`\nSaved ${photos.length} photos. Credits: public/bangladesh/credits.json`);
if (photos.length < 80) {
  console.error('Collection is incomplete. Run the same command again to retry; saved photos are retained.');
  process.exitCode = 1;
} else console.log('Complete! Start the website with npm run dev.');
