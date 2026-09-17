const MODEL = "@cf/black-forest-labs/flux-1-schnell";

const HTML = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>شعوري.. لوحة 🎨</title><style>
*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;background:linear-gradient(135deg,#f7fbf8,#eef6f1 45%,#fff);color:#17352b}.wrap{max-width:900px;margin:auto;padding:22px 16px 40px}.hero{background:linear-gradient(135deg,#0b6b4f,#13805e);color:#fff;border-radius:28px;padding:28px 22px;text-align:center;box-shadow:0 18px 45px #0b6b4f22}.badge{display:inline-block;background:#ffffff22;border:1px solid #ffffff55;padding:8px 16px;border-radius:999px;margin-bottom:12px}h1{margin:6px 0;font-size:34px}.sub{font-size:17px}.card{background:#fff;border:1px solid #dfeae4;border-radius:24px;padding:22px;margin-top:18px;box-shadow:0 12px 35px #17352b12}label{display:block;font-weight:700;margin:8px 0}input,textarea{width:100%;border:1px solid #cddbd4;border-radius:16px;padding:14px;font:inherit;outline:none;background:#fbfdfc}textarea{min-height:135px;resize:vertical}.chips{display:flex;flex-wrap:wrap;gap:9px;margin:10px 0 18px}.chip{border:1px solid #c9dcd3;background:#f4f9f6;border-radius:999px;padding:9px 14px;cursor:pointer}.chip.on{background:#0b6b4f;color:#fff;border-color:#0b6b4f}button{border:0;border-radius:16px;padding:14px 20px;font:inherit;font-weight:700;cursor:pointer}.primary{width:100%;background:#0b6b4f;color:#fff;font-size:18px}.primary:disabled{opacity:.55}.status{text-align:center;padding:12px;display:none}.result img{width:100%;display:block;border-radius:20px}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.actions button{background:#edf5f1;color:#0b6b4f}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.gitem{border:1px solid #dfeae4;border-radius:18px;padding:8px;background:#fff}.gitem img{width:100%;border-radius:13px}.gname{font-size:13px;margin:7px 3px;color:#527065}.empty{text-align:center;color:#71877e;padding:25px}footer{text-align:center;color:#71877e;font-size:13px;margin-top:22px;line-height:1.8}
</style></head><body><div class="wrap"><section class="hero"><div class="badge">🇸🇦 اليوم الوطني 96</div><h1>شعوري.. لوحة 🎨</h1><div class="sub">وطن بعيون الذكاء الاصطناعي 🇸🇦</div></section><section class="card"><label>اسم المشاركة / المعلمة</label><input id="name" placeholder="اكتبي الاسم"><label>اختاري المشاعر التي تعبّر عنك</label><div class="chips">${["فخر","انتماء","أمل","طموح","امتنان","مستقبل","اعتزاز","فرح"].map(x=>`<button type="button" class="chip" data-v="${x}">${x}</button>`).join("")}</div><label>اكتبي شعورك تجاه وطنك</label><textarea id="feelings" placeholder="مثال: أشعر بالفخر والانتماء لوطني، وأرى مستقبله مليئًا بالطموح والإنجاز..."></textarea><button id="go" class="primary">🎨 ارسم شعوري</button><div id="status" class="status"></div></section><section id="result" class="card result" style="display:none"><h2>لوحتك التعبيرية ✨</h2><img id="art" alt="لوحة مولدة بالذكاء الاصطناعي"><div class="actions"><button id="save">💾 حفظ في المعرض</button><button id="download">⬇️ تحميل اللوحة</button></div></section><section class="card"><h2>🖼️ معرض اللوحات</h2><div id="gallery" class="gallery"></div></section><footer>المدرسة المتوسطة السابعة والأربعون · إدارة تعليم المدينة المنورة<br>إعداد وتنفيذ: جوهره الجابري</footer></div><script>
const chips=[...document.querySelectorAll('.chip')],statusEl=document.getElementById('status');let currentImage='';chips.forEach(c=>c.onclick=()=>c.classList.toggle('on'));function msg(t){statusEl.textContent=t;statusEl.style.display='block'}function getG(){try{return JSON.parse(localStorage.getItem('sh3ory_gallery')||'[]')}catch{return[]}}function render(){const g=document.getElementById('gallery'),a=getG();g.innerHTML=a.length?a.map(x=>'<div class="gitem"><img src="'+x.image+'" alt=""><div class="gname">'+(x.name||'مشاركة')+'</div></div>').join(''):'<div class="empty">لم تُحفظ لوحات بعد 🌿</div>'}render();document.getElementById('go').onclick=async()=>{const feelings=document.getElementById('feelings').value.trim(),name=document.getElementById('name').value.trim(),selected=chips.filter(c=>c.classList.contains('on')).map(c=>c.dataset.v);if(!feelings){msg('اكتبي شعورك أولًا 🌷');return}const b=document.getElementById('go');b.disabled=true;msg('🎨 الذكاء الاصطناعي يرسم شعورك الآن... قد يستغرق قليلًا');try{const r=await fetch('/api/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({feelings,name,chips:selected.join('، ')})}),d=await r.json().catch(()=>({error:'تعذر قراءة استجابة الخادم'}));if(!r.ok||!d.image)throw Error(d.error||'تعذر إنشاء اللوحة');currentImage=d.image;document.getElementById('art').src=currentImage;document.getElementById('result').style.display='block';msg('✨ اكتملت اللوحة! يمكنك حفظها أو تحميلها.');document.getElementById('result').scrollIntoView({behavior:'smooth'})}catch(e){msg('⚠️ '+e.message)}finally{b.disabled=false}};document.getElementById('save').onclick=()=>{if(!currentImage)return;const a=getG();a.unshift({image:currentImage,name:document.getElementById('name').value.trim()||'مشاركة'});try{localStorage.setItem('sh3ory_gallery',JSON.stringify(a.slice(0,20)));render();msg('💚 تم حفظ اللوحة في معرض هذا الجهاز.')}catch{msg('⚠️ مساحة التخزين لا تكفي لحفظ المزيد.')}};document.getElementById('download').onclick=()=>{if(!currentImage)return;const a=document.createElement('a');a.href=currentImage;a.download='شعوري-لوحة.jpg';a.click()};
</script></body></html>`;


export default {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==="/api/generate"&&request.method==="POST"){
    try{
      const body=await request.json();
      const feelings=String(body.feelings||"").trim();
      const chips=String(body.chips||"").trim();
      if(!feelings)return Response.json({error:"يرجى كتابة الشعور أولاً"},{status:400});
      const emotionMap={"فخر":"majestic national pride, achievement and dignity","انتماء":"deep belonging, homeland roots, family warmth and cultural identity","أمل":"hope, renewal, sunrise and a bright future","طموح":"ambition, progress, innovation and upward movement","امتنان":"gratitude, warmth, cherished heritage and peaceful joy","مستقبل":"future, technology, sustainable development and modern Saudi life","اعتزاز":"honor, heritage pride, Saudi identity and cultural dignity","فرح":"joy, festive celebration, luminous atmosphere and fireworks"};
      const keywordMap={"فخر":"فخر","فخورة":"فخر","افتخار":"فخر","اعتزاز":"اعتزاز","عز":"اعتزاز","انتماء":"انتماء","أنتمي":"انتماء","وطن":"انتماء","وطني":"انتماء","أمل":"أمل","الأمل":"أمل","مستقبل":"مستقبل","مستقبلنا":"مستقبل","طموح":"طموح","طموحي":"طموح","تطور":"مستقبل","تقدم":"طموح","إنجاز":"فخر","امتنان":"امتنان","شكر":"امتنان","فرح":"فرح","سعادة":"فرح","سعيد":"فرح"};
      const detected=[]; Object.keys(keywordMap).forEach(function(k){if(feelings.includes(k)&&detected.indexOf(keywordMap[k])===-1)detected.push(keywordMap[k]);});
      const chosen=(chips+"، "+detected.join("، ")).split("،").map(function(x){return x.trim()}).filter(Boolean);
      const mood=chosen.map(function(x){return emotionMap[x]||""}).filter(Boolean).filter(function(x,i,a){return a.indexOf(x)===i}).join("; ")||"national pride, belonging, hope and joyful celebration";
      const promptObj={
        scene:"Saudi Arabia on Saudi National Day 96, a believable real-world evening celebration in an authentic Saudi heritage district transitioning naturally toward modern Riyadh. Unmistakably Saudi, elegant, realistic, culturally grounded.",
        subjects:[
          {type:"Najdi heritage courtyard",description:"authentic At-Turaif-inspired mud-brick architecture, traditional geometric details, warm earth plaster, date palms, realistic proportions and materials",pose:"architectural focal point",position:"foreground"},
          {type:"modern Saudi city skyline",description:"realistic contemporary Riyadh skyline with clean glass and steel architecture, subtle city lights, physically plausible buildings",pose:"calm illuminated skyline",position:"background"},
          {type:"National Day celebration",description:"tasteful emerald-green and white architectural lighting, elegant festive installations and realistic fireworks in the evening sky",pose:"joyful national celebration",position:"background"}
        ],
        style:"photorealistic premium Saudi national campaign image, cinematic editorial photography, highly realistic materials and architecture, refined fine-art finish, believable physical world",
        color_palette:["emerald green","warm white","sand gold"],
        lighting:"blue-hour evening with warm architectural illumination, subtle green and white festive glow and realistic fireworks reflections",
        mood:mood,
        background:"coherent Saudi heritage-to-modern urban landscape; authentic and geographically believable; no generic international city",
        composition:"leading leads",
        camera:{angle:"eye level",distance:"wide shot",focus:"deep focus",lens:"35mm","f-number":"f/5.6",ISO:200},
        effects:["subtle film grain","soft bloom","natural atmospheric depth"]
      };
    const prompt = `
Create a beautiful original Saudi National Day artwork that visually translates the participant's feelings into a unique scene.

Participant feelings: ${feelings}
Selected emotions: ${chips || "pride, belonging, hope"}

The image must tell a visual story based on the feelings written by the participant, not simply repeat a generic Saudi city scene.

If the feeling is pride or honor: show a majestic Saudi flag, palm tree and crossed swords, heritage architecture, achievements and a powerful dignified composition.

If the feeling is belonging or love of الوطن: show Saudi people and families together, authentic Saudi culture, community, warmth, the green and white national identity.

If the feeling is hope: show a beautiful sunrise over Saudi Arabia, a young Saudi person looking toward a bright horizon, green landscapes and the Saudi flag.

If the feeling is ambition or future: show young Saudi innovators, modern Riyadh, futuristic architecture, technology, sustainability and a bright future.

If the feeling is joy or celebration: show Saudi families celebrating National Day with flags, elegant lights and fireworks.

If the feeling is heritage: show Najdi architecture, traditional Saudi clothing, palm trees, Arabian culture and historical atmosphere.

Blend the selected feelings naturally into the composition. Every generated image must have a different visual story and composition.

Saudi identity should be clear through the green and white colors, Saudi flag, palm tree, crossed swords, Saudi people, heritage and modern Saudi architecture.

Premium cinematic fine-art photography, photorealistic, emotionally powerful, elegant composition, realistic details, beautiful lighting, high quality.

Do not repeat the same city skyline, mosque and fireworks composition. Do not add fireworks unless the feeling is celebration or joy. No written words, no logos, no watermark, no distorted faces or architecture.
`; 

const result=await env.AI.run(MODEL,{
  prompt: prompt,
  steps: 4
}); 
      if(!result||!result.image)throw Error("خدمة الصور لم تُرجع صورة. تحققي من سجل التنفيذ في Cloudflare.");
      return Response.json({image:"data:image/jpeg;base64,"+result.image});
    }catch(e){return Response.json({error:e&&e.message?e.message:"حدث خطأ أثناء إنشاء اللوحة"},{status:500});}
  }
  return new Response(HTML,{headers:{"content-type":"text/html;charset=UTF-8"}});
}};
