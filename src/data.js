export const asset = name => new URL(`${import.meta.env.BASE_URL}${name}`, location.href).href;
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const sizes = { '16:9': [1280, 720], 'A4縦': [794, 1123], 'A4横': [1123, 794] };

const sections = [
 ['私たちについて','About us','人とテクノロジーで、持続可能な社会のあたらしい当たり前をつくる。'],
 ['私たちのミッション','Our mission','一人ひとりの可能性を、社会の可能性へ。'],
 ['大切にしていること','Our values','対話する。試してみる。ともにつくる。'],
 ['事業領域','Our business','デジタルの力で、事業と暮らしの課題を解決する。'],
 ['チームの働き方','Our culture','得意を持ち寄り、チームとして前に進む。'],
 ['プロジェクトの進め方','Our process','発見・設計・実装・改善を、一つのチームで。'],
 ['サービスデザイン','Service design','利用する人の視点から、価値ある体験を設計する。'],
 ['テクノロジー','Technology','新しい技術を、使い続けられる仕組みに。'],
 ['コミュニケーション','Communication','小さな気づきを共有して、次の一歩につなげる。'],
 ['人材と成長','People & growth','学びをひらき、お互いの成長を後押しする。'],
 ['NEXORAについて','Company profile','人とテクノロジーで、もっとよい未来をつくる。'],
 ['未来をつくる、チームの力。','Company deck','人とテクノロジーで、持続可能な社会のあたらしい当たり前をつくる。'],
 ['私たちのビジョン','Our vision','すべての挑戦が、社会の可能性になる。'],
 ['事業領域','Our business','デジタル変革・サービス開発・共創支援。'],
 ['サステナビリティへの取り組み','Sustainability','未来のために、今日できることから。'],
 ['共創のかたち','Co-creation','異なる専門性が、新しいアイデアを生む。'],
 ['課題を見つける','Discovery','まず、相手の話をよく聞くことから始める。'],
 ['仮説をつくる','Hypothesis','小さく試せる問いを立てる。'],
 ['体験を設計する','Experience','複雑なものを、わかりやすく。'],
 ['プロトタイプ','Prototype','アイデアをかたちにして、確かめる。'],
 ['品質への取り組み','Quality','使いやすさと信頼性を、日々磨き続ける。'],
 ['プロジェクト事例','Case study','相談から運用まで、一緒に考える。'],
 ['チームの役割','Team roles','専門性をつなげて、一つの成果へ。'],
 ['デザインと開発','Design & engineering','つくる人の間にも、なめらかな体験を。'],
 ['ナレッジを共有する','Knowledge','学んだことを、次のチームの力に。'],
 ['オンボーディング','Onboarding','安心して一歩を踏み出せる環境を。'],
 ['学びの機会','Learning','日々の実践を、成長のきっかけに。'],
 ['フィードバック','Feedback','よりよくするために、率直に話し合う。'],
 ['柔軟な働き方','Work style','それぞれの力を発揮できる働き方。'],
 ['日々の対話','Daily dialogue','小さな相談が、大きな前進につながる。'],
 ['これからの挑戦','Next challenge','まだない価値を、チームでつくる。'],
 ['パートナーシップ','Partnership','一緒につくる仲間と、可能性を広げる。'],
 ['社会とのつながり','Community','地域と社会の声を、事業に活かす。'],
 ['私たちが目指す未来','Our future','誰もが自分らしく、挑戦できる社会。'],
 ['採用について','Careers','未来を一緒につくる仲間へ。'],
 ['選考の流れ','Meet the team','お互いを知る対話から始めましょう。'],
 ['よくある質問','Questions','働き方やチームについて、お話しします。'],
 ['ありがとうございました','Thank you','A brighter tomorrow, together.'],
];

export function slideDocument(body, format = '16:9', style = '') {
 const [w,h] = sizes[format] || sizes['16:9'];
 return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#fff}body{font-family:Arial,"Noto Sans JP","Yu Gothic",sans-serif;color:#10203c}.slide{width:100%;height:100%;position:relative;padding:64px 68px;background:white;overflow:hidden}.brand{font-weight:800;font-size:26px;letter-spacing:4px}.brand b{color:#087bdd;font-size:40px;vertical-align:middle;margin-right:12px}.eyebrow{font-size:16px;letter-spacing:4px;color:#73819b;margin-top:32px;text-transform:uppercase}h1{font-size:${format==='A4縦'?58:68}px;line-height:1.38;max-width:850px;letter-spacing:-2px;margin:75px 0 30px}p{font-size:25px;color:#6c7890;line-height:1.8;max-width:800px}.accent{width:62px;height:6px;background:#17babb;margin-top:48px}.foot{position:absolute;bottom:38px;left:68px;right:68px;display:flex;justify-content:space-between;letter-spacing:3px;font-size:13px;color:#7f8aa0}.shape{position:absolute;width:520px;height:520px;background:linear-gradient(145deg,#e7f7f9,#36bcbe);right:-220px;top:100px;transform:rotate(35deg);opacity:.5}.blocks{display:flex;gap:24px;margin-top:55px}.block{padding:30px;background:#f0f7fa;border-radius:10px;flex:1;font-size:23px;line-height:1.8}.number{font-size:42px;color:#13a7b0}.cover{padding:0;background-image:url('${asset('reference.png')}');background-size:180.952% 185.60%;background-position:22.594% 26.037%;background-repeat:no-repeat}${style}</style></head><body>${body}</body></html>`;
}
export function sampleSlide(index, format='16:9') {
 if(index === 11 && format==='16:9') return slideDocument('<section class="slide cover" aria-label="未来をつくる、チームの力。NEXORA会社紹介資料"></section>');
 const [title,sub,desc] = sections[index % sections.length];
 const cards = index===13?'<div class="blocks"><div class="block"><span class="number">01</span><br>デジタル変革</div><div class="block"><span class="number">02</span><br>サービス開発</div><div class="block"><span class="number">03</span><br>共創支援</div></div>':'';
 return slideDocument(`<section class="slide"><div class="shape"></div><div class="brand"><b>◧</b>NEXORA</div><div class="eyebrow">${sub}</div><h1>${title}</h1><p>${desc}</p>${cards}<div class="accent"></div><div class="foot"><span>NEXORA · SAMPLE PRESENTATION</span><span>${String(index+1).padStart(2,'0')}</span></div></section>`, format);
}
const mainSlides = sections.map((s,i)=>({name:s[0],format:i===14?'A4縦':'16:9',html:sampleSlide(i,i===14?'A4縦':'16:9'),crop: i>=10&&i<=14 ? i-10:null}));
export const sampleDecks = [
 {id:'company-2026',title:'NEXORA 会社紹介資料 2026',description:'テクノロジーで、もっとよい未来をつくる。NEXORAのビジョン・事業・カルチャーをまとめた会社紹介資料です。',about:'NEXORAのミッション・ビジョン・事業戦略・カルチャーをまとめた会社紹介資料です。HTML / CSSで作成されており、ブラウザ上で快適にご覧いただけます。',author:'NEXORA株式会社',date:'2026-09-18',category:'会社紹介',tags:['会社紹介','採用','ビジョン','サステナビリティ','2026'],slides:mainSlides,format:'16:9',allowPdf:true,builtin:true,initial:11},
 {id:'team-guide',title:'チームの働き方ガイド',description:'対話と共有を大切にする、チームのためのハンドブック。',author:'OneBe',date:'2026-09-17',category:'社内ナレッジ',tags:['働き方','ガイド'],slides:[4,8,24,25,27,29].map(i=>({name:sections[i][0],format:'A4縦',html:sampleSlide(i,'A4縦')})),format:'A4縦',allowPdf:true,builtin:true,initial:0},
 {id:'service-design',title:'サービスデザインの進め方',description:'発見から改善まで。プロジェクトで共有したい基本の考え方。',author:'OneBe',date:'2026-09-16',category:'サービス',tags:['デザイン','プロジェクト'],slides:[6,16,17,18,19,20,21,23].map(i=>({name:sections[i][0],format:'16:9',html:sampleSlide(i)})),format:'16:9',allowPdf:true,builtin:true,initial:0},
 {id:'project-guide',title:'プロジェクト・スタートガイド',description:'役割、進め方、コミュニケーションを確認するキックオフ資料。',author:'OneBe',date:'2026-09-15',category:'社内ナレッジ',tags:['プロジェクト','ガイド'],slides:[5,16,22,23,24,29].map(i=>({name:sections[i][0],format:'A4横',html:sampleSlide(i,'A4横')})),format:'A4横',allowPdf:true,builtin:true,initial:0},
];

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
 let published=[];try{const r=await fetch(asset('decks/index.json'));if(r.ok)published=(await r.json()).map(d=>({...d,published:true}));}catch{}
 let stored=[];try{stored=await storedDecks();}catch{}
 const map=new Map([...sampleDecks,...published,...stored].map(d=>[d.id,d]));return [...map.values()];
}
