const MODEL = "@cf/black-forest-labs/flux-1-schnell";

const HTML = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>شعوري.. لوحة 🎨</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;background:linear-gradient(135deg,#f7fbf8,#eef6f1 45%,#fff);color:#17352b}.wrap{max-width:900px;margin:auto;padding:22px 16px 40px}.hero{background:linear-gradient(135deg,#075c43,#13805e);color:#fff;border-radius:28px;padding:28px 22px;text-align:center;box-shadow:0 18px 45px #0b6b4f22}.badge{display:inline-block;background:#ffffff22;border:1px solid #ffffff55;padding:8px 16px;border-radius:999px;margin-bottom:12px}h1{margin:6px 0;font-size:34px}.sub{font-size:17px}.card{background:#fff;border:1px solid #dfeae4;border-radius:24px;padding:22px;margin-top:18px;box-shadow:0 12px 35px #17352b12}label{display:block;font-weight:700;margin:8px 0}input,textarea{width:100%;border:1px solid #cddbd4;border-radius:16px;padding:14px;font:inherit;outline:none;background:#fbfdfc}textarea{min-height:135px;resize:vertical}.chips{display:flex;flex-wrap:wrap;gap:9px;margin:10px 0 18px}.chip{border:1px solid #c9dcd3;background:#f4f9f6;border-radius:999px;padding:9px 14px;cursor:pointer}.chip.on{background:#0b6b4f;color:#fff;border-color:#0b6b4f}button{border:0;border-radius:16px;padding:14px 20px;font:inherit;font-weight:700;cursor:pointer}.primary{width:100%;background:#0b6b4f;color:#fff;font-size:18px}.primary:disabled{opacity:.55}.status{text-align:center;padding:12px;display:none}.result img{width:100%;display:block;border-radius:20px}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.actions button{background:#edf5f1;color:#0b6b4f}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.gitem{border:1px solid #dfeae4;border-radius:18px;padding:8px;background:#fff}.gitem img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:13px}.gname{font-size:13px;margin:7px 3px;color:#527065}.empty{text-align:center;color:#71877e;padding:25px}footer{text-align:center;color:#71877e;font-size:13px;margin-top:22px;line-height:1.8}.loading{text-align:center;color:#527065;padding:15px}
</style>
</head>
<body>
<div class="wrap">
<section class="hero"><div class="badge">🇸🇦 اليوم الوطني 96</div><h1>شعوري.. لوحة 🎨</h1><div class="sub">وطن بعيون الذكاء الاصطناعي 🇸🇦</div></section>

<section class="card">
<label>اسم المشاركة / المعلمة</label>
<input id="name" placeholder="اكتبي الاسم">
<label>اختاري المشاعر التي تعبّر عنك</label>
<div class="chips">${["فخر","انتماء","أمل","طموح","امتنان","مستقبل","اعتزاز","فرح"].map(x=>`<button type="button" class="chip" data-v="${x}">${x}</button>`).join("")}</div>
<label>اكتبي شعورك تجاه وطنك</label>
<textarea id="feelings" placeholder="مثال: أشعر بالفخر والانتماء لوطني، وأرى مستقبله مليئًا بالطموح والإنجاز..."></textarea>
<button id="go" class="primary">🎨 ارسم شعوري</button>
<div id="status" class="status"></div>
</section>

<section id="result" class="card result" style="display:none">
<h2>لوحتك التعبيرية ✨</h2>
<img id="art" alt="لوحة مولدة بالذكاء الاصطناعي">
<div class="actions"><button id="save">💾 حفظ في المعرض المشترك</button><button id="download">⬇️ تحميل اللوحة</button></div>
</section>

<section class="card"><h2>🖼️ معرض اللوحات المشترك</h2><div id="gallery" class="gallery"><div class="loading">جاري تحميل المعرض...</div></div></section>
<footer>المدرسة المتوسطة السابعة والأربعون · إدارة تعليم المدينة المنورة<br>إعداد وتنفيذ: جوهره الجابري</footer>
</div>

<script>
const chips=[...document.querySelectorAll(".chip")],statusEl=document.getElementById("status");
let currentImage="";
chips.forEach(c=>c.onclick=()=>c.classList.toggle("on"));
function msg(t){statusEl.textContent=t;statusEl.style.display="block"}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
async function render(){
  const g=document.getElementById("gallery");
  try{
    const r=await fetch("/api/gallery",{cache:"no-store"});
    const a=await r.json();
    if(!r.ok) throw Error(a.error||"تعذر تحميل المعرض");
    g.innerHTML=a.length?a.map(x=>'<div class="gitem"><img src="'+x.image+'" alt="لوحة"><div class="gname">'+esc(x.name||"مشاركة")+'</div></div>').join(""):'<div class="empty">لم تُحفظ لوحات بعد 🌿</div>';
  }catch(e){g.innerHTML='<div class="empty">تعذر تحميل المعرض الآن.</div>'}
}
render();

document.getElementById("go").onclick=async()=>{
 const feelings=document.getElementById("feelings").value.trim();
 const name=document.getElementById("name").value.trim();
 const selected=chips.filter(c=>c.classList.contains("on")).map(c=>c.dataset.v);
 if(!feelings){msg("اكتبي شعورك أولًا 🌷");return}
 const b=document.getElementById("go");b.disabled=true;
 msg("🎨 الذكاء الاصطناعي يرسم شعورك الآن... قد يستغرق قليلًا");
 try{
   const r=await fetch("/api/generate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({feelings,name,chips:selected.join("، ")})});
   const d=await r.json().catch(()=>({error:"تعذر قراءة استجابة الخادم"}));
   if(!r.ok||!d.image)throw Error(d.error||"تعذر إنشاء اللوحة");
   currentImage=d.image;
   document.getElementById("art").src=currentImage;
   document.getElementById("result").style.display="block";
   msg("✨ اكتملت اللوحة! يمكنك حفظها في المعرض المشترك أو تحميلها.");
   document.getElementById("result").scrollIntoView({behavior:"smooth"});
 }catch(e){msg("⚠️ "+e.message)}finally{b.disabled=false}
};

document.getElementById("save").onclick=async()=>{
 if(!currentImage)return;
 const name=document.getElementById("name").value.trim()||"مشاركة";
 const b=document.getElementById("save");b.disabled=true;
 msg("💚 جارٍ حفظ اللوحة في المعرض المشترك...");
 try{
   const r=await fetch("/api/gallery",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({image:currentImage,name})});
   const d=await r.json().catch(()=>({error:"تعذر قراءة الاستجابة"}));
   if(!r.ok)throw Error(d.error||"تعذر حفظ اللوحة");
   await render();
   msg("💚 تم حفظ اللوحة في المعرض المشترك لجميع زائرات الموقع.");
 }catch(e){msg("⚠️ "+e.message)}finally{b.disabled=false}
};

document.getElementById("download").onclick=()=>{
 if(!currentImage)return;
 const a=document.createElement("a");a.href=currentImage;a.download="شعوري-لوحة.jpg";a.click()
};
</script>
</body></html>`;

const emotionMap={
 "فخر":"pride, dignity, achievement, national identity",
 "انتماء":"belonging, homeland roots, family warmth, cultural identity",
 "أمل":"hope, renewal, sunrise, bright horizon",
 "طموح":"ambition, progress, innovation, achievement",
 "امتنان":"gratitude, warmth, peaceful joy, cherished heritage",
 "مستقبل":"future, technology, sustainable development, modern Saudi life",
 "اعتزاز":"honor, heritage pride, cultural dignity",
 "فرح":"joy, celebration, festive warmth, happiness"
};
const keywordMap={
 "فخر":"فخر","فخورة":"فخر","افتخار":"فخر","اعتزاز":"اعتزاز","عز":"اعتزاز",
 "انتماء":"انتماء","أنتمي":"انتماء","وطن":"انتماء","وطني":"انتماء",
 "أمل":"أمل","الأمل":"أمل","مستقبل":"مستقبل","مستقبلنا":"مستقبل",
 "طموح":"طموح","طموحي":"طموح","تطور":"مستقبل","تقدم":"طموح","إنجاز":"فخر",
 "امتنان":"امتنان","شكر":"امتنان","فرح":"فرح","سعادة":"فرح","سعيد":"فرح"
};

function jsonError(message,status=500){return Response.json({error:message},{status});}

export default {async fetch(request,env){
  const url=new URL(request.url);

  if(url.pathname==="/api/gallery" && request.method==="GET"){
    try{
      if(!env.GALLERY)return jsonError("ربط GALLERY غير موجود في إعدادات Worker.",500);
      const listed=await env.GALLERY.list({prefix:"art:"});
      const items=await Promise.all(listed.keys.map(async k=>{
        const v=await env.GALLERY.get(k.name,"json");
        return v;
      }));
      return Response.json(items.filter(Boolean).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)));
    }catch(e){return jsonError(e?.message||"تعذر تحميل المعرض",500)}
  }

  if(url.pathname==="/api/gallery" && request.method==="POST"){
    try{
      if(!env.GALLERY)return jsonError("ربط GALLERY غير موجود في إعدادات Worker.",500);
      const body=await request.json();
      const image=String(body.image||"");
      const name=String(body.name||"مشاركة").trim().slice(0,80)||"مشاركة";
      if(!image.startsWith("data:image/"))return jsonError("صيغة الصورة غير صحيحة.",400);
      if(image.length>12000000)return jsonError("الصورة كبيرة جدًا للحفظ في المعرض.",413);

      const id="art:"+Date.now()+"-"+crypto.randomUUID();
      const item={image,name,createdAt:Date.now()};
      await env.GALLERY.put(id,JSON.stringify(item));

      const listed=await env.GALLERY.list({prefix:"art:"});
      if(listed.keys.length>20){
        const all=await Promise.all(listed.keys.map(async k=>{
          const v=await env.GALLERY.get(k.name,"json");
          return {key:k.name,createdAt:v?.createdAt||0};
        }));
        all.sort((a,b)=>b.createdAt-a.createdAt);
        for(const old of all.slice(20)) await env.GALLERY.delete(old.key);
      }
      return Response.json({ok:true});
    }catch(e){return jsonError(e?.message||"تعذر حفظ اللوحة",500)}
  }

  if(url.pathname==="/api/generate" && request.method==="POST"){
    try{
      const body=await request.json();
      const feelings=String(body.feelings||"").trim();
      const chips=String(body.chips||"").trim();
      if(!feelings)return jsonError("يرجى كتابة الشعور أولاً",400);

      const detected=[];
      Object.keys(keywordMap).forEach(k=>{
        if(feelings.includes(k)&&!detected.includes(keywordMap[k]))detected.push(keywordMap[k]);
      });
      const selected=(chips+"، "+detected.join("، ")).split("،").map(x=>x.trim()).filter(Boolean);
      const emotionText=selected.map(x=>emotionMap[x]||"").filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).join("; ")
        || "pride, belonging and hope";

      const dominant=selected[0]||"فخر";

      const prompt=`Create ONE original, coherent Saudi National Day 96 artwork inspired primarily by the participant's own feelings.
Participant feelings: ${feelings}
Selected emotions: ${chips||"فخر، انتماء، أمل"}
Dominant emotion: ${dominant}
Visual mood: ${emotionText}

Translate the written feelings into a clear visual story, not a generic repeated city scene. Choose a composition that fits the emotion. Saudi identity may appear through relevant combinations of the Saudi green-and-white flag, crossed swords and palm symbol, Saudi people and families, authentic Najdi heritage architecture, date palms, modern Riyadh, achievement and innovation, and respectful symbolic national leadership imagery when appropriate. Do not force every symbol into every image.

For pride/honor: dignified flag, heritage, achievement and strong composition.
For belonging: Saudi family/community, warmth, culture and homeland connection.
For hope: sunrise, bright horizon, renewal and calm optimism.
For ambition/future: young Saudi innovators, modern Riyadh, technology and sustainability.
For gratitude: peaceful heritage, family warmth and meaningful national symbols.
For joy: tasteful National Day celebration and fireworks.
For heritage: Najdi architecture, traditional culture, palms and historical atmosphere.

Premium photorealistic fine-art editorial photography, cinematic lighting, realistic Saudi architecture, natural human proportions, elegant composition, high detail. Vary the scene and composition on every generation. No written words, slogans, logos or watermark. Avoid generic mosque-city-fireworks repetition; use fireworks only for joy/celebration.`;

      const result=await env.AI.run(MODEL,{
        prompt,
        steps:4
      });

      if(!result||!result.image)throw Error("خدمة الصور لم تُرجع صورة. تحققي من سجل التنفيذ في Cloudflare.");
      return Response.json({image:"data:image/jpeg;base64,"+result.image});
    }catch(e){
      return jsonError(e?.message||"حدث خطأ أثناء إنشاء اللوحة",500);
    }
  }

  return new Response(HTML,{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store"}});
}};

