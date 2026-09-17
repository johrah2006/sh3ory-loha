const MODEL = "@cf/black-forest-labs/flux-2-dev";
const GALLERY_PREFIX = "art:";

const HTML = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>شعوري.. لوحة 🎨</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;background:linear-gradient(135deg,#f5faf7,#eaf5ef);color:#17352b}.wrap{max-width:940px;margin:auto;padding:18px 14px 42px}.hero{background:linear-gradient(135deg,#075b43,#128460);color:#fff;border-radius:28px;padding:28px 18px;text-align:center;box-shadow:0 18px 45px #075b4322}.badge{display:inline-block;background:#ffffff1f;border:1px solid #ffffff55;padding:8px 15px;border-radius:999px}.hero h1{font-size:34px;margin:13px 0 7px}.sub{font-size:17px;line-height:1.9}.card{background:#fff;border:1px solid #dce9e2;border-radius:24px;padding:20px;margin-top:18px;box-shadow:0 12px 35px #17352b10}label{display:block;font-weight:700;margin:9px 0}input,textarea{width:100%;border:1px solid #cadbd3;border-radius:16px;padding:14px;font:inherit;background:#fbfdfc}textarea{min-height:135px;resize:vertical}.chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 18px}.chip{border:1px solid #c9dcd3;background:#f4f9f6;border-radius:999px;padding:9px 14px;cursor:pointer;font:inherit}.chip.on{background:#0b6b4f;color:#fff;border-color:#0b6b4f}.primary{width:100%;border:0;border-radius:16px;padding:15px;background:#0b6b4f;color:#fff;font:inherit;font-size:18px;font-weight:700;cursor:pointer}.primary:disabled{opacity:.55}.status{text-align:center;padding:12px;line-height:1.8;display:none}.result canvas{width:100%;display:block;border-radius:20px;background:#eef5f1}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.actions button{border:0;border-radius:15px;padding:13px 18px;background:#edf5f1;color:#0b6b4f;font:inherit;font-weight:700;cursor:pointer}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.gitem{border:1px solid #dfeae4;border-radius:18px;padding:8px;background:#fff}.gitem img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:13px}.gname{font-size:13px;margin:7px 3px;color:#527065;line-height:1.6}.gactions{display:flex;justify-content:flex-end;margin-top:7px}.deleteBtn{border:0;border-radius:10px;padding:7px 10px;background:#fff0f0;color:#a52a2a;font:inherit;font-weight:700;cursor:pointer}.deleteBtn:disabled{opacity:.5}.empty{text-align:center;color:#71877e;padding:25px}footer{text-align:center;color:#71877e;font-size:13px;line-height:1.9;margin-top:22px}
</style>
</head>
<body>
<div class="wrap">
<section class="hero">
<div class="badge">🇸🇦 اليوم الوطني السعودي 96 · 2026</div>
<h1>شعوري.. لوحة 🎨</h1>
<div class="sub">وطن بعيون الذكاء الاصطناعي 🇸🇦<br><b>عزّنا بطبعنا</b><br><small>من شعورك… إلى لوحة تحكي حكاية وطن</small></div>
</section>

<section class="card">
<label>اسم المشاركة / المعلمة</label>
<input id="name" placeholder="اكتبي الاسم">
<label>اختاري المشاعر</label>
<div id="chipsBox" class="chips"></div>
<label>اكتبي شعورك تجاه وطنك</label>
<textarea id="feelings" placeholder="مثال: أشعر بالفخر والانتماء لوطني، وأرى مستقبل المملكة مليئًا بالطموح والإنجاز..."></textarea>
<button id="go" class="primary">🎨 ارسم شعوري</button>
<div id="status" class="status"></div>
</section>

<section id="result" class="card result" style="display:none">
<h2>لوحتك التعبيرية ✨</h2>
<canvas id="artCanvas"></canvas>
<div class="actions">
<button id="save">💾 حفظ في المعرض</button>
<button id="download">⬇️ تحميل اللوحة</button>
</div>
</section>

<section class="card">
<h2>🖼️ معرض اللوحات المشترك · اليوم الوطني 96</h2>
<div class="sub" style="font-size:13px;color:#71877e;margin-bottom:10px">كل لوحة تُحفظ هنا تظهر للمشاركات، ويمكن حذف اللوحات غير المناسبة.</div>
<div id="gallery" class="gallery"><div class="empty">جاري تحميل المعرض...</div></div>
</section>

<footer>المدرسة المتوسطة السابعة والأربعون · إدارة تعليم المدينة المنورة<br>إعداد وتنفيذ: جوهره الجابري</footer>
</div>

<script>
const emotionList=["فخر","انتماء","أمل","طموح","امتنان","مستقبل","اعتزاز","فرح"];
const chipsBox=document.getElementById("chipsBox");
emotionList.forEach(v=>{const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=v;b.dataset.v=v;b.onclick=()=>b.classList.toggle("on");chipsBox.appendChild(b)});
let currentImage="",statusEl=document.getElementById("status");
function msg(t){statusEl.textContent=t;statusEl.style.display="block"}
function esc(s){return String(s||"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function localGallery(){try{return JSON.parse(localStorage.getItem("sh3ory_gallery")||"[]")}catch(e){return[]}}
function setLocalGallery(a){try{localStorage.setItem("sh3ory_gallery",JSON.stringify(a.slice(0,20)))}catch(e){}}
function drawGallery(a){
 const g=document.getElementById("gallery");
 g.innerHTML=a.length?a.map(x=>{
  const dt=x.createdAt?new Date(x.createdAt).toLocaleString("ar-SA",{dateStyle:"short",timeStyle:"short"}):"";
  return '<div class="gitem"><img src="'+x.image+'" alt="لوحة اليوم الوطني السعودي 96"><div class="gname"><b>'+esc(x.name||"مشاركة")+'</b><br><span>'+esc(dt)+'</span></div><div class="gactions"><button class="deleteBtn" data-key="'+esc(x.key||"")+'">🗑️ مسح الصورة</button></div></div>'
 }).join(""):'<div class="empty">لم تُحفظ لوحات بعد 🌿</div>';
 g.querySelectorAll(".deleteBtn").forEach(btn=>btn.onclick=()=>deleteGalleryItem(btn.dataset.key,btn));
}
async function deleteGalleryItem(key,btn){
 if(!key){msg("هذه اللوحة محفوظة محليًا فقط.");return}
 if(!confirm("هل تريدين مسح هذه اللوحة من المعرض المشترك؟"))return;
 btn.disabled=true;
 try{
  const r=await fetch("/api/gallery?key="+encodeURIComponent(key),{method:"DELETE"});
  const d=await r.json();
  if(!r.ok||!d.ok)throw Error(d.error||"تعذر مسح الصورة");
  msg("🗑️ تم مسح اللوحة من المعرض.");
  await render();
 }catch(e){btn.disabled=false;msg("⚠️ "+e.message)}
}
async function render(){
 try{
  const r=await fetch("/api/gallery",{cache:"no-store"}),d=await r.json();
  if(d&&Array.isArray(d.items)){drawGallery(d.items);if(d.ok)setLocalGallery(d.items)}
  else drawGallery(localGallery());
 }catch(e){drawGallery(localGallery())}
}
render();

function brandImage(dataUrl){
 return new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>{
   const c=document.getElementById("artCanvas"),maxW=1200,s=Math.min(1,maxW/img.width);
   c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);
   const ctx=c.getContext("2d");ctx.drawImage(img,0,0,c.width,c.height);
   const w=c.width,h=c.height,bh=Math.max(125,Math.round(h*.18));
   const grad=ctx.createLinearGradient(0,h-bh,w,h);grad.addColorStop(0,"rgba(0,92,67,.94)");grad.addColorStop(1,"rgba(0,45,33,.99)");
   ctx.fillStyle=grad;ctx.fillRect(0,h-bh,w,bh);ctx.direction="rtl";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#fff";
   ctx.font="700 "+Math.max(27,Math.round(w/25))+"px Tahoma,Arial,sans-serif";ctx.fillText("اليوم الوطني السعودي 96",w/2,h-bh*.63);
   ctx.font="600 "+Math.max(20,Math.round(w/40))+"px Tahoma,Arial,sans-serif";ctx.fillText("عزّنا بطبعنا",w/2,h-bh*.25);
   ctx.font="500 "+Math.max(13,Math.round(w/70))+"px Tahoma,Arial,sans-serif";ctx.fillText("شعوري.. لوحة · المدرسة المتوسطة السابعة والأربعون",w/2,h-10);
   currentImage=c.toDataURL("image/jpeg",.92);resolve();
  };
  img.onerror=reject;img.src=dataUrl;
 });
}

document.getElementById("go").onclick=async()=>{
 const feelings=document.getElementById("feelings").value.trim(),name=document.getElementById("name").value.trim();
 const selected=[...document.querySelectorAll(".chip.on")].map(x=>x.dataset.v);
 if(!feelings){msg("اكتبي شعورك أولًا 🌷");return}
 const b=document.getElementById("go");b.disabled=true;msg("🎨 الذكاء الاصطناعي يفهم شعورك ويرسم لوحة أصلية الآن...");
 try{
  const r=await fetch("/api/generate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({feelings,name,chips:selected.join("، ")})});
  const d=await r.json().catch(()=>({error:"تعذر قراءة الاستجابة"}));
  if(!r.ok||!d.image)throw Error(d.error||"تعذر إنشاء اللوحة");
  await brandImage(d.image);
  document.getElementById("result").style.display="block";
  document.getElementById("result").scrollIntoView({behavior:"smooth"});
  await saveToGallery(true);
 }catch(e){
  let em=String(e&&e.message||e);
  if(/daily free allocation|neurons|3036|429|quota|Account limited/i.test(em))em="⏳ انتهت حصة توليد الصور المجانية في Cloudflare حاليًا. بعد تجدد الحصة ستعمل اللوحة من دون تغيير الكود.";
  msg("⚠️ "+em);
 }finally{b.disabled=false}
};

async function saveToGallery(auto){
 if(!currentImage)return false;
 const b=document.getElementById("save");b.disabled=true;
 if(auto)msg("💚 جارٍ حفظ اللوحة في المعرض المشترك...");
 const item={image:currentImage,name:document.getElementById("name").value.trim()||"مشاركة",createdAt:Date.now()};
 try{
  const r=await fetch("/api/gallery",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(item)});
  const d=await r.json();
  if(!r.ok||!d.shared)throw Error(d.error||"تعذر الحفظ المشترك");
  b.textContent="✅ تم الحفظ في المعرض";
  await render();msg("💚 تم حفظ اللوحة في المعرض المشترك.");
  return true;
 }catch(e){
  const a=localGallery().filter(x=>x.image!==item.image);a.unshift(item);setLocalGallery(a);drawGallery(a);
  b.textContent="✅ تم الحفظ في هذا الجهاز";msg("💚 تم الحفظ محليًا لأن المعرض المشترك غير متاح.");
  return true;
 }finally{b.disabled=false}
}
document.getElementById("save").onclick=()=>saveToGallery(false);
document.getElementById("download").onclick=()=>{if(!currentImage)return;const a=document.createElement("a");a.href=currentImage;a.download="شعوري-لوحة-اليوم-الوطني-96.jpg";a.click()};
</script>
</body>
</html>`;

const emotionRules=[
 {name:"فخر",keys:["فخر","فخور","اعتزاز","عز","إنجاز"],scene:"A majestic Saudi achievement scene: a confident Saudi young woman or young man in the foreground with the Saudi flag, a modern Riyadh skyline and elegant Saudi architecture behind them, subtle palm and sword symbolism, dramatic golden light, visual language of pride and national achievement."},
 {name:"انتماء",keys:["انتماء","وطن","وطني","حب","بلدي","بلاد"],scene:"A powerful visual story of love for Saudi Arabia: a Saudi woman or young Saudi person standing proudly in a beautiful Saudi landscape overlooking a modern Saudi city, gently holding the Saudi flag, warm sunlight, authentic Saudi architecture and palms integrated naturally. Deep love and belonging to the homeland."},
 {name:"أمل",keys:["أمل","تفاؤل","مشرق","غد","أحلم"],scene:"A hopeful Saudi future: a young Saudi student looking toward a luminous sunrise over a modern sustainable Saudi city, green landscapes and subtle Saudi heritage elements, the flag flowing naturally, atmosphere of hope and possibility."},
 {name:"طموح",keys:["طموح","طموحي","نجاح","تقدم","ابتكار","إنجاز"],scene:"A visionary Saudi innovation scene: young Saudi talent in a modern technology and innovation environment, elegant futuristic Saudi architecture, sustainable green landscape, Riyadh skyline, Saudi flag integrated naturally, visual feeling of ambition and progress."},
 {name:"امتنان",keys:["امتنان","شكر","نعمة","نحمد"],scene:"A warm elegant Saudi hospitality scene: authentic Saudi home or heritage setting, welcoming gesture and traditional coffee service, tasteful Saudi textiles, warm light, palms and the flag subtly present. The feeling is gratitude, generosity and appreciation."},
 {name:"مستقبل",keys:["مستقبل","تقنية","تقنيات","استدامة","رؤية","غد"],scene:"A sophisticated vision of Saudi Arabia's future: young Saudi innovators, clean futuristic architecture, sustainable green spaces, advanced technology shown visually without text, Riyadh skyline and Saudi flag, optimistic cinematic atmosphere."},
 {name:"اعتزاز",keys:["اعتزاز","عزة","أصيل","أصالة","تراث"],scene:"A refined Saudi heritage scene: authentic Najdi architecture, traditional Saudi clothing, elegant Saudi geometric patterns, palm trees and Saudi flag, blended with one subtle modern Saudi element. Authentic cultural pride, dignity and continuity."},
 {name:"فرح",keys:["فرح","سعادة","احتفال","بهجة","فرحان"],scene:"A joyful but sophisticated Saudi National Day celebration: Saudi families and young people, tasteful green illumination, Saudi flags, elegant public space, subtle celebratory lights, genuine happiness and national pride."}
];

function jsonError(message,status=500){return Response.json({error:message},{status})}

async function generate(env,request){
 const body=await request.json();
 const feelings=String(body.feelings||"").trim();
 const chips=String(body.chips||"").trim();
 if(!feelings)return jsonError("يرجى كتابة الشعور أولًا",400);

 const selected=chips.split("،").map(x=>x.trim()).filter(Boolean);
 const matched=emotionRules.filter(r=>selected.includes(r.name)||r.keys.some(k=>feelings.includes(k)));
 const primary=matched[0]||emotionRules[0];
 const secondary=matched[1]||emotionRules[2];

 const prompt=`Create ONE original premium exhibition artwork for Saudi National Day 96, Saudi Arabia, 2026.

OFFICIAL CONTEXT:
Saudi National Day 96, 2026. Official 2026 identity: "عزّنا بطبعنا".
The visual should reflect authentic Saudi character and values such as courage, vision, authenticity, determination, generosity and hospitality.
This is NOT National Day 95 and NOT Founding Day.

PARTICIPANT FEELING:
"${feelings}"
Selected emotions: ${chips||"none"}
Primary emotion: ${primary.name}
Secondary emotion: ${secondary.name}

VISUAL STORY:
${primary.scene}

Use the participant's exact words as the main emotional direction. The feeling must change the subject, action, lighting, atmosphere and symbolism. Blend the secondary emotion subtly. Tell ONE coherent visual story. Do not create a random collection of Saudi symbols.

SAUDI NATIONAL IDENTITY:
Accurate Saudi green-and-white flag, authentic Saudi environment, refined green-and-white palette, subtle geometric/textile-inspired motifs inspired by the official 2026 identity. Use only national elements that support the story. The result must unmistakably read as Saudi Arabia and specifically a Saudi National Day 96 exhibition image.

ART DIRECTION:
Photorealistic premium editorial photography / cinematic real-world scene, professional exhibition quality, realistic Saudi people only when appropriate, authentic clothing and architecture, natural anatomy and lighting, realistic materials, sophisticated composition, emotionally moving, high detail. Not cartoon, not clip-art, not generic stock photography, not collage, not a generic mosque poster.

STRICT EXCLUSIONS:
No text anywhere in the generated artwork. No Arabic letters. No English letters. No numbers. No slogans. No logos. No watermark. No signs with writing. No distorted typography.
Do not depict National Day 95. Do not use Founding Day brown/beige branding.
Do not force a mosque, family, fireworks, desert and palm trees into every image.
Do not make a generic family portrait the default.
Do not make a mosque the default.
The application will add the exact official wording after generation.`;

 const form=new FormData();
 form.append("prompt",prompt);
 form.append("steps","25");
 form.append("width","1024");
 form.append("height","1024");
 form.append("guidance","3.5");
 const req=new Request("http://dummy",{method:"POST",body:form});
 const result=await env.AI.run(MODEL,{multipart:{body:req.body,contentType:req.headers.get("content-type")}});
 if(!result||!result.image)throw Error("خدمة الصور لم تُرجع صورة.");
 return Response.json({image:"data:image/jpeg;base64,"+result.image});
}

async function galleryGet(env){
 if(!env.GALLERY)return Response.json({ok:false,items:[],error:"GALLERY_NOT_BOUND"});
 const listed=await env.GALLERY.list({prefix:GALLERY_PREFIX,limit:100});
 const items=[];
 for(const k of (listed.keys||[])){
  const raw=await env.GALLERY.get(k.name,"text");
  if(!raw)continue;
  try{const x=JSON.parse(raw);if(x&&typeof x.image==="string")items.push({...x,key:k.name})}catch(e){}
 }
 items.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
 return Response.json({ok:true,items:items.slice(0,20)});
}

async function galleryPost(env,request){
 if(!env.GALLERY)return jsonError("لم يتم ربط معرض GALLERY بالـWorker.",500);
 const body=await request.json();
 const image=String(body.image||"");
 const name=String(body.name||"مشاركة").trim().slice(0,80)||"مشاركة";
 if(!image.startsWith("data:image/"))return jsonError("صيغة الصورة غير صحيحة.",400);
 if(image.length>12000000)return jsonError("الصورة كبيرة جدًا.",413);

 const key=GALLERY_PREFIX+Date.now()+"-"+crypto.randomUUID();
 await env.GALLERY.put(key,JSON.stringify({image,name,createdAt:Date.now()}));

 const all=await env.GALLERY.list({prefix:GALLERY_PREFIX,limit:100});
 const rows=[];
 for(const k of (all.keys||[])){
  const raw=await env.GALLERY.get(k.name,"json");
  rows.push({key:k.name,createdAt:raw?.createdAt||0});
 }
 rows.sort((a,b)=>b.createdAt-a.createdAt);
 for(const old of rows.slice(20))await env.GALLERY.delete(old.key);
 return Response.json({ok:true,shared:true});
}

async function galleryDelete(env,request){
 if(!env.GALLERY)return jsonError("لم يتم ربط معرض GALLERY بالـWorker.",500);
 const key=new URL(request.url).searchParams.get("key")||"";
 if(!key.startsWith(GALLERY_PREFIX))return jsonError("مفتاح الصورة غير صحيح.",400);
 await env.GALLERY.delete(key);
 return Response.json({ok:true});
}

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  try{
   if(url.pathname==="/api/generate"&&request.method==="POST")return await generate(env,request);
   if(url.pathname==="/api/gallery"&&request.method==="GET")return await galleryGet(env);
   if(url.pathname==="/api/gallery"&&request.method==="POST")return await galleryPost(env,request);
   if(url.pathname==="/api/gallery"&&request.method==="DELETE")return await galleryDelete(env,request);
   return new Response(HTML,{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store"}});
  }catch(e){
   const m=String(e?.message||e);
   return jsonError(m,500);
  }
 }
};
