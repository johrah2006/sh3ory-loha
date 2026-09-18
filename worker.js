
const MODEL = "@cf/black-forest-labs/flux-2-dev";
const KEY = "gallery:v1";
const MAX_GALLERY = 20;

const HTML = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>شعوري.. لوحة | اليوم الوطني 96</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;background:linear-gradient(135deg,#031b12,#075b3a 55%,#0b7a4c);color:#fff;min-height:100vh}
.wrap{max-width:980px;margin:auto;padding:22px}.hero{padding:28px 20px;text-align:center;border:1px solid #ffffff25;border-radius:28px;background:#ffffff0d;backdrop-filter:blur(10px);box-shadow:0 18px 50px #0005}
.badge{display:inline-block;padding:8px 14px;border-radius:999px;background:#d4af37;color:#09251a;font-weight:800}.hero h1{font-size:clamp(32px,7vw,62px);margin:15px 0 5px}.hero p{margin:6px 0;color:#e7f6ef}.slogan{font-size:24px;font-weight:900;margin-top:14px}
.card{margin-top:18px;padding:20px;border-radius:24px;background:#ffffff12;border:1px solid #ffffff22}
label{display:block;margin:12px 0 7px;font-weight:800}input,textarea{width:100%;border:1px solid #ffffff2d;border-radius:15px;background:#001b11aa;color:#fff;padding:13px;font:inherit;outline:none}textarea{min-height:125px;resize:vertical}
.chips{display:flex;gap:8px;flex-wrap:wrap}.chip{border:1px solid #ffffff35;background:#ffffff12;color:#fff;padding:9px 13px;border-radius:999px;cursor:pointer}.chip.active{background:#d4af37;color:#09251a;font-weight:800}
button{border:0;border-radius:16px;padding:14px 20px;font:inherit;font-weight:900;cursor:pointer}.primary{width:100%;margin-top:18px;background:#d4af37;color:#082219;font-size:18px}.secondary{background:#ffffff18;color:#fff;border:1px solid #ffffff25}.status{min-height:25px;margin-top:12px;text-align:center;color:#d9f5e7}.result{display:none;margin-top:20px}.result.show{display:block}.result img{display:block;width:100%;border-radius:22px;box-shadow:0 20px 60px #0007}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}.tile{background:#ffffff10;border:1px solid #ffffff20;border-radius:18px;padding:8px}.tile img{width:100%;border-radius:13px;display:block}.tile small{display:block;padding:8px;color:#d9f5e7}.empty{text-align:center;color:#cfe9dd;padding:25px}
footer{text-align:center;opacity:.85;padding:25px 5px;font-size:13px}
.spinner{display:inline-block;width:18px;height:18px;border:3px solid #183d2d;border-top-color:transparent;border-radius:50%;animation:r .8s linear infinite;vertical-align:middle}@keyframes r{to{transform:rotate(360deg)}}
</style>
</head>
<body>
<div class="wrap">
<section class="hero">
<div class="badge">🇸🇦 اليوم الوطني السعودي 96 · 2026</div>
<h1>شعوري.. لوحة 🎨</h1>
<p>وطن بعيون الذكاء الاصطناعي 🇸🇦</p>
<div class="slogan">عزّنا بطبعنا</div>
</section>

<section class="card">
<label for="name">اسم المعلمة / المشاركة</label>
<input id="name" placeholder="اكتبي اسمك">

<label>ما الشعور الأقرب لك؟</label>
<div class="chips" id="chips">
<button class="chip" data-v="فخر">فخر</button><button class="chip" data-v="انتماء">انتماء</button>
<button class="chip" data-v="أمل">أمل</button><button class="chip" data-v="طموح">طموح</button>
<button class="chip" data-v="امتنان">امتنان</button><button class="chip" data-v="مستقبل">مستقبل</button>
<button class="chip" data-v="اعتزاز">اعتزاز</button><button class="chip" data-v="فرح">فرح</button>
</div>

<label for="feel">صفي شعورك تجاه الوطن بكلماتك</label>
<textarea id="feel" placeholder="مثال: أشعر بالفخر عندما أرى وطننا يتقدم، وأشعر بالأمل تجاه مستقبل أبنائي..."></textarea>

<button class="primary" id="draw">🎨 ارسم شعوري</button>
<div class="status" id="status"></div>

<div class="result" id="result">
<img id="resultImg" alt="لوحة مولدة بالذكاء الاصطناعي">
<div class="actions">
<button class="secondary" id="save">⬇️ حفظ اللوحة</button>
<button class="secondary" id="add">💚 إضافة للمعرض</button>
</div>
</div>
</section>

<section class="card">
<h2>🖼️ معرض «شعوري.. لوحة»</h2>
<div class="gallery-grid" id="gallery"><div class="empty">جاري تحميل المعرض...</div></div>
</section>

<footer>
<div>المدرسة المتوسطة السابعة والأربعون · إدارة تعليم المدينة المنورة</div>
<div>إعداد وتنفيذ: جوهره الجابري</div>
</footer>
</div>

<script>
const $=id=>document.getElementById(id);
let selected="";
let current=null;
document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");selected=b.dataset.v});
document.querySelectorAll("textarea,input").forEach(x=>x.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.ctrlKey) $("draw").click()}));

$("draw").onclick=async()=>{
 const name=$("name").value.trim()||"مشاركة";
 const feelings=$("feel").value.trim();
 if(!feelings && !selected){$("status").textContent="اكتبي شعورك أولًا أو اختاري شعورًا.";return}
 $("draw").disabled=true;$("status").innerHTML='<span class="spinner"></span> جاري تحويل شعورك إلى لوحة حقيقية بالذكاء الاصطناعي...';
 try{
  const r=await fetch("/api/generate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name,feelings,emotion:selected})});
  const d=await r.json();
  if(!r.ok) throw new Error(d.error||"تعذر توليد الصورة");
  current={...d,name};
  $("resultImg").src="data:image/png;base64,"+d.image;
  $("result").classList.add("show");
  $("status").textContent="تم إنشاء لوحة جديدة مستوحاة من شعورك.";
 }catch(e){$("status").textContent="⚠️ "+e.message}
 finally{$("draw").disabled=false}
};

$("save").onclick=()=>{
 if(!current)return;
 const a=document.createElement("a");a.href="data:image/png;base64,"+current.image;a.download="شعوري-لوحة-اليوم-الوطني-96.png";a.click();
};
$("add").onclick=async()=>{
 if(!current)return;
 $("add").disabled=true;
 try{
  const r=await fetch("/api/gallery",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({image:current.image,name:current.name,emotion:current.emotion||selected})});
  const d=await r.json(); if(!r.ok)throw new Error(d.error||"تعذر الحفظ");
  $("status").textContent="تمت إضافة اللوحة إلى المعرض.";
  loadGallery();
 }catch(e){$("status").textContent="⚠️ "+e.message}
 finally{$("add").disabled=false}
};
async function loadGallery(){
 try{
  const r=await fetch("/api/gallery");const d=await r.json();
  if(!d.items?.length){$("gallery").innerHTML='<div class="empty">لا توجد لوحات محفوظة بعد.</div>';return}
  $("gallery").innerHTML=d.items.map(x=>'<div class="tile"><img src="data:image/png;base64,'+x.image+'" alt=""><small>'+esc(x.name||"مشاركة")+' · '+esc(x.emotion||"")+'</small></div>').join("");
 }catch(e){$("gallery").innerHTML='<div class="empty">تعذر تحميل المعرض.</div>'}
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
loadGallery();
</script>
</body></html>`;

function json(data,status=200){
 return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json;charset=UTF-8","cache-control":"no-store","access-control-allow-origin":"*"}});
}

function makePrompt({feelings,emotion}){
 const f=(feelings||"").slice(0,1200);
 const e=emotion||"فخر";
 return {
  event:"Saudi National Day 96, 2026",
  official_slogan:"عزّنا بطبعنا",
  subject:"Create one original, realistic, premium photographic artwork expressing the participant's feeling toward Saudi Arabia.",
  feeling:e,
  exact_feeling_text:f,
  values:["الشجاعة","الرؤية","الأصالة","الهمّة","الجود","الكرم"],
  visual_direction:"Authentic contemporary Saudi Arabia, emotionally meaningful, sophisticated editorial photography, realistic people and environments, natural skin, natural lighting, cinematic but believable, strong Saudi green and white accents, subtle geometric textile-inspired details from the official 2026 identity, no generic stock poster.",
  scene_mapping:{
   "فخر":"a Saudi woman standing confidently in a modern Saudi city with the national flag, sunrise, authentic pride",
   "انتماء":"a warm family/community scene in Saudi Arabia with the national flag and a strong sense of belonging",
   "أمل":"a young Saudi person looking toward a bright modern Saudi future at dawn",
   "طموح":"a Saudi professional looking toward an ambitious modern skyline, innovation and future development",
   "امتنان":"a sincere intergenerational Saudi family moment showing gratitude and connection",
   "مستقبل":"a realistic young Saudi generation in a contemporary Saudi environment, innovation and future vision",
   "اعتزاز":"an elegant authentic Saudi portrait with subtle national colors and confident expression",
   "فرح":"a genuine Saudi National Day celebration with realistic people, flags and warm joyful atmosphere"
  },
  "specific_instruction":"Use the selected feeling and the participant's exact words as the emotional source. Make the composition clearly about Saudi National Day 96 rather than a generic Saudi tourism image.",
  "negative_prompt":"cartoon, anime, illustration, painting, vector, clipart, collage, generic stock photo, generic mosque poster, tourism advertisement, fantasy city, inaccurate Saudi flag, distorted people, deformed hands, excessive symbols, Founding Day brown palette, National Day 95, old campaign identity, fake logos, watermark, captions, signs, gibberish, Arabic text, English text, numbers, letters"
 };
}

async function generate(env,body){
 if(!env.AI) throw new Error("ربط Workers AI غير موجود في هذا الـWorker.");
 const prompt=makePrompt(body);
 const form=new FormData();
 form.append("prompt",JSON.stringify(prompt));
 form.append("steps","25");
 form.append("width","1024");
 form.append("height","1024");
 form.append("guidance","4");
 const req=new Request("http://internal",{method:"POST",body:form});
 let out;
 try{
  out=await env.AI.run(MODEL,{multipart:{body:req.body,contentType:req.headers.get("content-type")}});
 }catch(err){
  const s=String(err);
  if(/allocation|quota|429|3036|limited/i.test(s)) throw new Error("انتهت حصة Workers AI اليومية في حساب Cloudflare. انتظري إعادة الضبط أو فعّلي الفوترة في Workers AI.");
  throw new Error("تعذر تشغيل مولد الصور: "+s.slice(0,220));
 }
 const image=out?.image || out?.result?.image;
 if(!image) throw new Error("مولد الصور لم يُرجع صورة. تحققي من ربط نموذج FLUX.2 [dev] بالـWorker.");
 return {image,emotion:body.emotion||"فخر"};
}

async function getGallery(env){
 if(!env.GALLERY) return [];
 const x=await env.GALLERY.get(KEY,"json");
 return Array.isArray(x)?x:[];
}
async function putGallery(env,items){
 if(env.GALLERY) await env.GALLERY.put(KEY,JSON.stringify(items));
}

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  try{
   if(request.method==="GET" && url.pathname==="/") return new Response(HTML,{headers:{"content-type":"text/html;charset=UTF-8"}});
   if(request.method==="POST" && url.pathname==="/api/generate"){
    const b=await request.json();
    if(!b.feelings && !b.emotion) return json({error:"اكتبي شعورك أو اختاري شعورًا."},400);
    return json(await generate(env,b));
   }
   if(url.pathname==="/api/gallery" && request.method==="GET") return json({items:await getGallery(env)});
   if(url.pathname==="/api/gallery" && request.method==="POST"){
    const b=await request.json();
    if(!b.image) return json({error:"لا توجد صورة للحفظ."},400);
    const items=await getGallery(env);
    items.unshift({image:b.image,name:String(b.name||"مشاركة").slice(0,80),emotion:String(b.emotion||"").slice(0,30),at:Date.now()});
    await putGallery(env,items.slice(0,MAX_GALLERY));
    return json({ok:true});
   }
   return new Response("Not found",{status:404});
  }catch(e){return json({error:e.message||"حدث خطأ غير متوقع"},500)}
 }
};
