const MODEL = "@cf/black-forest-labs/flux-1-schnell";

const HTML = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>شعوري.. لوحة 🎨</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;background:linear-gradient(135deg,#f7fbf8,#edf7f1);color:#17352b}.wrap{max-width:900px;margin:auto;padding:20px 14px 40px}.hero{background:linear-gradient(135deg,#075b43,#11805f);color:#fff;border-radius:28px;padding:28px 18px;text-align:center;box-shadow:0 18px 45px #0b6b4f22}.badge{display:inline-block;background:#ffffff22;border:1px solid #ffffff55;padding:8px 15px;border-radius:999px}.hero h1{font-size:34px;margin:12px 0 6px}.sub{font-size:17px;line-height:1.8}.card{background:#fff;border:1px solid #dce9e2;border-radius:24px;padding:20px;margin-top:18px;box-shadow:0 12px 35px #17352b10}label{display:block;font-weight:700;margin:8px 0}input,textarea{width:100%;border:1px solid #cadbd3;border-radius:16px;padding:14px;font:inherit;background:#fbfdfc}textarea{min-height:130px;resize:vertical}.chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 18px}.chip{border:1px solid #c9dcd3;background:#f4f9f6;border-radius:999px;padding:9px 14px;cursor:pointer}.chip.on{background:#0b6b4f;color:#fff;border-color:#0b6b4f}.primary{width:100%;border:0;border-radius:16px;padding:15px;background:#0b6b4f;color:#fff;font:inherit;font-size:18px;font-weight:700;cursor:pointer}.primary:disabled{opacity:.55}.status{text-align:center;padding:12px;display:none}.result canvas{width:100%;display:block;border-radius:20px}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.actions button{border:0;border-radius:15px;padding:13px 18px;background:#edf5f1;color:#0b6b4f;font:inherit;font-weight:700;cursor:pointer}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.gitem{border:1px solid #dfeae4;border-radius:18px;padding:8px}.gitem img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:13px}.gname{font-size:13px;margin:7px 3px;color:#527065}.empty{text-align:center;color:#71877e;padding:25px}footer{text-align:center;color:#71877e;font-size:13px;line-height:1.9;margin-top:22px}
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
<div class="chips">فخر،انتماء،أمل،طموح،امتنان،مستقبل،اعتزاز،فرح</div>
<div id="chipsBox" class="chips"></div>
<label>اكتبي شعورك تجاه وطنك</label>
<textarea id="feelings" placeholder="مثال: أشعر بالفخر والانتماء لوطني، وأرى مستقبل المملكة مليئًا بالطموح والإنجاز..."></textarea>
<button id="go" class="primary">🎨 ارسم شعوري</button>
<div id="status" class="status"></div>
</section>

<section id="result" class="card result" style="display:none">
<h2>لوحتك التعبيرية ✨</h2>
<canvas id="artCanvas"></canvas>
<div class="actions"><button id="save">💾 حفظ في المعرض المشترك</button><button id="download">⬇️ تحميل اللوحة</button></div>
</section>

<section class="card"><h2>🖼️ معرض اللوحات المشترك</h2><div id="gallery" class="gallery"><div class="empty">جاري تحميل المعرض...</div></div></section>
<footer>المدرسة المتوسطة السابعة والأربعون · إدارة تعليم المدينة المنورة<br>إعداد وتنفيذ: جوهره الجابري</footer>
</div>

<script>
const emotionList=["فخر","انتماء","أمل","طموح","امتنان","مستقبل","اعتزاز","فرح"];
const chipsBox=document.getElementById("chipsBox");
emotionList.forEach(function(v){var b=document.createElement("button");b.type="button";b.className="chip";b.textContent=v;b.dataset.v=v;b.onclick=function(){b.classList.toggle("on")};chipsBox.appendChild(b)});
var currentImage="",statusEl=document.getElementById("status");
function msg(t){statusEl.textContent=t;statusEl.style.display="block"}
function esc(s){return String(s||"").replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]})}
async function render(){
 try{var r=await fetch("/api/gallery",{cache:"no-store"});var a=await r.json();if(!r.ok)throw Error();var g=document.getElementById("gallery");g.innerHTML=a.length?a.map(function(x){return '<div class="gitem"><img src="'+x.image+'" alt="لوحة"><div class="gname">'+esc(x.name||"مشاركة")+"</div></div>"}).join(""):'<div class="empty">لم تُحفظ لوحات بعد 🌿</div>'}catch(e){document.getElementById("gallery").innerHTML='<div class="empty">تعذر تحميل المعرض الآن.</div>'}}
render();

async function brandImage(dataUrl){
 return new Promise(function(resolve,reject){
  var img=new Image();
  img.onload=function(){
   var c=document.getElementById("artCanvas"),maxW=1200,s=Math.min(1,maxW/img.width);
   c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);
   var ctx=c.getContext("2d");ctx.drawImage(img,0,0,c.width,c.height);
   var w=c.width,h=c.height,bh=Math.max(115,Math.round(h*.17));
   var grad=ctx.createLinearGradient(0,h-bh,w,h);grad.addColorStop(0,"rgba(0,92,67,.94)");grad.addColorStop(1,"rgba(0,45,33,.98)");
   ctx.fillStyle=grad;ctx.fillRect(0,h-bh,w,bh);ctx.direction="rtl";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#fff";
   ctx.font="700 "+Math.max(27,Math.round(w/25))+"px Tahoma,Arial,sans-serif";ctx.fillText("اليوم الوطني السعودي 96",w/2,h-bh*.62);
   ctx.font="600 "+Math.max(20,Math.round(w/40))+"px Tahoma,Arial,sans-serif";ctx.fillText("عزّنا بطبعنا",w/2,h-bh*.22);ctx.font="500 "+Math.max(13,Math.round(w/70))+"px Tahoma,Arial,sans-serif";ctx.fillText("شعوري.. لوحة · المدرسة المتوسطة السابعة والأربعون",w/2,h-10);
   currentImage=c.toDataURL("image/jpeg",.92);resolve();
  };img.onerror=reject;img.src=dataUrl;
 });
}

document.getElementById("go").onclick=async function(){
 var feelings=document.getElementById("feelings").value.trim(),name=document.getElementById("name").value.trim();
 var selected=Array.from(document.querySelectorAll(".chip.on")).map(function(x){return x.dataset.v});
 if(!feelings){msg("اكتبي شعورك أولًا 🌷");return}
 var b=document.getElementById("go");b.disabled=true;msg("🎨 الذكاء الاصطناعي يرسم شعورك الآن...");
 try{
  var r=await fetch("/api/generate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({feelings:feelings,name:name,chips:selected.join("، ")})});
  var d=await r.json().catch(function(){return {error:"تعذر قراءة الاستجابة"}});
  if(!r.ok||!d.image)throw Error(d.error||"تعذر إنشاء اللوحة");
  await brandImage(d.image);document.getElementById("result").style.display="block";msg("✨ اكتملت اللوحة — المشاعر التي فُسرت بصريًا: "+(d.emotion||"فخر")+" . يمكنك حفظها في المعرض المشترك.");document.getElementById("result").scrollIntoView({behavior:"smooth"});
 }catch(e){msg("⚠️ "+e.message)}finally{b.disabled=false}
};

document.getElementById("save").onclick=async function(){
 if(!currentImage)return;var b=document.getElementById("save");b.disabled=true;msg("💚 جارٍ حفظ اللوحة في المعرض المشترك...");
 try{var r=await fetch("/api/gallery",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({image:currentImage,name:document.getElementById("name").value.trim()||"مشاركة"})});var d=await r.json();if(!r.ok)throw Error(d.error||"تعذر الحفظ");await render();msg("💚 تم حفظ اللوحة في المعرض المشترك.");}catch(e){msg("⚠️ "+e.message)}finally{b.disabled=false}
};
document.getElementById("download").onclick=function(){if(!currentImage)return;var a=document.createElement("a");a.href=currentImage;a.download="شعوري-لوحة-اليوم-الوطني-96.jpg";a.click()};
</script>
</body>
</html>`;

const emotionMap={
"فخر":"pride, dignity, achievement",
"انتماء":"belonging, homeland roots, family warmth",
"أمل":"hope, renewal, sunrise, bright horizon",
"طموح":"ambition, innovation, progress",
"امتنان":"gratitude, warmth, hospitality",
"مستقبل":"future, technology, sustainability",
"اعتزاز":"honor, authenticity, cultural dignity",
"فرح":"joy, tasteful celebration"
};

function err(message,status){return Response.json({error:message},{status:status||500})}

export default {async fetch(request,env){
 const url=new URL(request.url);

 if(url.pathname==="/api/gallery"&&request.method==="GET"){
  try{
   if(!env.GALLERY)return err("لم يتم ربط GALLERY بالـWorker.",500);
   const list=await env.GALLERY.list({prefix:"art:"});
   const items=await Promise.all(list.keys.map(function(k){return env.GALLERY.get(k.name,"json")}));
   return Response.json(items.filter(Boolean).sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0)}));
  }catch(e){return err(e.message||"تعذر تحميل المعرض",500)}
 }

 if(url.pathname==="/api/gallery"&&request.method==="POST"){
  try{
   if(!env.GALLERY)return err("لم يتم ربط GALLERY بالـWorker.",500);
   var body=await request.json(),image=String(body.image||""),name=String(body.name||"مشاركة").trim().slice(0,80)||"مشاركة";
   if(!image.startsWith("data:image/"))return err("صيغة الصورة غير صحيحة.",400);
   if(image.length>12000000)return err("الصورة كبيرة جدًا للحفظ.",413);
   var key="art:"+Date.now()+"-"+crypto.randomUUID();
   await env.GALLERY.put(key,JSON.stringify({image:image,name:name,createdAt:Date.now()}));
   var list=await env.GALLERY.list({prefix:"art:"});
   if(list.keys.length>20){
    var all=await Promise.all(list.keys.map(async function(k){var v=await env.GALLERY.get(k.name,"json");return {key:k.name,createdAt:v&&v.createdAt||0}}));
    all.sort(function(a,b){return b.createdAt-a.createdAt});
    for(var old of all.slice(20))await env.GALLERY.delete(old.key);
   }
   return Response.json({ok:true});
  }catch(e){return err(e.message||"تعذر حفظ اللوحة",500)}
 }

 if(url.pathname==="/api/generate"&&request.method==="POST"){
  try{
   var body=await request.json();
   var feelings=String(body.feelings||"").trim();
   var chips=String(body.chips||"").trim();
   if(!feelings)return err("يرجى كتابة الشعور أولًا",400);

   var emotionRules=[
    {name:"فخر",keys:["فخر","فخور","اعتزاز","عز","إنجاز"],mood:"pride, dignity, achievement",scene:"A majestic Saudi scene at golden hour: a proud Saudi family and young people in the foreground, the Saudi flag flowing naturally, palms, elegant heritage architecture, and a distant modern Riyadh skyline. The feeling is dignity and belonging, not a generic celebration."},
    {name:"انتماء",keys:["انتماء","وطن","وطني","حب","بلدي","بلاد"],mood:"belonging, homeland warmth, community",scene:"A warm Saudi family and community scene showing different generations together in an authentic Saudi setting, with the flag, palms, traditional architecture and subtle modern Saudi details. Emphasize human connection and belonging."},
    {name:"أمل",keys:["أمل","تفاؤل","مشرق","غد","أحلم"],mood:"hope, renewal, bright future",scene:"A cinematic Saudi sunrise: a young Saudi person and family looking toward a luminous horizon, with palms and Saudi landscape transitioning naturally into a modern sustainable Saudi city. The image should feel hopeful and calm."},
    {name:"طموح",keys:["طموح","طموحي","نجاح","تقدم","ابتكار","إنجاز"],mood:"ambition, innovation, progress",scene:"Young Saudi innovators in a sophisticated modern Saudi environment, technology and sustainable architecture integrated with subtle heritage elements, the Saudi flag present naturally, and Riyadh's contemporary skyline suggesting progress and possibility."},
    {name:"امتنان",keys:["امتنان","شكر","نعمة","نحمد"],mood:"gratitude, generosity, hospitality",scene:"An authentic Saudi hospitality scene inspired by generosity: a welcoming family, traditional Saudi setting, coffee service and heritage details, warm natural light, palms and the Saudi flag subtly present. Elegant and heartfelt."},
    {name:"مستقبل",keys:["مستقبل","تقنية","تقنيات","استدامة","رؤية","غد"],mood:"future, technology, sustainability",scene:"A visionary Saudi future scene combining a modern Riyadh skyline, young Saudi talent, technology, green sustainable landscapes and subtle heritage motifs, with the Saudi flag integrated naturally. Sophisticated, optimistic and distinctly Saudi."},
    {name:"اعتزاز",keys:["اعتزاز","عزة","أصيل","أصالة","تراث"],mood:"honor, authenticity, cultural pride",scene:"A refined Saudi heritage composition featuring Najdi architecture, traditional Saudi clothing, palms, the Saudi flag and authentic geometric textile-inspired patterns. Blend heritage with a subtle contemporary Saudi element."},
    {name:"فرح",keys:["فرح","سعادة","احتفال","بهجة","فرحان"],mood:"joy, celebration, community",scene:"An elegant Saudi National Day community celebration with families, children, Saudi flags, tasteful green lighting and joyful atmosphere. Fireworks may appear subtly in the distance, never dominating the scene."}
   ];

   var lower=feelings.toLowerCase();
   var selectedNames=chips.split("،").map(function(x){return x.trim()}).filter(Boolean);
   var matched=emotionRules.filter(function(r){
     return selectedNames.indexOf(r.name)>=0 || r.keys.some(function(k){return feelings.indexOf(k)>=0});
   });
   if(!matched.length)matched=[emotionRules[0],emotionRules[2]];

   var primary=matched[0];
   var secondary=matched[1]||primary;

   var variants=[
    "Use a cinematic wide composition with a clear foreground, meaningful middle ground and elegant Saudi horizon.",
    "Use a vertical editorial composition with one strong emotional focal point and layered Saudi details.",
    "Use a refined fine-art composition with natural human interaction, depth, atmospheric light and a memorable focal symbol."
   ];
   var variant=variants[Math.floor(Math.random()*variants.length)];

   var prompt=`Create ONE original premium artwork specifically for Saudi National Day 96 in Saudi Arabia, 2026. The official 2026 identity is "عزّنا بطبعنا", centered on authentic Saudi character and values including courage, vision, authenticity, determination, generosity and hospitality.

The participant wrote: "${feelings}"
Primary emotion: ${primary.name} — ${primary.mood}
Secondary emotion: ${secondary.name} — ${secondary.mood}

VISUAL STORY:
${primary.scene}
Blend a subtle secondary emotional layer from ${secondary.name} without turning the image into a collage.
${variant}

The artwork must clearly feel Saudi and suitable for a school exhibition. Use an accurate Saudi green-and-white flag, Saudi palms, crossed-swords and palm symbolism where visually appropriate, authentic Saudi people and clothing, Najdi heritage, and/or modern Riyadh and Saudi innovation according to the emotion. Keep the composition coherent and beautiful. Do not force every symbol into one image.

IMPORTANT QUALITY RULES:
No Founding Day imagery. No National Day 95. No random generic mosque-city-fireworks template.
NO text, NO Arabic writing, NO English writing, NO letters, NO numbers, NO slogans, NO watermark, NO logo inside the generated image. The application will add the exact official wording afterward.
Photorealistic premium editorial fine-art, realistic Saudi architecture, natural faces and proportions, cinematic daylight or golden-hour lighting, elegant composition, high detail, emotionally expressive.`;

   var result=await env.AI.run(MODEL,{prompt:prompt,steps:4});
   if(!result||!result.image)throw Error("خدمة الصور لم تُرجع صورة.");
   return Response.json({image:"data:image/jpeg;base64,"+result.image,emotion:primary.name});
  }catch(e){return err(e.message||"حدث خطأ أثناء إنشاء اللوحة",500)}
 }

 return new Response(HTML,{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store"}});
}};

