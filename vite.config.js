import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import crypto from 'node:crypto'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'cham-viet-offline',
    generateBundle(_, bundle) {
      const files = Object.keys(bundle);
      const hash = crypto.createHash('sha256').update(files.join('|') + fs.readFileSync('scripts/sw-template.js')).digest('hex').slice(0,12);
      const precache = [...new Set(['/index.html','/manifest.webmanifest','/icon.svg','/icon-192.png','/icon-512.png','/range.js','/data/vietnam.geojson','/audio/manifest.json', ...files.map(f=>'/'+f)])];
      const source = fs.readFileSync('scripts/sw-template.js','utf8').replace('__VERSION__',`cham-viet-shell-${hash}`).replace('__PRECACHE__',JSON.stringify(precache));
      this.emitFile({type:'asset', fileName:'sw.js',source});
    }
  }],
  server: {host:'127.0.0.1'},
})
