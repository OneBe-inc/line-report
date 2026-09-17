import { sizes } from './data.js';
export async function createPdf(deck,onProgress,signal) {
 const [{default:html2canvas},{jsPDF}]=await Promise.all([import('html2canvas'),import('jspdf')]);
 let pdf;
 const frame=document.createElement('iframe');frame.className='pdf-frame';frame.setAttribute('sandbox','allow-same-origin');frame.setAttribute('aria-hidden','true');document.body.append(frame);
 try {
   for(let i=0;i<deck.slides.length;i++){
     if(signal.aborted)throw new DOMException('Cancelled','AbortError');
     onProgress(i,deck.slides.length);
     const slide=deck.slides[i];const [w,h]=sizes[slide.format]||sizes['16:9'];frame.style.width=`${w}px`;frame.style.height=`${h}px`;
     await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('スライドの読み込みがタイムアウトしました。')),15000);frame.onload=()=>{clearTimeout(timer);resolve();};frame.srcdoc=slide.html;});
     const doc=frame.contentDocument;await doc.fonts.ready;
     await Promise.all([...doc.images].map(img=>img.decode().catch(()=>{})));
     const canvas=await html2canvas(doc.body,{width:w,height:h,windowWidth:w,windowHeight:h,scale:1.4,useCORS:true,backgroundColor:'#ffffff',logging:false});
     const dims=slide.format==='A4縦'?[210,297]:slide.format==='A4横'?[297,210]:[338.67,190.5];
     const orientation=dims[0]>dims[1]?'landscape':'portrait';
     if(!pdf)pdf=new jsPDF({orientation,unit:'mm',format:dims,compress:true});else pdf.addPage(dims,orientation);
     pdf.addImage(canvas.toDataURL('image/jpeg',.94),'JPEG',0,0,...dims,undefined,'FAST');canvas.width=1;canvas.height=1;
   }
   if(signal.aborted)throw new DOMException('Cancelled','AbortError');
   onProgress(deck.slides.length,deck.slides.length);pdf.setProperties({title:deck.title,creator:'OneBe SLIDE'});pdf.save(`${deck.title}.pdf`);
 } finally {frame.remove();}
}
