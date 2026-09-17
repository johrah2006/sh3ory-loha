const MODEL = "@cf/black-forest-labs/flux-2-dev";

const HTML = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>شعوري.. لوحة 🎨</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;background:linear-gradient(135deg,#f7fbf8,#edf7f1);color:#17352b}.wrap{max-width:900px;margin:auto;padding:20px 14px 40px}.hero{background:linear-gradient(135deg,#075b43,#11805f);color:#fff;border-radius:28px;padding:28px 18px;text-align:center;box-shadow:0 18px 45px #0b6b4f22}.badge{display:inline-block;background:#ffffff22;border:1px solid #ffffff55;padding:8px 15px;border-radius:999px}.hero h1{font-size:34px;margin:12px 0 6px}.sub{font-size:17px;line-height:1.8}.card{background:#fff;border:1px solid #dce9e2;border-radius:24px;padding:20px;margin-top:18px;box-shadow:0 12px 35px #17352b10}label{display:block;font-weight:700;margin:8px 0}input,textarea{width:100%;border:1px solid #cadbd3;border-radius:16px;padding:14px;font:inherit;background:#fbfdfc}textarea{min-height:130px;resize:vertical}.chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 18px}.chip{border:1px solid #c9dcd3;background:#f4f9f6;border-radius:999px;padding:9px 14px;cursor:pointer}.chip.on{background:#0b6b4f;color:#fff;border-color:#0b6b4f}.primary{width:100%;border:0;border-radius:16px;padding:15px;background:#0b6b4f;color:#fff;font:inherit;font-size:18px;font-weight:700;cursor:pointer}.primary:disabled{opacity:.55}.status{text-align:center;padding:12px;display:none}.result canvas{width:100%;display:block;border-radius:20px}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.actions button{border:0;border-radius:15px;padding:13px 18px;background:#edf5f1;color:#0b6b4f;font:inherit;font-weight:700;cursor:pointer}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.gitem{border:1px solid #dfeae4;border-radius:18px;padding:8px}.gitem img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:13px}.gname{font-size:13px;margin:7px 3px;color:#527065}.gactions{display:flex;justify-content:flex-end;margin-top:7px}.deleteBtn{border:0;border-radius:10px;padding:7px 10px;background:#fff0f0;color:#a52a2a;font:inherit;font-weight:700;cursor:pointer}.deleteBtn:disabled{opacity:.5}.empty{text-align:center;color:#71877e;padding:25px}footer{text-align:center;color:#71877e;font-size:13px;line-height:1.9;margin-top:22px}
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
<div class="actions"><button id="save">💾 حفظ في المعرض</button><button id="download">⬇️ تحميل اللوحة</button></div>
</section>

<section class="card"><h2>🖼️ معرض اللوحات المشترك · اليوم الوطني 96</h2><div class="sub" style="font-size:13px;color:#71877e;margin-bottom:10px">يمكن مسح أي لوحة غير مناسبة من زر 🗑️ أسفلها.</div><div id="gallery" class="gallery"><div class="empty">جاري تحميل المعرض...</div></div></section>
<footer>المدرسة المتوسطة السابعة والأربعون · إدارة تعليم المدينة المنورة<br>إعداد وتنفيذ: جوهره الجابري</footer>
</div>

<script>
const emotionList=["فخر","انتماء","أمل","طموح","امتنان","مستقبل","اعتزاز","فرح"];
const chipsBox=document.getElementById("chipsBox");
emotionList.forEach(function(v){var b=document.createElement("button");b.type="button";b.className="chip";b.textContent=v;b.dataset.v=v;b.onclick=function(){b.classList.toggle("on")};chipsBox.appendChild(b)});
var currentImage="",statusEl=document.getElementById("status");
function msg(t){statusEl.textContent=t;statusEl.style.display="block"}
function esc(s){return String(s||"").replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]})}
function localGallery(){
 try{return JSON.parse(localStorage.getItem("sh3ory_gallery")||"[]")}catch(e){return []}
}
function setLocalGallery(a){
 try{localStorage.setItem("sh3ory_gallery",JSON.stringify(a.slice(0,20)))}catch(e){}
}
function drawGallery(a){
 var g=document.getElementById("gallery");
 g.innerHTML=a.length?a.map(function(x){
  var dt=x.createdAt?new Date(x.createdAt).toLocaleString("ar-SA",{dateStyle:"short",timeStyle:"short"}):"";
  var key=x.key||"";
  return '<div class="gitem"><img src="'+x.image+'" alt="لوحة اليوم الوطني السعودي 96"><div class="gname"><b>'+esc(x.name||"مشاركة")+"</b><br><span>"+esc(dt)+"</span></div><div class=\"gactions\"><button class=\"deleteBtn\" data-key=\""+esc(key)+"\">🗑️ مسح الصورة</button></div></div>"
 }).join(""):'<div class="empty">لم تُحفظ لوحات بعد 🌿</div>';
 Array.from(g.querySelectorAll(".deleteBtn")).forEach(function(btn){btn.onclick=function(){deleteGalleryItem(btn.dataset.key,btn)}});
}
async function deleteGalleryItem(key,btn){
 if(!key){msg("هذه اللوحة محفوظة محليًا فقط ولا يمكن مسحها من المعرض المشترك.");return}
 if(!confirm("هل تريدين مسح هذه اللوحة من المعرض المشترك؟"))return;
 btn.disabled=true;
 try{
  var r=await fetch("/api/gallery?key="+encodeURIComponent(key),{method:"DELETE"});
  var d=await r.json().catch(function(){return {ok:false}});
  if(!d.ok)throw Error(d.error||"تعذر مسح الصورة");
  msg("🗑️ تم مسح اللوحة من المعرض.");
  await render();
 }catch(e){btn.disabled=false;msg("⚠️ "+e.message)}
}
async function render(){
 try{
  var r=await fetch("/api/gallery",{cache:"no-store"});
  var d=await r.json();
  if(d&&Array.isArray(d.items)){
   drawGallery(d.items);
   if(d.ok&&d.items.length)setLocalGallery(d.items);
   else if(!d.items.length)drawGallery(localGallery());
  }else{
   drawGallery(localGallery());
  }
 }catch(e){
  drawGallery(localGallery());
 }
}
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
  await brandImage(d.image);
 document.getElementById("result").style.display="block";
 msg("✨ اكتملت اللوحة — جاري حفظها تلقائيًا في معرض اللوحات...");
 document.getElementById("result").scrollIntoView({behavior:"smooth"});
 await saveToGallery(true);
 }catch(e){var em=String(e&&e.message||e); if(/daily free allocation|neurons|3036|429|quota|Account limited/i.test(em)) em="⏳ انتهت حصة توليد الصور المجانية في Cloudflare حاليًا. أعيدي المحاولة بعد تجدد الحصة، ولا تعيدي الضغط عدة مرات."; msg("⚠️ "+em)}finally{b.disabled=false}
};

async function saveToGallery(auto){
 if(!currentImage)return false;
 var b=document.getElementById("save");
 b.disabled=true;
 if(auto)msg("💚 جارٍ حفظ اللوحة في المعرض...");
 var item={image:currentImage,name:document.getElementById("name").value.trim()||"مشاركة",createdAt:Date.now()};
 try{
  var r=await fetch("/api/gallery",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(item)});
  var d=await r.json().catch(function(){return {ok:false}});
  if(d&&d.shared){
   b.textContent="✅ تم الحفظ في المعرض";
   await render();
   msg("💚 تم حفظ اللوحة في المعرض المشترك.");
   return true;
  }
  throw Error((d&&d.error)||"تعذر الحفظ المشترك");
 }catch(e){
  var a=localGallery().filter(function(x){return x.image!==item.image});
  a.unshift(item);setLocalGallery(a);drawGallery(a);
  b.textContent="✅ تم الحفظ في هذا الجهاز";
  msg("💚 تم حفظ اللوحة في المعرض على هذا الجهاز. المعرض المشترك غير متاح حاليًا.");
  return true;
 }finally{b.disabled=false}
}
document.getElementById("save").onclick=function(){saveToGallery(false)};
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
   if(!env.GALLERY)return Response.json({ok:false,error:"GALLERY_NOT_BOUND",items:[]},{status:200});
   var keys=[],cursor=undefined,complete=false;
   while(!complete&&keys.length<100){
    var page=await env.GALLERY.list({prefix:"art:",limit:100,cursor:cursor});
    keys=keys.concat(page.keys||[]);
    complete=page.list_complete!==false;
    cursor=page.cursor;
    if(!cursor)break;
   }
   var items=[];
   for(var i=0;i<keys.length;i++){
    try{
     var raw=await env.GALLERY.get(keys[i].name,"text");
     if(!raw)continue;
     var item=JSON.parse(raw);
     if(item&&typeof item.image==="string"&&item.image.indexOf("data:image/")===0){item.key=keys[i].name;items.push(item);}
    }catch(ignore){}
   }
   items.sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0)});
   return Response.json({ok:true,items:items.slice(0,20)});
  }catch(e){return Response.json({ok:false,error:e.message||"تعذر تحميل المعرض",items:[]},{status:200})}
 }

 if(url.pathname==="/api/gallery"&&request.method==="DELETE"){
  try{
   if(!env.GALLERY)return err("لم يتم ربط GALLERY بالـWorker.",500);
   var key=new URL(request.url).searchParams.get("key");
   if(!key||!key.startsWith("art:"))return err("مفتاح الصورة غير صحيح.",400);
   await env.GALLERY.delete(key);
   return Response.json({ok:true,deleted:true});
  }catch(e){return Response.json({ok:false,error:e.message||"تعذر مسح الصورة"},{status:200})}
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
   return Response.json({ok:true,shared:true});
  }catch(e){return Response.json({ok:false,shared:false,error:e.message||"تعذر حفظ اللوحة في المعرض المشترك."},{status:200})}
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
    "Cinematic poster-like vertical composition, one dominant visual idea, strong focal point, generous negative space, elegant depth.",
    "Premium fine-art illustration, one emotionally powerful scene, layered foreground and background, sophisticated visual storytelling.",
    "Museum-quality digital painting, balanced composition, realistic Saudi details, expressive light, memorable symbolic focal point."
   ];
   var variant=variants[Math.floor(Math.random()*variants.length)];

   var scene=primary.scene;
   if(primary.name==="انتماء" && /حب|أحب|وطني|وطن/.test(feelings)){
     scene="A powerful visual story of love for Saudi Arabia: a Saudi woman or young Saudi person standing proudly in a beautiful Saudi landscape overlooking a modern Saudi city, gently holding the Saudi flag, warm sunlight, authentic Saudi architecture and palms integrated naturally. The emotion is deep love and belonging to the homeland, not a generic family scene.";
   }
   if(primary.name==="فخر"){
     scene="A majestic Saudi achievement scene: a confident Saudi young woman or young man standing in the foreground with the Saudi flag, modern Riyadh skyline and iconic Saudi architecture behind them, subtle palm and sword symbolism, dramatic golden light, visual language of pride, dignity and national achievement.";
   }
   if(primary.name==="أمل"){
     scene="A hopeful Saudi future: a young Saudi student looking toward a luminous sunrise over a modern sustainable Saudi city, green landscapes and subtle Saudi heritage elements, the flag flowing naturally, atmosphere of hope and possibility.";
   }
   if(primary.name==="طموح"){
     scene="A visionary Saudi innovation scene: young Saudi talent in a modern technology and innovation environment, elegant futuristic Saudi architecture, sustainable green landscape, Riyadh skyline, Saudi flag integrated naturally, visual feeling of ambition and progress.";
   }
   if(primary.name==="مستقبل"){
     scene="A sophisticated vision of Saudi Arabia's future: young Saudi innovators, clean futuristic architecture, sustainable green spaces, advanced technology represented visually without screens full of text, Riyadh skyline and Saudi flag, optimistic cinematic atmosphere.";
   }
   if(primary.name==="اعتزاز"){
     scene="A refined Saudi heritage scene: authentic Najdi architecture, traditional Saudi clothing, elegant Saudi geometric patterns, palm trees and Saudi flag, blended with one subtle modern Saudi element. The mood is authentic cultural pride, dignity and continuity.";
   }
   if(primary.name==="امتنان"){
     scene="A warm, elegant Saudi hospitality scene: authentic Saudi home or heritage setting, a welcoming gesture and traditional coffee service, tasteful Saudi textiles, warm light, palms and the flag subtly present. The feeling is gratitude, generosity and appreciation for homeland and people.";
   }
   if(primary.name==="فرح"){
     scene="A joyful but sophisticated Saudi National Day celebration: Saudi families and young people only if the written feeling suggests community, tasteful green illumination, Saudi flags, elegant public space, subtle celebratory lights, genuine happiness and national pride. Avoid carnival or generic festival aesthetics.";
   }

   var prompt=`Create ONE original premium artwork for a Saudi National Day 96 school exhibition in Saudi Arabia, 2026.

OFFICIAL CONTEXT:
- Event: Saudi National Day 96, 2026.
- Official 2026 identity: "عزّنا بطبعنا".
- The visual identity celebrates authentic Saudi character and values such as courage, vision, authenticity, determination, generosity and hospitality.
- This is NOT Founding Day and NOT National Day 95.

THE PARTICIPANT'S FEELING:
"${feelings}"
Selected emotions: ${chips||"none"}
Primary emotion: ${primary.name}.
Secondary emotion: ${secondary.name}.

VISUAL STORY:
${scene}

${variant}
Blend the secondary emotion subtly. The participant's words must influence the scene, mood, focal subject, lighting and symbolism. Do not simply place many Saudi symbols together. Tell ONE coherent visual story. Prioritize the participant's exact feeling over generic Saudi symbols; use at most 3 supporting national elements and one clear focal subject. Never combine unrelated mosque/family/palm/desert/skyline clichés just to signal Saudi Arabia.

SAUDI IDENTITY:
Use an accurate Saudi green-and-white flag as a natural part of the scene. Draw visual inspiration from the OFFICIAL 2026 National Day identity: Saudi geometric line work and refined textile-inspired patterns, with an elegant green-and-white national palette. Saudi palm trees and subtle crossed-swords/palm symbolism may appear where appropriate. Use authentic Saudi clothing, architecture, landscape or modern Saudi innovation according to the feeling. The image must unmistakably read as Saudi Arabia and specifically Saudi National Day 96 through a deliberate national-day visual concept: Saudi green-and-white national palette, authentic Saudi environment, one strong Saudi subject/story, and refined 2026 identity-inspired geometric/textile motifs. It must feel like a commissioned National Day 96 campaign image, not a generic Saudi tourism picture.

ART DIRECTION:
PHOTOREALISTIC PREMIUM EDITORIAL PHOTOGRAPHY / CINEMATIC REAL-WORLD SCENE, not cartoon and not a digital illustration. Sophisticated professional exhibition image, natural Saudi people only when the feeling calls for people, authentic Saudi clothing and architecture, realistic skin and anatomy, physically plausible lighting, realistic materials, shallow depth of field where appropriate, documentary/editorial quality, cinematic composition, rich but restrained Saudi green accents, atmospheric depth, emotionally moving. The image should look like a real professional photograph captured in Saudi Arabia for a National Day 96 exhibition. Avoid clip-art, children's cartoon style, stock-photo look, generic AI collage, generic mosque poster, or a repetitive family-and-mosque template.

STRICT EXCLUSIONS:
No text anywhere in the generated artwork. No Arabic letters. No English letters. No numbers. No slogans. No logos. No watermark. No signs with writing. No distorted typography.
Do NOT depict National Day 95. Do NOT depict Founding Day brown/beige branding. Do NOT make a mosque the main subject unless the participant's text explicitly asks for it. Do NOT force a mosque, family, fireworks, desert and palm trees into every image. Use only the elements that support the participant's feeling. Never make a generic family portrait the default. Never make a mosque the default. Never make a cartoon. Never make a collage.
The application will add the exact official wording after generation.`;

   // FLUX.2 [dev] requires multipart/form-data WITH the generated boundary.
   // We serialize FormData through a Request so Cloudflare receives the correct content-type.
   var form=new FormData();
   form.append("prompt",prompt);
   form.append("steps","25");
   form.append("width","1024");
   form.append("height","1024");
   form.append("guidance","3.5");
   var formRequest=new Request("https://image-generation.invalid",{method:"POST",body:form});
   var result=await env.AI.run(MODEL,{multipart:{body:formRequest.body,contentType:formRequest.headers.get("content-type")}});

   if(!result||!result.image)throw Error("خدمة الصور لم تُرجع صورة.");
   return Response.json({image:"data:image/jpeg;base64,"+result.image,emotion:primary.name});
  }catch(e){return err(e.message||"حدث خطأ أثناء إنشاء اللوحة",500)}
 }

 return new Response(HTML,{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store"}});
}};

