/* ====================================================================
   AMIU6 GARDES — Panneau Tweaks (vanilla, protocole hôte)
   ==================================================================== */
(function(){
  const DEFAULTS={
    todayLayout:"spec",   // spec | type | flat
    density:"confort",    // confort | compact
    theme:"light",        // light | dark
    radius:18,
    accent:"amiu6"        // amiu6 | green | clinique
  };
  let T={...DEFAULTS};
  try{const s=JSON.parse(localStorage.getItem("amiu6_tweaks")||"null");if(s)T={...T,...s};}catch(e){}

  const ACCENTS={
    amiu6:{green:"#1B8A4B",greenInk:"#0F6135",greenSoft:"#E4F3EA",red:"#D9261C"},
    green:{green:"#0E7C57",greenInk:"#0A5C40",greenSoft:"#DDF1E8",red:"#C2473B"},
    clinique:{green:"#1F6FB0",greenInk:"#155488",greenSoft:"#E4EFFA",red:"#D9261C"}
  };

  function apply(){
    const root=document.documentElement.style;
    // layout
    if(window.AMIU6){window.AMIU6.setTodayLayout(T.todayLayout);}
    // density
    root.setProperty("--dens",T.density==="compact"?".82":"1");
    // radius
    root.setProperty("--radius",T.radius+"px");
    root.setProperty("--radius-sm",Math.max(8,T.radius-6)+"px");
    // accent
    const a=ACCENTS[T.accent]||ACCENTS.amiu6;
    root.setProperty("--green",a.green);
    root.setProperty("--green-ink",a.greenInk);
    root.setProperty("--green-soft",a.greenSoft);
    root.setProperty("--garde",a.green);
    root.setProperty("--garde-soft",a.greenSoft);
    root.setProperty("--primary",a.green);
    // theme
    if(window.AMIU6){window.AMIU6.setTheme(T.theme);}
    try{localStorage.setItem("amiu6_tweaks",JSON.stringify(T));}catch(e){}
  }
  function set(k,v){T[k]=v;apply();render();
    try{window.parent.postMessage({type:"__edit_mode_set_keys",keys:Object.keys(T)},"*");}catch(e){}
  }

  /* ---------- UI ---------- */
  const panel=document.createElement("div");
  panel.id="tweaksPanel";
  panel.innerHTML=`
    <style>
      #tweaksPanel{position:fixed;right:16px;bottom:16px;z-index:120;width:280px;max-width:calc(100vw - 32px);
        background:var(--surface);border:1px solid var(--border);border-radius:18px;
        box-shadow:var(--shadow-lg);font-family:"IBM Plex Sans",sans-serif;color:var(--ink);
        display:none;overflow:hidden;animation:tw-rise .26s cubic-bezier(.2,.8,.2,1) both}
      #tweaksPanel.open{display:block}
      @keyframes tw-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
      #tweaksPanel .tw-head{display:flex;align-items:center;gap:9px;padding:13px 15px;border-bottom:1px solid var(--border);cursor:grab}
      #tweaksPanel .tw-head .tw-mark{line-height:0}
      #tweaksPanel .tw-head h4{font-family:"Bricolage Grotesque";font-weight:800;font-size:14px;flex:1}
      #tweaksPanel .tw-x{width:28px;height:28px;border-radius:9px;border:1px solid var(--border);background:var(--surface-2);display:grid;place-items:center;color:var(--muted)}
      #tweaksPanel .tw-x:hover{color:var(--ink)}
      #tweaksPanel .tw-body{padding:13px 15px 16px;max-height:64vh;overflow-y:auto}
      #tweaksPanel .tw-sec{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin:14px 0 8px}
      #tweaksPanel .tw-sec:first-child{margin-top:0}
      #tweaksPanel .seg2{display:flex;gap:6px}
      #tweaksPanel .seg2 button{flex:1;padding:9px 4px;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);
        font-weight:600;font-size:12px;color:var(--muted);transition:.14s;font-family:inherit}
      #tweaksPanel .seg2 button.on{background:var(--green-soft);border-color:var(--green);color:var(--green-ink)}
      #tweaksPanel .tw-row{display:flex;align-items:center;gap:10px;margin-top:9px}
      #tweaksPanel .tw-row label{font-size:12.5px;font-weight:600;color:var(--muted);flex:1}
      #tweaksPanel input[type=range]{flex:1;accent-color:var(--green)}
      #tweaksPanel .tw-val{font-size:12px;font-weight:700;color:var(--ink);min-width:34px;text-align:right}
      #tweaksPanel .sw{display:flex;gap:7px}
      #tweaksPanel .sw button{width:30px;height:30px;border-radius:50%;border:2px solid transparent;cursor:pointer;position:relative}
      #tweaksPanel .sw button.on{border-color:var(--ink)}
    </style>
    <div class="tw-head" id="twHead">
      <span class="tw-mark" data-mark="22"></span>
      <h4>Tweaks</h4>
      <button class="tw-x" id="twClose">✕</button>
    </div>
    <div class="tw-body">
      <div class="tw-sec">Hiérarchie « Aujourd'hui »</div>
      <div class="seg2" data-grp="todayLayout">
        <button data-v="spec">Par spécialité</button>
        <button data-v="type">Par type</button>
        <button data-v="flat">Liste plate</button>
      </div>
      <div class="tw-sec">Densité</div>
      <div class="seg2" data-grp="density">
        <button data-v="confort">Confortable</button>
        <button data-v="compact">Compact</button>
      </div>
      <div class="tw-sec">Thème</div>
      <div class="seg2" data-grp="theme">
        <button data-v="light">Clair</button>
        <button data-v="dark">Sombre</button>
      </div>
      <div class="tw-sec">Couleur d'accent</div>
      <div class="sw" data-grp="accent">
        <button data-v="amiu6" style="background:#1B8A4B" title="AMIUM6"></button>
        <button data-v="green" style="background:#0E7C57" title="Vert profond"></button>
        <button data-v="clinique" style="background:#1F6FB0" title="Bleu clinique"></button>
      </div>
      <div class="tw-sec">Arrondi des cartes</div>
      <div class="tw-row">
        <input type="range" id="twRadius" min="6" max="26" step="1">
        <span class="tw-val" id="twRadiusVal"></span>
      </div>
    </div>`;
  document.body.appendChild(panel);
  if(window.AMIU6&&document.querySelector("[data-mark='22']")){
    // build mark via app helper if available
  }

  function render(){
    panel.querySelectorAll("[data-grp]").forEach(grp=>{
      const key=grp.dataset.grp;
      grp.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.v===T[key]));
    });
    panel.querySelector("#twRadius").value=T.radius;
    panel.querySelector("#twRadiusVal").textContent=T.radius+"px";
  }
  panel.querySelectorAll("[data-grp]").forEach(grp=>{
    grp.querySelectorAll("button").forEach(b=>b.onclick=()=>set(grp.dataset.grp,b.dataset.v));
  });
  panel.querySelector("#twRadius").oninput=e=>set("radius",+e.target.value);
  panel.querySelector("#twClose").onclick=()=>{
    panel.classList.remove("open");
    try{window.parent.postMessage({type:"__edit_mode_dismissed"},"*");}catch(e){}
  };

  // draggable
  (function drag(){
    const h=panel.querySelector("#twHead");let sx,sy,ox,oy,on=false;
    h.addEventListener("pointerdown",e=>{if(e.target.closest("#twClose"))return;on=true;sx=e.clientX;sy=e.clientY;const r=panel.getBoundingClientRect();ox=r.left;oy=r.top;panel.style.right="auto";panel.style.bottom="auto";panel.style.left=ox+"px";panel.style.top=oy+"px";h.setPointerCapture(e.pointerId);});
    h.addEventListener("pointermove",e=>{if(!on)return;panel.style.left=(ox+e.clientX-sx)+"px";panel.style.top=(oy+e.clientY-sy)+"px";});
    h.addEventListener("pointerup",e=>{on=false;});
  })();

  // host protocol
  window.addEventListener("message",e=>{
    const d=e.data||{};
    if(d.type==="__activate_edit_mode"){panel.classList.add("open");render();}
    else if(d.type==="__deactivate_edit_mode"){panel.classList.remove("open");}
  });
  function announce(){
    try{window.parent.postMessage({type:"__edit_mode_available",keys:Object.keys(T)},"*");}catch(e){}
  }

  // boot: render mark + apply
  function boot(){
    if(window.markSVG){const el=panel.querySelector("[data-mark='22']");if(el)el.innerHTML=window.markSVG(22);}
    apply();render();announce();
  }
  if(document.readyState==="complete"||document.readyState==="interactive") setTimeout(boot,60);
  else document.addEventListener("DOMContentLoaded",()=>setTimeout(boot,60));
})();
