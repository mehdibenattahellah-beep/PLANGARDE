/* ====================================================================
   AMIU6 GARDES — app.js  (mode démo 100% local, aucun backend requis)
   ==================================================================== */

/* ---------- Référentiels ---------- */
const SPECIALITES = [
  "Anesthésie-Réanimation","Médecine interne","Cardiologie","Pneumologie",
  "Néphrologie","Gastro-entérologie","Neurologie","Endocrinologie","Hématologie",
  "Chirurgie générale","Chirurgie viscérale","Traumatologie-Orthopédie","Urologie",
  "Neurochirurgie","Gynéco-obstétrique","Pédiatrie","Urgences","Réanimation",
  "Radiologie","ORL","Ophtalmologie","Dermatologie","Psychiatrie","Maladies infectieuses"
];
const GRADES = ["Interne","Résident","Professeur"];

/* ---------- Marque (double-croix AMIUM6) ---------- */
function markSVG(size){
  return `<img class="markImg" src="assets/amiu6-cross.png" width="${size}" height="${size}" alt="AMIUM6" draggable="false">`;
}
function wordmark(){ return `<span class="ami">AMI</span><span class="um">UM6</span>`; }

/* ====================================================================
   DONNÉES DÉMO — médecins internes / résidents / profs (CHU Mohammed 6)
   ==================================================================== */
const demo = {
  medecins: [
    {id:"m1", nom:"Dr Mehdi Benattahellah", specialite:"Anesthésie-Réanimation", grade:"Interne",    telephone:"0612345678", pin:"123456"},
    {id:"m2", nom:"Dr Rim Alaoui",          specialite:"Cardiologie",            grade:"Résident",    telephone:"0698765432", pin:"123456"},
    {id:"m3", nom:"Dr Youssef Tazi",        specialite:"Urgences",               grade:"Interne",     telephone:"0655443322", pin:"123456"},
    {id:"m4", nom:"Pr Hicham Bakkali",      specialite:"Anesthésie-Réanimation", grade:"Professeur",  telephone:"0661122334", pin:"123456"},
    {id:"m5", nom:"Dr Salma Idrissi",       specialite:"Pédiatrie",              grade:"Résident",    telephone:"0677889900", pin:"123456"},
    {id:"m6", nom:"Dr Imane Cherkaoui",     specialite:"Gynéco-obstétrique",     grade:"Résident",    telephone:"0612009988", pin:"123456"},
    {id:"m7", nom:"Dr Anas El Fassi",       specialite:"Traumatologie-Orthopédie",grade:"Interne",    telephone:"0644556677", pin:"123456"},
    {id:"m8", nom:"Dr Nada Bennani",        specialite:"Médecine interne",       grade:"Interne",     telephone:"0633221100", pin:"123456"},
    {id:"m9", nom:"Pr Karim Sebti",         specialite:"Chirurgie viscérale",    grade:"Professeur",  telephone:"0661777888", pin:"123456"},
    {id:"m10",nom:"Dr Ghita Lahlou",        specialite:"Neurologie",             grade:"Résident",    telephone:"0699112233", pin:"123456"},
    {id:"m11",nom:"Dr Othmane Berrada",     specialite:"Urgences",               grade:"Résident",    telephone:"0612348765", pin:"123456"},
    {id:"m12",nom:"Dr Sofia Naciri",        specialite:"Réanimation",            grade:"Interne",     telephone:"0655009988", pin:"123456"},
    {id:"m13",nom:"Dr Reda Mansouri",       specialite:"Cardiologie",            grade:"Interne",     telephone:"0644112299", pin:"123456"},
    {id:"m14",nom:"Dr Hajar Ouazzani",      specialite:"Pneumologie",            grade:"Résident",    telephone:"0677123456", pin:"123456"},
    {id:"m15",nom:"Pr Leila Ziani",         specialite:"Pédiatrie",              grade:"Professeur",  telephone:"0661334455", pin:"123456"},
    {id:"m16",nom:"Dr Amine Saadi",         specialite:"Néphrologie",            grade:"Interne",     telephone:"0633445566", pin:"123456"},
    {id:"m17",nom:"Dr Khadija El Amrani",   specialite:"Gynéco-obstétrique",     grade:"Interne",     telephone:"0612556677", pin:"123456"},
    {id:"m18",nom:"Dr Walid Chraibi",       specialite:"Traumatologie-Orthopédie",grade:"Résident",   telephone:"0699887766", pin:"123456"},
  ],
  roles: [
    {id:"r1",  specialite:"Anesthésie-Réanimation",     nom:"Garde résidentielle",  type:"garde"},
    {id:"r2",  specialite:"Anesthésie-Réanimation",     nom:"Astreinte sénior",     type:"astreinte"},
    {id:"r3",  specialite:"Cardiologie",                nom:"Garde de nuit",        type:"garde"},
    {id:"r4",  specialite:"Cardiologie",                nom:"Astreinte USIC",       type:"astreinte"},
    {id:"r5",  specialite:"Cardiologie",                nom:"Avis & consultations", type:"jour"},
    {id:"r6",  specialite:"Pédiatrie",                  nom:"Garde",                type:"garde"},
    {id:"r7",  specialite:"Pédiatrie",                  nom:"Astreinte néonat",     type:"astreinte"},
    {id:"r8",  specialite:"Urgences",                   nom:"Box urgences",         type:"urgences"},
    {id:"r9",  specialite:"Urgences",                   nom:"Déchocage / SAUV",     type:"urgences"},
    {id:"r10", specialite:"Gynéco-obstétrique",         nom:"Garde maternité",      type:"garde"},
    {id:"r11", specialite:"Traumatologie-Orthopédie",   nom:"Garde traumato",       type:"garde"},
    {id:"r12", specialite:"Médecine interne",           nom:"Garde de médecine",    type:"garde"},
    {id:"r13", specialite:"Chirurgie viscérale",        nom:"Astreinte opératoire", type:"astreinte"},
    {id:"r14", specialite:"Neurologie",                 nom:"Garde / UNV",          type:"garde"},
    {id:"r15", specialite:"Réanimation",                nom:"Garde réa",            type:"garde"},
    {id:"r16", specialite:"Pneumologie",                nom:"Astreinte",            type:"astreinte"},
    {id:"r17", specialite:"Néphrologie",                nom:"Astreinte dialyse",    type:"astreinte"},
  ],
  affectations: []
};

/* ---------- Génération d'affectations autour d'aujourd'hui ---------- */
(function seedDemo(){
  const t = new Date();
  const iso = d => { const x=new Date(d); return new Date(x.getTime()-x.getTimezoneOffset()*6e4).toISOString().slice(0,10); };
  const day = off => { const d=new Date(t); d.setDate(t.getDate()+off); return iso(d); };
  let n = 0;
  const add = (med, role, d1, d2, note) => {
    const r = demo.roles.find(x=>x.id===role);
    demo.affectations.push({id:"a"+(n++), medecin_id:med, specialite:r.specialite, role_id:role, date_debut:d1, date_fin:d2||d1, note:note||null});
  };
  // AUJOURD'HUI bien rempli
  add("m1","r1",  day(0), day(0));
  add("m4","r2",  day(-1),day(2), "Astreinte semaine");
  add("m2","r3",  day(0), day(0));
  add("m13","r5", day(0), day(0));
  add("m3","r8",  day(0), day(0), "Bip 4521");
  add("m11","r9", day(0), day(0));
  add("m5","r6",  day(0), day(0));
  add("m15","r7", day(0), day(3), "Néonat");
  add("m6","r10", day(0), day(0), "2e ligne");
  add("m7","r11", day(0), day(0));
  add("m8","r12", day(0), day(0));
  add("m12","r15",day(0), day(0));
  // J+1 → J+12 — pour peupler le calendrier
  add("m2","r3",  day(1), day(1));
  add("m13","r3", day(2), day(2));
  add("m3","r8",  day(1), day(1));
  add("m11","r8", day(2), day(2));
  add("m11","r9", day(1), day(1));
  add("m1","r1",  day(2), day(2));
  add("m12","r15",day(1), day(1));
  add("m5","r6",  day(1), day(1));
  add("m6","r10", day(1), day(1));
  add("m17","r10",day(2), day(2));
  add("m7","r11", day(2), day(2));
  add("m18","r11",day(1), day(1));
  add("m10","r14",day(0), day(0));
  add("m10","r14",day(3), day(3));
  add("m16","r17",day(0), day(5), "Astreinte dialyse");
  add("m14","r16",day(1), day(4), "Astreinte pneumo");
  add("m9","r13", day(2), day(6), "Bloc viscéral");
  add("m8","r12", day(3), day(3));
  add("m2","r3",  day(5), day(5));
  add("m3","r8",  day(4), day(4));
  add("m5","r6",  day(4), day(4));
  add("m6","r10", day(6), day(6));
  add("m12","r15",day(5), day(5));
  // J-2 / J-3 (passé proche)
  add("m13","r3", day(-1),day(-1));
  add("m11","r8", day(-1),day(-1));
  add("m1","r1",  day(-2),day(-2));
})();

/* ====================================================================
   COUCHE DONNÉES (démo locale)
   ==================================================================== */
/* ====================================================================
   1) CONFIGURATION — clés Supabase (Settings > API du projet AMIUM6)
      Pour repasser en mode démo : remettre "VOTRE_URL" / "VOTRE_CLE".
   ==================================================================== */
const SUPABASE_URL      = "https://eswkzyflwhmoyejpyhgp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzd2t6eWZsd2htb3llanB5aGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTczNzcsImV4cCI6MjA5NTYzMzM3N30.3tUGwkRI1RbEUG2_jPGVRO3e6VCThxxKuqr4C4Vslxo";

const CONFIGURED = !SUPABASE_URL.includes("VOTRE_") && !SUPABASE_ANON_KEY.includes("VOTRE_");
let sb = null;
if (CONFIGURED && window.supabase) {
  try { sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }
  catch(e){ console.warn("Supabase init échouée, repli démo", e); }
}
const ONLINE = ()=>!!sb;

let SESSION_TOKEN = null;
function demoUser(id){
  const m = demo.medecins.find(x=>x.id===id);
  return m ? {ok:true,token:"demo-"+id,id:m.id,nom:m.nom,specialite:m.specialite,grade:m.grade,telephone:m.telephone}
           : {ok:false,error:"Introuvable"};
}

/* ====================================================================
   2) COUCHE DONNÉES — Supabase (RPC) si configuré, sinon démo locale
   ==================================================================== */
const DB = {
  async _rpc(fn,args){
    const {data,error}=await sb.rpc(fn,args);
    if(error){
      if((error.message||"").indexOf("SESSION")>-1){ onSessionExpired(); return {ok:false,error:"Session expirée"}; }
      return {ok:false,error:error.message};
    }
    return data;
  },
  async login(nom,pin){
    if(sb) return this._rpc("login",{p_nom:nom,p_pin:pin});
    const m = demo.medecins.find(x=>x.nom.toLowerCase()===nom.trim().toLowerCase());
    if(!m) return {ok:false,error:"Nom introuvable"};
    if(m.pin!==pin) return {ok:false,error:"Code PIN incorrect"};
    return demoUser(m.id);
  },
  async creer(nom,spec,grade,tel,pin,invite){
    if(sb) return this._rpc("creer_compte",{p_nom:nom,p_specialite:spec,p_grade:grade,p_telephone:tel,p_pin:pin,p_invite:invite});
    if(pin.length!==6) return {ok:false,error:"Le PIN doit faire 6 chiffres"};
    if(demo.medecins.some(m=>m.nom.toLowerCase()===nom.trim().toLowerCase())) return {ok:false,error:"Ce nom existe déjà"};
    const id="m"+(demo.medecins.length+1);
    demo.medecins.push({id,nom:nom.trim(),specialite:spec,grade,telephone:tel,pin});
    return demoUser(id);
  },
  async verifierSession(token){
    if(sb) return this._rpc("verifier_session",{p_token:token});
    return demoUser((token||"").replace("demo-",""));
  },
  async deconnexion(token){
    if(sb) return this._rpc("deconnexion",{p_token:token});
    return {ok:true};
  },
  async annuaire(){
    if(sb){ const d=await this._rpc("get_annuaire",{p_token:SESSION_TOKEN}); return Array.isArray(d)?d:[]; }
    return [...demo.medecins].map(({pin,...r})=>r).sort((a,b)=>a.nom.localeCompare(b.nom,'fr'));
  },
  async affectations(start,end){
    if(sb){ const d=await this._rpc("get_affectations",{p_token:SESSION_TOKEN,p_start:start,p_end:end}); return Array.isArray(d)?d:[]; }
    return demo.affectations.filter(a=>!(a.date_fin<start||a.date_debut>end)).map(a=>{
      const m=demo.medecins.find(x=>x.id===a.medecin_id)||{};
      const r=demo.roles.find(x=>x.id===a.role_id)||{};
      return {...a,nom:m.nom,grade:m.grade,telephone:m.telephone,role_nom:r.nom,role_type:r.type};
    });
  },
  async inscrire(type,debut,fin,note){
    if(sb) return this._rpc("inscrire_simple",{p_token:SESSION_TOKEN,p_type:type,p_debut:debut,p_fin:fin,p_note:note});
    const nomRole = type==="garde"?"Garde":type==="urgences"?"Urgences":"Astreinte";
    let r = demo.roles.find(x=>x.specialite===state.user.specialite && x.type===type);
    if(!r){ r={id:"r"+Date.now(),specialite:state.user.specialite,nom:nomRole,type}; demo.roles.push(r); }
    demo.affectations.push({id:"a"+Date.now(),medecin_id:state.user.id,specialite:state.user.specialite,role_id:r.id,date_debut:debut,date_fin:fin,note:note||null});
    return {ok:true};
  },
  async supprimer(id){
    if(sb) return this._rpc("supprimer_affectation",{p_token:SESSION_TOKEN,p_id:id});
    demo.affectations = demo.affectations.filter(a=>!(a.id===id && a.medecin_id===state.user.id));
    return {ok:true};
  },
  async changerPin(oldPin,newPin){
    if(sb) return this._rpc("changer_pin",{p_token:SESSION_TOKEN,p_old_pin:oldPin,p_new_pin:newPin});
    const m=demo.medecins.find(x=>x.id===state.user.id);
    if(!m||m.pin!==oldPin) return {ok:false,error:"PIN actuel incorrect"};
    m.pin=newPin; return {ok:true};
  },
  async changerSpec(pin,spec){
    if(sb) return this._rpc("changer_specialite",{p_token:SESSION_TOKEN,p_pin:pin,p_specialite:spec});
    const m=demo.medecins.find(x=>x.id===state.user.id);
    if(!m||m.pin!==pin) return {ok:false,error:"PIN incorrect"};
    m.specialite=spec; return {ok:true};
  },
  async changerTel(pin,tel){
    if(sb) return this._rpc("changer_telephone",{p_token:SESSION_TOKEN,p_pin:pin,p_telephone:tel});
    const m=demo.medecins.find(x=>x.id===state.user.id);
    if(!m||m.pin!==pin) return {ok:false,error:"PIN incorrect"};
    m.telephone=tel; return {ok:true};
  }
};

/* ====================================================================
   ÉTAT + HELPERS
   ==================================================================== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={
  user:null, tab:"today", sel:new Date(), cal:new Date(), gType:"garde",
  todayFilter:"all", dirFilter:"all", annuaire:[], dayGardes:[],
  todayLayout:"spec",  // spec | type | flat  (piloté par Tweaks)
};

const ISO=d=>{const x=new Date(d);return new Date(x.getTime()-x.getTimezoneOffset()*6e4).toISOString().slice(0,10);};
const daysBetween=(a,b)=>Math.round((new Date(b+"T00:00:00")-new Date(a+"T00:00:00"))/864e5);
const TORDER={garde:0,urgences:1,astreinte:2,jour:3};
const TYPE_LABEL={garde:"Gardes",urgences:"Urgences",astreinte:"Astreintes",jour:"Jour / consultations"};
const initials=n=>n.replace(/^(Pr\.?|Dr\.?)\s*/i,'').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const fmtDay=d=>d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
const fmtDow=d=>d.toLocaleDateString('fr-FR',{weekday:'long'});
const fmtFull=d=>d.toLocaleDateString('fr-FR',{day:'numeric',month:'long'});
const fmtMonth=d=>d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
const sameDay=(a,b)=>ISO(a)===ISO(b);

function roleIcon(t){
  if(t==="garde")     return '<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M6 3v3.2L8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  if(t==="urgences")  return '<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1l5 9H1L6 1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 5v2.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="6" cy="9" r=".75" fill="currentColor"/></svg>';
  if(t==="astreinte") return '<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 2.2A3.8 3.8 0 1 0 9.8 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 4v2.2h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  if(t==="jour")      return '<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.5"/><path d="M6 1v1.3M6 9.7V11M1 6h1.3M9.7 6H11M2.5 2.5l.9.9M8.6 8.6l.9.9M9.5 2.5l-.9.9M3.4 8.6l-.9.9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
  return '';
}
function gradeSpan(g){return `<span class="grade-dot g-${g}">${g}</span>`;}
function fillSelect(el,arr,val){el.innerHTML=arr.map(x=>`<option ${x===val?'selected':''}>${x}</option>`).join('');}

function toast(msg){const t=$("#toast");t.innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>${msg}`;t.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove("show"),2200);}

function saveSession(){try{localStorage.setItem("amiu6_sess",JSON.stringify({user:state.user,token:SESSION_TOKEN}));}catch(e){}}
function clearSession(){try{localStorage.removeItem("amiu6_sess");}catch(e){}}

/* ====================================================================
   AUTH / GATE
   ==================================================================== */
function setAuthed(on){
  document.body.classList.toggle("authed",!!on);
  $("#tabMine").disabled=!on; $("#tabCompte").disabled=!on;
  const slot=$("#authSlot");
  if(on&&state.user){
    slot.innerHTML=`<button class="who"><span class="avatar">${initials(state.user.nom)}</span><span class="nm">${state.user.nom.replace(/^(Pr|Dr)\s/,'')}</span></button>`;
    slot.querySelector(".who").onclick=()=>switchTab("compte");
  }else slot.innerHTML="";
}
function gateError(m){const e=$("#gErr");e.innerHTML=`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16.5v.01"/></svg>${m}`;e.classList.add("show");}
function gateClearErr(){$("#gErr").classList.remove("show");}
function showGatePane(which){
  gateClearErr();
  $("#gLogin").style.display = which==="login"?"block":"none";
  $("#gReg").style.display   = which==="register"?"block":"none";
}
function applyAuth(r){
  state.user={id:r.id,nom:r.nom,specialite:r.specialite,grade:r.grade,telephone:r.telephone};
  SESSION_TOKEN=r.token; saveSession(); setAuthed(true); switchTab("today");
}
async function doLogin(){
  gateClearErr();
  const nom=$("#lNom").value.trim(),pin=$("#lPin").value.trim();
  if(!nom||!pin) return gateError("Renseigne ton nom et ton PIN.");
  const r=await DB.login(nom,pin);
  if(!r||!r.ok) return gateError((r&&r.error)||"Erreur de connexion");
  $("#lPin").value=""; applyAuth(r); toast("Connecté · "+r.nom.replace(/^(Pr|Dr)\s/,''));
}
async function doRegister(){
  gateClearErr();
  const nom=$("#rNom").value.trim(),spec=$("#rSpec").value,grade=$("#rGrade").value,
        tel=$("#rTel").value.trim(),pin=$("#rPin").value.trim(),invite=$("#rInvite").value.trim();
  if(!nom||!pin) return gateError("Nom et PIN obligatoires.");
  if(!/^[0-9]{6}$/.test(pin)) return gateError("Le PIN doit faire exactement 6 chiffres.");
  if(!invite) return gateError("Le code d'invitation est obligatoire.");
  const r=await DB.creer(nom,spec,grade,tel,pin,invite);
  if(!r||!r.ok) return gateError((r&&r.error)||"Erreur");
  applyAuth(r); toast("Compte créé · bienvenue !");
}
function demoEnter(){ applyAuth(demoUser("m1")); toast("Mode démo · Dr Benattahellah"); }
function logout(){
  if(sb&&SESSION_TOKEN) DB.deconnexion(SESSION_TOKEN);
  state.user=null;SESSION_TOKEN=null;clearSession();
  setAuthed(false);showGatePane("login");state.tab="today";
  toast("Déconnecté");
}
function onSessionExpired(){
  state.user=null;SESSION_TOKEN=null;clearSession();
  setAuthed(false);showGatePane("login");state.tab="today";
  gateError("Ta session a expiré, reconnecte-toi.");
}

/* ====================================================================
   RENDU — AUJOURD'HUI
   ==================================================================== */
async function renderToday(){
  const d=state.sel;
  $("#dDow").textContent=fmtDow(d);
  $("#dFull").textContent=fmtFull(d);
  $("#dTodayBtn").classList.toggle("is-today",sameDay(d,new Date()));

  const iso=ISO(d);
  state.dayGardes=await DB.affectations(iso,iso);
  const g=state.dayGardes;

  // résumé
  const c={garde:0,urgences:0,astreinte:0,jour:0};
  g.forEach(x=>c[x.role_type]=(c[x.role_type]||0)+1);
  $("#statG").textContent=c.garde;
  $("#statU").textContent=c.urgences;
  $("#statA").textContent=c.astreinte+c.jour;

  // pills spécialité
  const specs=[...new Set(g.map(x=>x.specialite))].sort((a,b)=>a.localeCompare(b,'fr'));
  const pills=$("#todayPills");
  pills.innerHTML=`<button class="pill ${state.todayFilter==='all'?'on':''}" data-f="all">Toutes · ${g.length}</button>`+
    specs.map(s=>`<button class="pill ${state.todayFilter===s?'on':''}" data-f="${s}">${s}</button>`).join('');
  pills.querySelectorAll(".pill").forEach(p=>p.onclick=()=>{state.todayFilter=p.dataset.f;renderToday();});

  let list=g;
  if(state.todayFilter!=='all') list=list.filter(x=>x.specialite===state.todayFilter);
  const box=$("#todayList");
  if(!list.length){box.innerHTML=emptyState("Aucune garde programmée ce jour");return;}

  if(state.todayLayout==="flat"){
    box.innerHTML=`<div class="spec-group">${
      list.slice().sort(sortAff).map(a=>affCard(a,true)).join('')}</div>`;
  } else if(state.todayLayout==="type"){
    box.innerHTML=groupBy(list,a=>a.role_type, Object.keys(TORDER),
      t=>`${TYPE_LABEL[t]||t}`, (t)=>`<span class="tag t-${t}" style="margin-left:2px">${roleIcon(t)}</span>`);
  } else {
    box.innerHTML=groupBy(list,a=>a.specialite,
      [...new Set(list.map(a=>a.specialite))].sort((a,b)=>a.localeCompare(b,'fr')),
      s=>s, ()=>'');
  }
}
function sortAff(a,b){return (TORDER[a.role_type]-TORDER[b.role_type])||a.nom.localeCompare(b.nom,'fr');}
function groupBy(list,keyFn,order,labelFn,extraFn){
  const groups={};
  list.forEach(a=>{const k=keyFn(a);(groups[k]=groups[k]||[]).push(a);});
  return order.filter(k=>groups[k]).map(k=>`
    <div class="spec-group">
      <div class="spec-title">${extraFn?extraFn(k):''}${labelFn(k)}<span class="ln"></span><span class="cnt">${groups[k].length}</span></div>
      ${groups[k].sort(sortAff).map(a=>affCard(a)).join('')}
    </div>`).join('');
}
function affCard(a,showSpec){
  const tel=a.telephone
    ? `<a class="callbtn" href="tel:${a.telephone}" aria-label="Appeler"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></a>`
    : `<span class="callbtn off"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72"/></svg></span>`;
  let hint='';
  if(a.date_debut!==a.date_fin){
    const total=daysBetween(a.date_debut,a.date_fin)+1;
    const idx=daysBetween(a.date_debut,ISO(state.sel))+1;
    if(idx>=1&&idx<=total) hint=`<span class="tag ghost">J${idx}/${total}</span>`;
  }
  const specLine = showSpec ? `<span class="tag ghost">${a.specialite}</span>` : '';
  return `<div class="gcard t-${a.role_type}">
    <div class="av">${initials(a.nom)}</div>
    <div class="info">
      <div class="nm">${a.nom}</div>
      <div class="meta">${gradeSpan(a.grade)}<span class="tag t-${a.role_type}">${roleIcon(a.role_type)}${a.role_nom}</span>${specLine}${hint}${a.note?`<span style="color:var(--faint)">· ${a.note}</span>`:''}</div>
    </div>${tel}</div>`;
}
function emptyState(t){return `<div class="empty"><div class="ic"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 15h.01M12 15h.01M16 15h.01" stroke-linecap="round"/></svg></div><p>${t}</p></div>`;}

/* ====================================================================
   RENDU — CALENDRIER
   ==================================================================== */
async function renderCal(){
  const y=state.cal.getFullYear(), m=state.cal.getMonth();
  $("#mLabel").textContent=fmtMonth(state.cal);
  const first=new Date(y,m,1), startISO=ISO(new Date(y,m,1)), endISO=ISO(new Date(y,m+1,0));
  const affs=await DB.affectations(startISO,endISO);
  // map date -> set of types
  const byDay={};
  affs.forEach(a=>{
    let s=new Date(a.date_debut+"T00:00:00"), e=new Date(a.date_fin+"T00:00:00");
    for(let dd=new Date(s); dd<=e; dd.setDate(dd.getDate()+1)){
      const k=ISO(dd); (byDay[k]=byDay[k]||new Set()).add(a.role_type);
    }
  });
  const dows=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  let html=dows.map(d=>`<div class="cal-dow">${d}</div>`).join('');
  let lead=(first.getDay()+6)%7;
  for(let i=0;i<lead;i++) html+=`<div class="cal-cell blank"></div>`;
  const dim=new Date(y,m+1,0).getDate();
  const todayISO=ISO(new Date()), selISO=ISO(state.sel);
  for(let dnum=1;dnum<=dim;dnum++){
    const k=ISO(new Date(y,m,dnum));
    const types=byDay[k]?[...byDay[k]]:[];
    const order={garde:0,urgences:1,astreinte:2,jour:3};
    types.sort((a,b)=>order[a]-order[b]);
    const dots=types.map(t=>`<span class="dot ${t==='urgences'?'u':t==='astreinte'?'a':t==='jour'?'j':''}"></span>`).join('');
    const cls=[k===todayISO?'today':'',k===selISO?'sel':''].filter(Boolean).join(' ');
    html+=`<div class="cal-cell ${cls}" data-d="${k}"><div class="cn">${dnum}</div><div class="dots">${dots}</div></div>`;
  }
  const grid=$("#calGrid"); grid.innerHTML=html;
  grid.querySelectorAll(".cal-cell[data-d]").forEach(c=>c.onclick=()=>openDay(c.dataset.d));
}
async function openDay(iso){
  const d=new Date(iso+"T00:00:00");
  const affs=(await DB.affectations(iso,iso)).sort(sortAff);
  $("#sheetTitle").textContent=fmtDay(d).replace(/^./,c=>c.toUpperCase());
  $("#sheetSub").textContent=affs.length?`${affs.length} garde${affs.length>1?'s':''} programmée${affs.length>1?'s':''}`:"Aucune garde ce jour";
  $("#sheetBody").innerHTML=affs.length
    ? groupBySpecSheet(affs)
    : emptyState("Aucune garde ce jour");
  $("#sheetGo").onclick=()=>{state.sel=d;closeSheet();switchTab("today");renderToday();};
  $("#sheetGo").style.display=affs.length?'flex':'flex';
  openSheet();
}
function groupBySpecSheet(list){
  const g={}; list.forEach(a=>{(g[a.specialite]=g[a.specialite]||[]).push(a);});
  return Object.keys(g).sort((a,b)=>a.localeCompare(b,'fr')).map(s=>`
    <div class="spec-group">
      <div class="spec-title">${s}<span class="ln"></span></div>
      ${g[s].sort(sortAff).map(a=>affCard(a)).join('')}
    </div>`).join('');
}

/* ====================================================================
   RENDU — ANNUAIRE
   ==================================================================== */
async function renderDir(){
  if(!state.annuaire.length) state.annuaire=await DB.annuaire();
  const specs=[...new Set(state.annuaire.map(m=>m.specialite))].sort((a,b)=>a.localeCompare(b,'fr'));
  const pills=$("#dirPills");
  pills.innerHTML=`<button class="pill ${state.dirFilter==='all'?'on':''}" data-f="all">Toutes</button>`+
    specs.map(s=>`<button class="pill ${state.dirFilter===s?'on':''}" data-f="${s}">${s}</button>`).join('');
  pills.querySelectorAll(".pill").forEach(p=>p.onclick=()=>{state.dirFilter=p.dataset.f;renderDir();});

  const q=($("#dirSearch").value||"").trim().toLowerCase();
  let list=state.annuaire;
  if(state.dirFilter!=='all') list=list.filter(m=>m.specialite===state.dirFilter);
  if(q) list=list.filter(m=>m.nom.toLowerCase().includes(q)||m.specialite.toLowerCase().includes(q));
  $("#dirCount").textContent=`${list.length} médecin${list.length>1?'s':''}`;
  const box=$("#dirList");
  box.innerHTML=list.length?list.map(m=>`
    <div class="acard">
      <div class="av">${initials(m.nom)}</div>
      <div class="info">
        <div class="nm">${m.nom}</div>
        <div class="meta">${gradeSpan(m.grade)}<span class="tag ghost">${m.specialite}</span></div>
      </div>
      ${m.telephone?`<a class="callbtn" href="tel:${m.telephone}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></a>`:''}
    </div>`).join(''):emptyState("Aucun médecin trouvé");
}

/* ====================================================================
   RENDU — MES GARDES
   ==================================================================== */
function renderMine(){
  const u=state.user; if(!u)return;
  $("#signupAv").textContent=initials(u.nom);
  $("#signupNom").textContent=u.nom;
  $("#signupSpec").textContent=`${u.grade} · ${u.specialite}`;
  if(!$("#gDate").value) $("#gDate").value=ISO(state.sel);
  renderMineList();
}
async function renderMineList(){
  const u=state.user; if(!u)return;
  const today=ISO(new Date());
  const all=await DB.affectations(today, ISO(new Date(Date.now()+1000*864e5)));
  const mine=all.filter(a=>a.medecin_id===u.id).sort((a,b)=>a.date_debut.localeCompare(b.date_debut));
  $("#mineSub").textContent=mine.length?`${mine.length} garde${mine.length>1?'s':''} à venir`:"Aucune garde à venir";
  const box=$("#mineList");
  box.innerHTML=mine.length?mine.map(a=>{
    const d=new Date(a.date_debut+"T00:00:00");
    const range=a.date_debut!==a.date_fin?` → ${new Date(a.date_fin+"T00:00:00").toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}`:'';
    return `<div class="mg-row">
      <div class="pin t-${a.role_type}">${roleIcon(a.role_type)}</div>
      <div><div class="d">${d.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'long'})}${range}</div>
      <div class="s">${a.role_nom}${a.note?` · ${a.note}`:''}</div></div>
      <button class="x" data-id="${a.id}" aria-label="Supprimer"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
    </div>`;
  }).join(''):`<div class="empty"><p style="margin-top:6px">Tu n'as pas encore de garde programmée.</p></div>`;
  box.querySelectorAll(".x").forEach(b=>b.onclick=async()=>{
    if(!confirm("Supprimer cette garde ?"))return;
    await DB.supprimer(b.dataset.id); toast("Garde supprimée"); renderMineList();
    if(state.tab==="today")renderToday();
  });
}
function setGType(t){
  state.gType=t;
  $$("#gTypeToggle button").forEach(b=>{b.classList.toggle("on",b.dataset.v===t);b.classList.toggle("u",b.dataset.v==="urgences");b.classList.toggle("a",b.dataset.v==="astreinte");});
  const range=t==="astreinte";
  $("#gDateSingleWrap").style.display=range?"none":"block";
  $("#gDateRangeWrap").style.display=range?"block":"none";
}
async function addGarde(){
  $("#addErr").classList.remove("show");
  const t=state.gType, note=$("#gNote").value.trim();
  let debut,fin;
  if(t==="astreinte"){
    debut=$("#gDebut").value; fin=$("#gFin").value||debut;
    if(!debut)return showAddErr("Choisis une date de début.");
    if(fin<debut)return showAddErr("La date de fin doit suivre le début.");
  }else{
    debut=$("#gDate").value; fin=debut;
    if(!debut)return showAddErr("Choisis une date.");
  }
  await DB.inscrire(t,debut,fin,note);
  $("#gNote").value="";
  toast("Inscription enregistrée");
  renderMineList(); renderToday();
}
function showAddErr(m){const e=$("#addErr");e.innerHTML=`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16.5v.01"/></svg>${m}`;e.classList.add("show");}

/* ====================================================================
   RENDU — COMPTE
   ==================================================================== */
function renderCompte(){
  const u=state.user; if(!u)return;
  $("#compteSub").textContent=u.nom;
  $("#compteInfos").innerHTML=`
    <div class="signup-as" style="margin-bottom:0">
      <div class="av">${initials(u.nom)}</div>
      <div><div class="t2">${u.nom}</div><div class="t3">${u.grade} · ${u.specialite}</div></div>
    </div>
    <div class="info-row"><span class="k">Téléphone</span><span class="v">${u.telephone||'—'}</span></div>
    <div class="info-row"><span class="k">Spécialité</span><span class="v">${u.specialite}</span></div>
    <div class="info-row"><span class="k">Grade</span><span class="v">${u.grade}</span></div>`;
  fillSelect($("#newSpec"),SPECIALITES,u.specialite);
  $("#newTel").value=u.telephone||"";
}

/* ====================================================================
   NAVIGATION
   ==================================================================== */
function switchTab(tab){
  if((tab==="mine"||tab==="compte")&&!state.user)return;
  state.tab=tab;
  $$(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  $$("section").forEach(s=>s.classList.toggle("show",s.id===tab));
  window.scrollTo({top:0,behavior:"instant"});
  if(tab==="today")renderToday();
  if(tab==="cal")renderCal();
  if(tab==="dir")renderDir();
  if(tab==="mine")renderMine();
  if(tab==="compte")renderCompte();
}

/* sheet */
function openSheet(){$("#overlay").classList.add("show");}
function closeSheet(){$("#overlay").classList.remove("show");}

/* ====================================================================
   THÈME
   ==================================================================== */
function applyTheme(t){
  document.documentElement.setAttribute("data-theme",t);
  try{localStorage.setItem("amiu6_theme",t);}catch(e){}
}
function toggleTheme(){
  const cur=document.documentElement.getAttribute("data-theme")==="dark"?"dark":"light";
  applyTheme(cur==="dark"?"light":"dark");
}

/* ====================================================================
   INIT
   ==================================================================== */
function buildBrand(){
  $$("[data-mark]").forEach(el=>el.innerHTML=markSVG(+el.dataset.mark||30));
  $$("[data-wordmark]").forEach(el=>el.innerHTML=wordmark());
}
function bindEvents(){
  // tabs
  $$(".tabs button").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
  // theme
  $("#themeBtn").onclick=toggleTheme;
  // today nav
  $("#dPrev").onclick=()=>{state.sel=new Date(state.sel.getTime()-864e5);renderToday();};
  $("#dNext").onclick=()=>{state.sel=new Date(state.sel.getTime()+864e5);renderToday();};
  $("#dTodayBtn").onclick=()=>{state.sel=new Date();renderToday();};
  // cal nav
  $("#mPrev").onclick=()=>{state.cal=new Date(state.cal.getFullYear(),state.cal.getMonth()-1,1);renderCal();};
  $("#mNext").onclick=()=>{state.cal=new Date(state.cal.getFullYear(),state.cal.getMonth()+1,1);renderCal();};
  // dir
  $("#dirSearch").oninput=()=>renderDir();
  // sheet
  $("#overlay").onclick=e=>{if(e.target===$("#overlay"))closeSheet();};
  $("#sheetClose").onclick=closeSheet;
  // mine
  $$("#gTypeToggle button").forEach(b=>b.onclick=()=>setGType(b.dataset.v));
  $("#gAdd").onclick=addGarde;
  // compte
  $("#saveSpecBtn").onclick=async()=>{
    $("#specErr").classList.remove("show");
    const pin=$("#specPin").value.trim(),spec=$("#newSpec").value;
    const r=await DB.changerSpec(pin,spec);
    if(!r.ok){$("#specErr").textContent=r.error;$("#specErr").classList.add("show");return;}
    state.user.specialite=spec;saveSession();$("#specPin").value="";toast("Spécialité mise à jour");renderCompte();
  };
  $("#saveTelBtn").onclick=async()=>{
    $("#telErr").classList.remove("show");
    const pin=$("#telPin").value.trim(),tel=$("#newTel").value.trim();
    const r=await DB.changerTel(pin,tel);
    if(!r.ok){$("#telErr").textContent=r.error;$("#telErr").classList.add("show");return;}
    state.user.telephone=tel;saveSession();$("#telPin").value="";toast("Téléphone mis à jour");renderCompte();
  };
  $("#changePinBtn").onclick=async()=>{
    $("#pinErr").classList.remove("show");
    const o=$("#oldPin").value.trim(),n=$("#newPin").value.trim(),n2=$("#newPin2").value.trim();
    if(!/^[0-9]{6}$/.test(n))return setPinErr("Le nouveau PIN doit faire 6 chiffres.");
    if(n!==n2)return setPinErr("Les deux PIN ne correspondent pas.");
    const r=await DB.changerPin(o,n);
    if(!r.ok)return setPinErr(r.error);
    $("#oldPin").value=$("#newPin").value=$("#newPin2").value="";toast("PIN modifié");
  };
  $("#logoutBtn").onclick=logout;
  // gate
  $("#lBtn").onclick=doLogin;
  $("#rBtn").onclick=doRegister;
  $("#toReg").onclick=()=>showGatePane("register");
  $("#toLog").onclick=()=>showGatePane("login");
  $("#demoBtn").onclick=demoEnter;
  $("#lPin").addEventListener("keydown",e=>{if(e.key==="Enter")doLogin();});
}
function setPinErr(m){$("#pinErr").textContent=m;$("#pinErr").classList.add("show");}

function init(){
  buildBrand();
  // theme
  let th="light"; try{th=localStorage.getItem("amiu6_theme")||"light";}catch(e){}
  applyTheme(th);
  // selects gate
  fillSelect($("#rSpec"),SPECIALITES,"Médecine interne");
  fillSelect($("#rGrade"),GRADES,"Interne");
  setGType("garde");
  bindEvents();
  // masque le bloc "démo" si on est connecté à Supabase
  if(sb){ const gd=$("#gateDemo"); if(gd) gd.style.display="none"; }
  // session
  loadSession();
}
async function loadSession(){
  let sess=null; try{sess=JSON.parse(localStorage.getItem("amiu6_sess")||"null");}catch(e){}

  if(sb){
    // --- Mode connecté (Supabase) ---
    if(!sess||!sess.token){ setAuthed(false); showGatePane("login"); return; }
    const r=await DB.verifierSession(sess.token);
    if(r&&r.ok){
      state.user={id:r.id,nom:r.nom,specialite:r.specialite,grade:r.grade,telephone:r.telephone};
      SESSION_TOKEN=sess.token; saveSession(); setAuthed(true); switchTab("today");
    }else{
      clearSession(); setAuthed(false); showGatePane("login");
    }
    return;
  }

  // --- Mode démo (hors-ligne) ---
  if(sess&&sess.user){ state.user=sess.user; SESSION_TOKEN=sess.token; setAuthed(true); switchTab("today"); }
  else { demoEnter(); }
}
document.addEventListener("DOMContentLoaded",init);

/* exposé pour le panneau Tweaks */
window.markSVG=markSVG;
window.AMIU6={
  setTodayLayout(v){state.todayLayout=v;if(state.tab==="today")renderToday();},
  setDensity(v){document.documentElement.style.setProperty("--dens",v);},
  setTheme(t){applyTheme(t);},
};
