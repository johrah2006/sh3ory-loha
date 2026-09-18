const MODEL = "@cf/black-forest-labs/flux-2-dev";

const PAGE = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>شعوري.. لوحة 🎨</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;background:linear-gradient(135deg,#f6fbf8,#eaf5ef);color:#17352b}.wrap{max-width:940px;margin:auto;padding:18px 14px 42px}.hero{background:linear-gradient(135deg,#075b43,#11815f);color:#fff;border-radius:30px;padding:30px 18px;text-align:center;box-shadow:0 18px 45px #075b4322}.badge{display:inline-block;background:#ffffff20;border:1px solid #ffffff55;padding:8px 16px;border-radius:999px}.hero h1{font-size:35px;margin:13px 0 7px}.sub{font-size:17px;line-height:1.9}.card{background:#fff;border:1px solid #dce9e2;border-radius:24px;padding:20px;margin-top:18px;box-shadow:0 12px 35px #17352b10}label{display:block;font-weight:700;margin:9px 0}input,textarea{width:100%;border:1px solid #cadbd3;border-radius:16px;padding:14px;font:inherit;background:#fbfdfc}textarea{min-height:135px;resize:vertical}.chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 18px}.chip{border:1px solid #c9dcd3;background:#f4f9f6;border-radius:999px;padding:9px 14px;cursor:pointer;font:inherit}.chip.on{background:#0b6b4f;color:#fff;border-color:#0b6b4f}.primary{width:100%;border:0;border-radius:16px;padding:15px;background:#0b6b4f;color:#fff;font:inherit;font-size:18px;font-weight:700;cursor:pointer}.primary:disabled{opacity:.55;cursor:wait}.status{text-align:center;padding:12px;line-height:1.9;display:none}.result canvas{width:100%;display:block;border-radius:20px;background:#edf5f1}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.actions button{border:0;border-radius:15px;padding:13px 18px;background:#edf5f1;color:#0b6b4f;font:inherit;font-weight:700;cursor:pointer}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.gitem{border:1px solid #dfeae4;border-radius:18px;padding:8px;background:#fff}.gitem img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:13px}.gname{font-size:13px;margin:7px 3px;color:#527065;line-height:1.6}.gactions{display:flex;justify-content:flex-end;margin-top:7px}.deleteBtn{border:0;border-radius:10px;padding:7px 10px;background:#fff0f0;color:#a52a2a;font:inherit;font-weight:700;cursor:pointer}.empty{text-align:center;color:#71877e;padding:25px}footer{text-align:center;color:#71877e;font-size:13px;line-height:1.9;margin-top:22px}
</style>
</head>
<body>
<div class="wrap">
<section class="hero">
<div class="badge">🇸🇦 اليوم الوطني السعودي 96 · 2026</div>
<h1>شعوري.. لوحة 🎨</h1>
<div class="sub">وطن بعيون الذكاء الاصطناعي 🇸🇦<br><b>عزّنا بطبعنا</b><br><small>اكتبي شعورك… والذكاء الاصطناعي يحوله إلى مشهد وطني أصلي</small></div>
</section>

<section class="card">
<label>اسم المشاركة / المعلمة</label>
<input id="name" placeholder="اكتبي الاسم">

<label>اختاري الشعور الأقرب</label>
<div id="chips" class="chips"></div>

<label>اكتبي شعورك بالتفصيل</label>
<textarea id="feelings" placeholder="مثال: أشعر بفخر كبير بانتمائي للسعودية، وأرى وطننا يمضي نحو مستقبل مشرق بالعلم والابتكار..."></textarea>

<button id="go" class="primary">🎨 ارسم شعوري</button>
<div id="status" class="status"></div>
</section>

<section id="result" class="card" style="display:none">
<h2>لوحتك التعبيرية ✨</h2>
<canvas id="canvas"></canvas>
<div class="actions">
<button id="save">💾 حفظ في المعرض</button>
<button id="download">⬇️ تحميل اللوحة</button>
</div>
</section>

<section class="card">
<h2>🖼️ معرض اللوحات المشترك · اليوم الوطني 96</h2>
<div id="gallery" class="gallery"><div class="empty">جاري تحميل المعرض...</div></div>
</section>

<footer>المدرسة المتوسطة السابعة والأربعون · إدارة تعليم المدينة المنورة<br>إعداد وتنفيذ: جوهره الجابري</footer>
</div>

<script>
const emotions=["فخر","انتماء","أمل","طموح","امتنان","مستقبل","اعتزاز","فرح"];
const box=document.getElementById("chips");
emotions.forEach(v=>{const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=v;b.onclick=()=>b.classList.toggle("on");b.dataset.v=v;box.appendChild(b)});
let currentImage="",status=document.getElementById("status");
function msg(t){status.textContent=t;status.style.display="block"}
function esc(s){return String(s||"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function drawGallery(items){
 const g=document.getElementById("gallery");
 if(!items.length){g.innerHTML='<div class="empty">لم تُحفظ لوحات بعد 🌿</div>';return}
 g.innerHTML=items.map(x=>'<div class="gitem"><img src="'+x.image+'" alt="لوحة وطنية"><div class="gname"><b>'+esc(x.name||"مشاركة")+'</b></div><div class="gactions"><button class="deleteBtn" data-key="'+esc(x.key||"")+'">🗑️ مسح</button></div></div>').join("");
 g.querySelectorAll(".deleteBtn").forEach(b=>b.onclick=async()=>{if(!b.dataset.key||!confirm("مسح اللوحة؟"))return;b.disabled=true;try{const r=await fetch("/api/gallery?key="+encodeURIComponent(b.dataset.key),{method:"DELETE"});if(!r.ok)throw Error("تعذر المسح");await loadGallery()}catch(e){msg("⚠️ "+e.message)}});
}
async function loadGallery(){try{const r=await fetch("/api/gallery",{cache:"no-store"});const d=await r.json();drawGallery(d.items||[])}catch(e){drawGallery([])}}
loadGallery();

function addBrand(dataUrl){
 return new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>{
   const c=document.getElementById("canvas"),max=1200,s=Math.min(1,max/img.width);
   c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);
   const ctx=c.getContext("2d");ctx.drawImage(img,0,0,c.width,c.height);
   const w=c.width,h=c.height,bh=Math.max(132,Math.round(h*.19));
   const grad=ctx.createLinearGradient(0,h-bh,w,h);grad.addColorStop(0,"rgba(0,88,64,.94)");grad.addColorStop(1,"rgba(0,42,31,.99)");
   ctx.fillStyle=grad;ctx.fillRect(0,h-bh,w,bh);ctx.direction="rtl";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#fff";
   ctx.font="700 "+Math.max(28,Math.round(w/25))+"px Tahoma,Arial,sans-serif";ctx.fillText("اليوم الوطني السعودي 96",w/2,h-bh*.62);
   ctx.font="600 "+Math.max(21,Math.round(w/40))+"px Tahoma,Arial,sans-serif";ctx.fillText("عزّنا بطبعنا",w/2,h-bh*.27);
   ctx.font="500 "+Math.max(13,Math.round(w/72))+"px Tahoma,Arial,sans-serif";ctx.fillText("شعوري.. لوحة · المدرسة المتوسطة السابعة والأربعون",w/2,h-10);
   currentImage=c.toDataURL("image/jpeg",.93);resolve();
  };img.onerror=reject;img.src=dataUrl;
 });
}

async function saveGallery(){
 if(!currentImage)return;
 const item={image:currentImage,name:document.getElementById("name").value.trim()||"مشاركة",createdAt:Date.now()};
 const r=await fetch("/api/gallery",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(item)});
 const d=await r.json();if(!r.ok||!d.ok)throw Error(d.error||"تعذر حفظ اللوحة");
 await loadGallery();
}

document.getElementById("go").onclick=async()=>{
 const feelings=document.getElementById("feelings").value.trim();
 const name=document.getElementById("name").value.trim();
 const chips=[...document.querySelectorAll(".chip.on")].map(x=>x.dataset.v);
 if(!feelings){msg("اكتبي شعورك أولًا 🌷");return}
 const btn=document.getElementById("go");btn.disabled=true;
 msg("🎨 يجري فهم شعورك وبناء لوحة خاصة باليوم الوطني 96…");
 try{
  const r=await fetch("/api/generate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({feelings,name,chips:chips.join("، ")})});
  const d=await r.json().catch(()=>({error:"لم تصل استجابة من خدمة الصور"}));
  if(!r.ok||!d.image)throw Error(d.error||"تعذر إنشاء اللوحة");
  await addBrand(d.image);
  document.getElementById("result").style.display="block";
  document.getElementById("result").scrollIntoView({behavior:"smooth"});
  await saveGallery();
  msg("✨ اكتملت اللوحة وحُفظت في المعرض المشترك.");
 }catch(e){
  let t=String(e.message||e);
  if(/daily free allocation|neurons|3036|429|quota|Account limited/i.test(t))t="انتهت حصة توليد الصور المجانية في Cloudflare حاليًا. بعد تجدد الحصة يمكنك الضغط مرة واحدة على الزر.";
  msg("⚠️ "+t);
 }finally{btn.disabled=false}
};

document.getElementById("save").onclick=async()=>{try{await saveGallery();msg("💚 تم حفظ اللوحة.");}catch(e){msg("⚠️ "+e.message)}};
document.getElementById("download").onclick=()=>{if(!currentImage)return;const a=document.createElement("a");a.href=currentImage;a.download="شعوري-لوحة-اليوم-الوطني-96.jpg";a.click()};
</script>
</body>
</html>`;

const RULES = {
 "فخر": {
   value:"الشجاعة والاعتزاز والإنجاز",
   scene:"A confident young Saudi woman or young Saudi man standing in a powerful foreground position with a Saudi flag, modern Riyadh architecture and a recognizable Saudi urban skyline behind them. Golden light and a dignified atmosphere communicate pride, courage and achievement."
 },
 "انتماء":{
   value:"الانتماء والأصالة",
   scene:"A heartfelt Saudi homeland scene: a Saudi person in authentic Saudi clothing looking across a beautiful Saudi landscape toward a modern Saudi city, Saudi flag naturally present, warm light, heritage architecture and subtle traditional textile patterns communicating belonging and roots."
 },
 "أمل":{
   value:"الأمل والرؤية",
   scene:"A hopeful Saudi scene at sunrise: a young Saudi student looking toward a bright horizon over a modern sustainable Saudi city, green landscape, Saudi flag and subtle heritage architecture, communicating hope and a promising future."
 },
 "طموح":{
   value:"الهمة والطموح",
   scene:"Young Saudi innovators in a premium modern Saudi technology environment, with advanced architecture, sustainable greenery and Riyadh skyline, Saudi flag naturally integrated, communicating ambition, determination and progress."
 },
 "امتنان":{
   value:"الجود والكرم",
   scene:"An elegant authentic Saudi hospitality scene: a welcoming Saudi family member or host, traditional Saudi coffee service, refined heritage interior, woven Saudi patterns, warm light and a subtle Saudi flag, communicating generosity, gratitude and hospitality."
 },
 "مستقبل":{
   value:"الرؤية والمستقبل",
   scene:"A sophisticated Saudi future scene: young Saudi talent, clean futuristic architecture, sustainable green spaces, advanced technology represented without screens containing text, modern Riyadh skyline and Saudi flag, communicating vision and progress."
 },
 "اعتزاز":{
   value:"الأصالة والعزة",
   scene:"A refined Saudi heritage scene with authentic Najdi architecture, traditional Saudi clothing, elegant geometric textile motifs, palm trees and Saudi flag, blended with one contemporary Saudi element to show continuity and cultural pride."
 },
 "فرح":{
   value:"الفرح الوطني",
   scene:"A tasteful Saudi National Day celebration in an elegant public space with Saudi people, Saudi flags, refined green illumination and subtle celebratory lights. Joyful, dignified and clearly national, not a generic festival."
 }
};

function responseError(message,status=500){return Response.json({error:message},{status})}

async function generate(env,request){
 const body=await request.json();
 const feelings=String(body.feelings||"").trim();
 const chips=String(body.chips||"").trim();
 if(!feelings)return responseError("اكتبي شعورك أولًا.",400);

 const selected=chips.split("،").map(x=>x.trim()).filter(Boolean);
 const matches=Object.keys(RULES).filter(k=>selected.includes(k)||feelings.includes(k));
 const primary=matches[0]||"فخر";
 const secondary=matches[1]||"مستقبل";
 const rule=RULES[primary];

 const promptObject={
  scene:`Saudi National Day 96, Saudi Arabia, 2026. ${rule.scene}`,
  story:`The participant wrote: ${feelings}. The image must visually communicate this exact feeling, not merely show generic Saudi symbols.`,
  subjects:[
   {type:"primary subject",description:rule.scene,pose:"natural, believable, emotionally expressive"}
  ],
  identity:{
   event:"Saudi National Day 96",
   year:"2026",
   official_slogan:"عزّنا بطبعنا",
   values:"الشجاعة، الرؤية، الأصالة، الهمة، الجود، الكرم",
   visual_language:"geometric line work and refined patterns inspired by traditional Saudi weaving; Saudi green and white; authentic Saudi cultural details"
  },
  composition:"One coherent premium exhibition poster image. Strong focal point, cinematic depth, restrained Saudi green palette, authentic Saudi setting. The participant feeling is the main visual subject.",
  style:"photorealistic premium editorial photography, cinematic lighting, professional national campaign photography, realistic people and architecture, high detail, elegant and emotionally powerful",
  negative_prompt:"cartoon, anime, illustration, clipart, collage, generic stock photo, generic mosque poster, random family portrait, tourist advertisement, fantasy Saudi city, incorrect flag, distorted people, deformed hands, excessive symbols, brown Founding Day branding, National Day 95, old Saudi National Day identity, text, Arabic letters, English letters, numbers, logo, watermark, signs, captions, gibberish"
 };

 const form=new FormData();
 form.append("prompt",JSON.stringify(promptObject));
 form.append("steps","25");
 form.append("width","1024");
 form.append("height","1024");
 form.append("guidance","4.0");

 const req=new Request("http://dummy",{method:"POST",body:form});
 const result=await env.AI.run(MODEL,{
  multipart:{
   body:req.body,
   contentType:req.headers.get("content-type")
  }
 });
 if(!result?.image)throw Error("خدمة توليد الصور لم تُرجع صورة.");
 return Response.json({image:"data:image/jpeg;base64,"+result.image});
}

async function getGallery(env){
 if(!env.GALLERY)return Response.json({ok:false,items:[],error:"GALLERY_NOT_BOUND"});
 const list=await env.GALLERY.list({prefix:"art:",limit:100});
 const items=[];
 for(const k of list.keys||[]){
  const raw=await env.GALLERY.get(k.name,"text");
  if(!raw)continue;
  try{const x=JSON.parse(raw);if(x?.image?.startsWith("data:image/"))items.push({...x,key:k.name})}catch(e){}
 }
 items.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
 return Response.json({ok:true,items:items.slice(0,20)});
}

async function postGallery(env,request){
 if(!env.GALLERY)return responseError("معرض الصور GALLERY غير مربوط بالـWorker.",500);
 const body=await request.json();
 const image=String(body.image||"");
 const name=String(body.name||"مشاركة").trim().slice(0,80)||"مشاركة";
 if(!image.startsWith("data:image/"))return responseError("صيغة الصورة غير صحيحة.",400);
 if(image.length>12000000)return responseError("حجم الصورة كبير جدًا.",413);
 const key="art:"+Date.now()+"-"+crypto.randomUUID();
 await env.GALLERY.put(key,JSON.stringify({image,name,createdAt:Date.now()}));
 const list=await env.GALLERY.list({prefix:"art:",limit:100});
 const rows=[];
 for(const k of list.keys||[]){const v=await env.GALLERY.get(k.name,"json");rows.push({key:k.name,createdAt:v?.createdAt||0})}
 rows.sort((a,b)=>b.createdAt-a.createdAt);
 for(const x of rows.slice(20))await env.GALLERY.delete(x.key);
 return Response.json({ok:true});
}

export default {
 async fetch(request,env){
  const u=new URL(request.url);
  try{
   if(u.pathname==="/api/generate"&&request.method==="POST")return await generate(env,request);
   if(u.pathname==="/api/gallery"&&request.method==="GET")return await getGallery(env);
   if(u.pathname==="/api/gallery"&&request.method==="POST")return await postGallery(env,request);
   if(u.pathname==="/api/gallery"&&request.method==="DELETE"){
    if(!env.GALLERY)return responseError("معرض الصور غير مربوط.",500);
    const key=u.searchParams.get("key")||"";
    if(!key.startsWith("art:"))return responseError("مفتاح الصورة غير صحيح.",400);
    await env.GALLERY.delete(key);
    return Response.json({ok:true});
   }
   return new Response(PAGE,{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store"}});
  }catch(e){
   const m=String(e?.message||e);
   return responseError(m,500);
  }
 }
};
