export const asset = name => new URL(`${import.meta.env.BASE_URL}${name}`, location.href).href;
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const sizes = { '16:9': [1280, 720], 'A4縦': [794, 1123], 'A4横': [1123, 794] };

// Downloadable starter only; no presentation is preloaded in the library.
export function templateSlide(format = '16:9') {
 const [w,h] = sizes[format] || sizes['16:9'];
 return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>スライドタイトル</title><style>*{box-sizing:border-box}html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#fff}body{font-family:Arial,"Noto Sans JP","Yu Gothic",sans-serif;color:#10203c}.slide{width:100%;height:100%;padding:64px 68px;position:relative}h1{font-size:60px;margin:100px 0 30px}p{font-size:25px;color:#6c7890;line-height:1.8}.brand{font-size:26px;font-weight:800;letter-spacing:2px}.accent{width:62px;height:6px;background:#17babb;margin-top:48px}</style></head><body><section class="slide" data-title="スライドタイトル" data-format="${format}"><div class="brand">OneBe SLIDE</div><h1>スライドタイトル</h1><p>ここに本文を入力してください。</p><div class="accent"></div></section></body></html>`;
}

let database;
async function db() {
 if(database) return database;
 database=await new Promise((resolve,reject)=>{const req=indexedDB.open('onebe-slide',1);req.onupgradeneeded=()=>req.result.createObjectStore('decks',{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
 return database;
}
export async function storedDecks() { const d=await db(); return new Promise((resolve,reject)=>{const r=d.transaction('decks').objectStore('decks').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}); }
export async function saveDeck(deck) {const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('decks','readwrite');tx.objectStore('decks').put(deck);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
export async function deleteDeck(id) {const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('decks','readwrite');tx.objectStore('decks').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
export async function allDecks() {
 let published=[];try{const r=await fetch(asset('decks/index.json'));if(r.ok){published=await r.json();await Promise.all(published.flatMap(deck=>deck.slides.map(async slide=>{if(!slide.html&&slide.htmlPath){const page=await fetch(asset(slide.htmlPath));if(page.ok)slide.html=await page.text();}})));published=published.map(d=>({...d,published:true}));}}catch{}
 let stored=[];try{stored=await storedDecks();}catch{}
 const map=new Map([...published,...stored].map(d=>[d.id,d]));return [...map.values()];
}
