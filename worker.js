const MODEL = "@cf/black-forest-labs/flux-1-schnell";

const HTML = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>شعوري.. لوحة 🎨</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Tahoma,Arial,sans-serif;background:linear-gradient(135deg,#f7fbf8,#eef6f1 45%,#fdfdfb);color:#17352b}
.wrap{max-width:900px;margin:auto;padding:22px 16px 40px}
.hero{background:linear-gradient(135deg,#0b6b4f,#13805e);color:#fff;border-radius:28px;padding:28px 22px;text-align:center;box-shadow:0 18px 45px #0b6b4f22}
.badge{display:inline-block;background:#ffffff22;border:1px solid #ffffff55;padding:8px 16px;border-radius:999px;margin-bottom:12px}
h1{margin:6px 0;font-size:34px}.sub{font-size:17px}
.card{background:#fff;border:1px solid #dfeae4;border-radius:24px;padding:22px;margin-top:18px;box-shadow:0 12px 35px #17352b12}
label{display:block;font-weight:700;margin:8px 0}
input,textarea{width:100%;border:1px solid #cddbd4;border-radius:16px;padding:14px;font:inherit;outline:none;background:#fbfdfc}
textarea{min-height:135px;resize:vertical}
.chips{display:flex;flex-wrap:wrap;gap:9px;margin:10px 0 18px}
.chip{border:1px solid #c9dcd3;background:#f4f9f6;border-radius:999px;padding:9px 14px;cursor:pointer}
.chip.on{background:#0b6b4f;color:#fff}
button{border:0;border-radius:16px;padding:14px 20px;font:inherit;font-weight:700;cursor:pointer}
.primary{width:100%;background:#0b6b4f;color:#fff;font-size:18px}.primary:disabled{opacity:.55}
.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.actions button{background:#edf5f1;color:#0b6b4f}
.status{text-align:center;padding:12px;display:none}
.result img{width:100%;display:block;border-radius:20px}
.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
.gitem{border:1px solid #dfeae4;border-radius:18px;padding:8px}.gitem img{width:100%;border-radius:13px}
.gname{font-size:13px;margin:7px 3px;color:#527065}.empty{text-align:center;color:#71877e;padding:25px}
footer{text-align:center;color:#71877e;font-size:13px;margin-top:22px;line-height:1.8}
</style>
</head>
<body>
<div class="wrap">
<section class="hero">
<div class="badge">🇸🇦 اليوم الوطني 96</div>
<h1>شعوري.. لوحة 🎨</h1>
<div class="sub">وطن بعيون الذكاء الاصطناعي 🇸🇦</div>
</section>

<section class="card">
<label>اسم المشاركة / المعلمة</label>
<input id="name" placeholder="اكتبي الاسم">

<label>اختاري المشاعر التي تعبّر عنك</label>
<div class="chips">
<button type="button" class="chip" data-v="فخر">فخر</button>
<button type="button" class="chip" data-v="انتماء">انتماء</button>
<button type="button" class="chip" data-v="أمل">أمل</button>
<button type="button" class="chip" data-v="طموح">طموح</button>
<button type="button" class="chip" data-v="امتنان">امتنان</button>
<button type="button" class="chip" data-v="مستقبل">مستقبل</button>
<button type="button" class="chip" data-v="اعتزاز">اعتزاز</button>
<button type="button" class="chip" data-v="فرح">فرح</button>
</div>

<label>اكتبي شعورك تجاه وطنك</label>
<textarea id="feelings" placeholder="مثال: أشعر بالفخر والانتماء لوطني، وأرى مستقبله مليئًا بالطموح والإنجاز..."></textarea>
<button id="go" class="primary">🎨 ارسم شعوري</button>
<div id="status" class="status"></div>
</section>

<section id="result" class="card result" style="display:none">
<h2>لوحتك التعبيرية ✨</h2>
<img id="art" alt="لوحة مولدة بالذكاء الاصطناعي">
<div class="actions">
<button id="save">💾 حفظ في المعرض</button>
<button id="download">⬇️ تحميل اللوحة</button>
</div>
</section>

<section class="card">
<h2>🖼️ معرض اللوحات</h2>
<div id="gallery" class="gallery"></div>
</section>

<footer>المدرسة المتوسطة السابعة والأربعون · إدارة تعليم المدينة المنورة<br>إعداد وتنفيذ: جوهره الجابري</footer>
</div>

<script>
const chips = Array.from(document.querySelectorAll(".chip"));
const statusBox = document.getElementById("status");
let currentImage = "";

chips.forEach(function(chip){
  chip.onclick = function(){ chip.classList.toggle("on"); };
});

function showStatus(text){
  statusBox.textContent = text;
  statusBox.style.display = "block";
}

function getGallery(){
  try{
    return JSON.parse(localStorage.getItem("sh3ory_gallery") || "[]");
  }catch(e){ return []; }
}

function drawGallery(){
  const items = getGallery();
  const box = document.getElementById("gallery");
  if(!items.length){
    box.innerHTML = '<div class="empty">لم تُحفظ لوحات بعد 🌿</div>';
    return;
  }
  box.innerHTML = "";
  items.forEach(function(item){
    const div = document.createElement("div");
    div.className = "gitem";
    const img = document.createElement("img");
    img.src = item.image;
    const name = document.createElement("div");
    name.className = "gname";
    name.textContent = item.name || "مشاركة";
    div.appendChild(img);
    div.appendChild(name);
    box.appendChild(div);
  });
}

drawGallery();

document.getElementById("go").onclick = async function(){
  const feelings = document.getElementById("feelings").value.trim();
  const name = document.getElementById("name").value.trim();
  const selected = chips.filter(function(c){return c.classList.contains("on");})
    .map(function(c){return c.dataset.v;});

  if(!feelings){
    showStatus("اكتبي شعورك أولًا 🌷");
    return;
  }

  const button = document.getElementById("go");
  button.disabled = true;
  showStatus("🎨 الذكاء الاصطناعي يرسم شعورك الآن...");

  try{
    const response = await fetch("/api/generate",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({feelings:feelings,name:name,chips:selected.join("، ")})
    });

    const data = await response.json().catch(function(){
      return {error:"تعذر قراءة الاستجابة"};
    });

    if(!response.ok || !data.image){
      throw new Error(data.error || "تعذر إنشاء اللوحة");
    }

    currentImage = data.image;
    document.getElementById("art").src = currentImage;
    document.getElementById("result").style.display = "block";
    showStatus("✨ اكتملت اللوحة!");
    document.getElementById("result").scrollIntoView({behavior:"smooth"});
  }catch(error){
    showStatus("⚠️ " + (error.message || "حدث خطأ أثناء إنشاء اللوحة"));
  }finally{
    button.disabled = false;
  }
};

document.getElementById("save").onclick = function(){
  if(!currentImage)return;
  const items = getGallery();
  items.unshift({
    image:currentImage,
    name:document.getElementById("name").value.trim() || "مشاركة"
  });
  try{
    localStorage.setItem("sh3ory_gallery",JSON.stringify(items.slice(0,20)));
    drawGallery();
    showStatus("💚 تم حفظ اللوحة في معرض هذا الجهاز.");
  }catch(e){
    showStatus("⚠️ مساحة التخزين لا تكفي.");
  }
};

document.getElementById("download").onclick = function(){
  if(!currentImage)return;
  const link = document.createElement("a");
  link.href = currentImage;
  link.download = "شعوري-لوحة.jpg";
  link.click();
};
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const body = await request.json();
        const feelings = String(body.feelings || "").trim();
        const chips = String(body.chips || "").trim();

        if (!feelings) {
          return Response.json({error:"يرجى كتابة الشعور أولاً"},{status:400});
        }

        const emotionMap = {
          "فخر":"pride, dignity, achievement, national celebration",
          "انتماء":"belonging, roots, connection to homeland, warmth",
          "أمل":"hope, sunrise, renewal, bright future",
          "طموح":"ambition, progress, innovation, rising horizons",
          "امتنان":"gratitude, warmth, cherished heritage, peaceful joy",
          "مستقبل":"future, technology, modern cities, sustainable growth",
          "اعتزاز":"honor, heritage, confidence, cultural identity",
          "فرح":"joy, celebration, light, uplifting energy"
        };

        const selectedEmotions = chips
          .split("،")
          .map(function(v){ return v.trim(); })
          .filter(Boolean)
          .map(function(v){ return emotionMap[v] || "positive national emotion"; });

        const visualMood = selectedEmotions.length
          ? selectedEmotions.join("; ")
          : "pride, belonging, hope, ambition and joyful celebration";

        const visualDetails = selectedEmotions.length
          ? selectedEmotions.join("; ")
          : "pride, belonging, hope, ambition and joyful celebration";

        const prompt =
          "Create ONE cohesive, original, cinematic fine-art exhibition painting celebrating Saudi National Day 96. " +
          "Express the selected emotion visually: " + visualDetails + ". " +
          "Make the artwork feel like a premium museum-quality Saudi national celebration painting, not a cartoon and not a flat illustration. " +
          "Combine authentic Saudi heritage and modern transformation in a single harmonious panoramic scene: elegant date palms, dramatic Arabian desert and mountains, refined traditional mud-brick architecture, subtle heritage geometric motifs, a polished brass dallah, rich woven textiles, then naturally flowing into a luminous contemporary Saudi city skyline, modern architecture, advanced roads and a hopeful futuristic horizon. " +
          "Use deep emerald green, ivory, warm sand, bronze, teal and radiant golden-hour light. " +
          "Highly detailed realistic materials, cinematic depth, atmospheric perspective, volumetric sunlight, sophisticated painterly brushwork, rich shadows, realistic architecture, elegant composition, emotional visual storytelling, premium national-day exhibition artwork, breathtaking and original. " +
          "For pride, emphasize majestic scale, uplifting light, confident composition and a soaring sense of achievement. " +
          "For belonging, emphasize warm heritage details, family and community atmosphere, roots, place and emotional connection to homeland. " +
          "For hope, emphasize sunrise, renewal, young greenery, open horizons and a luminous modern future. " +
          "For ambition, emphasize progress, innovation, height and forward movement. " +
          "For joy, emphasize celebratory light, graceful movement and uplifting atmosphere. " +
          "Do not make a triptych, split panels, collage, poster, infographic, cartoon, anime, children's illustration or flat vector art. " +
          "Do not show a national flag, banners, signs or any object containing writing. Use only abstract flowing green fabric or green light as a national color reference. " +
          "Absolutely no text, no Arabic letters, no English letters, no words, no numbers, no calligraphy, no captions, no logos, no watermark, no signatures and no readable symbols. " +
          "The emotions must be communicated only through scenery, color, lighting, composition, people, heritage, development and visual symbolism.";

        const result = await env.AI.run(MODEL,{
          prompt:prompt,
          steps:8,
          seed:Math.floor(Math.random()*1000000000)
        });

        if(!result || !result.image){
          throw new Error("لم تُرجع خدمة الذكاء الاصطناعي صورة");
        }

        return Response.json({
          image:"data:image/jpeg;base64," + result.image
        });
      } catch(error) {
        return Response.json({
          error:error && error.message ? error.message : "حدث خطأ أثناء إنشاء اللوحة"
        },{status:500});
      }
    }

    return new Response(HTML,{
      headers:{"content-type":"text/html;charset=UTF-8"}
    });
  }
};
