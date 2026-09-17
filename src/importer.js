import DOMPurify from 'dompurify';
import JSZip from 'jszip';
import { sizes } from './data.js';

export function sanitize(html) {
 const clean=DOMPurify.sanitize(html,{WHOLE_DOCUMENT:true,ADD_TAGS:['style','link'],ADD_ATTR:['target'],FORBID_TAGS:['script','iframe','object','embed','form','input','button','base'],FORBID_ATTR:['srcdoc']});
 const doc=new DOMParser().parseFromString(clean,'text/html');
 doc.querySelectorAll('meta[http-equiv]').forEach(n=>n.remove());
 doc.querySelectorAll('a').forEach(n=>{n.setAttribute('target','_blank');n.setAttribute('rel','noopener noreferrer');});
 return '<!doctype html>'+doc.documentElement.outerHTML;
}
const mime={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',svg:'image/svg+xml',woff:'font/woff',woff2:'font/woff2',ttf:'font/ttf'};
const resolvePath=(base,path)=>new URL(path,'https://zip.local/'+base).pathname.slice(1);
async function inlineZip(zip, file) {
 let html=await file.async('string');
 const doc=new DOMParser().parseFromString(html,'text/html');
 let total=0;
 const data=async (path,base=file.name)=>{
   if(!path||/^(data:|https?:|#|blob:)/i.test(path))return path;
   const entry=zip.file(resolvePath(base,path));if(!entry)throw new Error(`素材が見つかりません: ${path}`);
   const bytes=await entry.async('uint8array');total+=bytes.length;if(total>50*1024*1024)throw new Error('展開後の素材は50MB以下にしてください。');
   return `data:${mime[path.split('.').pop().toLowerCase()]||'application/octet-stream'};base64,${await entry.async('base64')}`;
 };
 const css=async (value,base)=>{const matches=[...value.matchAll(/url\(\s*['"]?([^'"\)]+)['"]?\s*\)/g)];for(const m of matches)value=value.replace(m[0],`url("${await data(m[1].trim(),base)}")`);return value;};
 for(const link of doc.querySelectorAll('link[rel="stylesheet"]')){
   const href=link.getAttribute('href');if(/^https?:/i.test(href))continue;
   const path=resolvePath(file.name,href);const entry=zip.file(path);if(!entry)throw new Error(`CSSが見つかりません: ${href}`);
   const style=doc.createElement('style');style.textContent=await css(await entry.async('string'),path);link.replaceWith(style);
 }
 for(const node of doc.querySelectorAll('img[src],source[src]'))node.setAttribute('src',await data(node.getAttribute('src')));
 for(const node of doc.querySelectorAll('[srcset]'))node.removeAttribute('srcset');
 for(const node of doc.querySelectorAll('style'))node.textContent=await css(node.textContent,file.name);
 for(const node of doc.querySelectorAll('[style]'))node.setAttribute('style',await css(node.getAttribute('style'),file.name));
 return doc.documentElement.outerHTML;
}
export function splitSlides(html,format) {
 const doc=new DOMParser().parseFromString(sanitize(html),'text/html');
 let nodes=[...doc.querySelectorAll('[data-slide],.slide')].filter(n=>!n.parentElement?.closest('[data-slide],.slide'));
 if(!nodes.length)nodes=[...doc.querySelectorAll('.slides > section')];
 if(!nodes.length)nodes=[doc.body];
 if(nodes.length>100)throw new Error('スライドは1資料につき100ページまでです。');
 return nodes.map((n,i)=>{
   const chosen=sizes[n.dataset.format]?n.dataset.format:format;
   const [w,h]=sizes[chosen];
   const content=n===doc.body?n.innerHTML:n.outerHTML;
   const head=doc.head.innerHTML;
   const reset=`<style>html,body{margin:0!important;width:${w}px!important;height:${h}px!important;min-height:0!important;overflow:hidden!important}body{background:#fff}body>.slide,body>[data-slide],body>section{display:block!important;visibility:visible!important;opacity:1!important;transform:none!important;position:relative!important;left:0!important;top:0!important;margin:0!important;width:${w}px!important;height:${h}px!important;box-sizing:border-box!important;overflow:hidden!important}*,*::before,*::after{animation:none!important;transition:none!important}</style>`;
   return {name:n.dataset.title||n.querySelector('h1,h2,h3')?.textContent?.trim()||`スライド ${i+1}`,format:chosen,html:`<!doctype html><html lang="ja"><head>${head}${reset}</head><body>${content}</body></html>`};
 });
}
export async function importFile(file,format) {
 if(file.size>25*1024*1024)throw new Error('ファイルは25MB以下にしてください。');
 if(/\.zip$/i.test(file.name)) {
   const zip=await JSZip.loadAsync(file);
   const manifest=zip.file('deck.json');
   if(manifest){const data=JSON.parse(await manifest.async('string'));if(!Array.isArray(data.slides)||!data.slides.length||data.slides.length>100)throw new Error('資料データの形式が正しくありません。');return {metadata:data,slides:data.slides.map(s=>({...s,format:sizes[s.format]?s.format:format,html:sanitize(s.html)}))};}
   const entries=Object.values(zip.files).filter(f=>!f.dir&&/\.html?$/i.test(f.name)&&!f.name.includes('__MACOSX')).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
   if(!entries.length)throw new Error('ZIP内にHTMLファイルが見つかりません。');
   const index=entries.find(f=>/(^|\/)index\.html$/i.test(f.name));
   let slides=[];
   for(const f of (index?[index]:entries))slides.push(...splitSlides(await inlineZip(zip,f),format));
   if(slides.length>100)throw new Error('スライドは100ページまでです。');
   return {slides};
 }
 if(!/\.html?$/i.test(file.name))throw new Error('HTMLまたはZIPファイルを選択してください。');
 return {slides:splitSlides(await file.text(),format)};
}
export function download(blob,name) {const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
export async function exportDeck(deck) {
 const zip=new JSZip();
 const clean={...deck,builtin:false,initial:0};
 zip.file('deck.json',JSON.stringify(clean,null,2));
 deck.slides.forEach((s,i)=>zip.file(`slides/${String(i+1).padStart(3,'0')}.html`,s.html));
 zip.file('README.txt','OneBe SLIDE 資料パッケージ\nこのZIPを登録・編集画面に読み込むと資料を復元できます。\nWeb公開: deck.jsonをpublic/decks/index.jsonの配列に追加して再ビルドしてください。\n画像はHTML内のdata URLで同梱することを推奨します。\n');
 download(await zip.generateAsync({type:'blob'}),`${deck.title}.zip`);
}
