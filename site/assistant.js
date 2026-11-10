/* Kit Permanence · assistant de prise de demande v2 (bulle + panneau). Piloté par window.SITE. */
(()=>{
const S=window.SITE||{};
const OWNER=S.owner,OCAP=S.owner_cap||S.owner,PHONE=S.phone,TEL=S.phone_intl,WA=S.whatsapp,BRAND=S.brand;
const DE=/^[aeiouyhéèê]/i.test(BRAND)?"d'":'de ';
const AVA=S.avatar||'';
const ZONES=S.zone_keys||[],ZONE_LABEL=S.zone_label||'';
const GAS='0 800 47 33 33',GAS_TEL='+33800473333';
const css=`
.pa-ava{width:32px;height:32px;border-radius:50%;flex:none;object-fit:cover}
.pa-fab{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));z-index:60;display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:var(--ink);color:#fff;font:700 16px/1 var(--f-body);padding:10px 18px 10px 10px;border-radius:999px;box-shadow:0 10px 30px rgba(3,47,107,.3)}
.pa-fab .av{position:relative;display:block}
.pa-fab .av img{width:46px;height:46px;border-radius:50%;object-fit:cover;display:block;box-shadow:0 0 0 2px #fff}
.pa-fab .av::before{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid #5AC8FA;animation:paring 2.6s ease-out infinite}
@keyframes paring{0%{transform:scale(.92);opacity:.9}100%{transform:scale(1.35);opacity:0}}
@media (prefers-reduced-motion:reduce){.pa-fab .av::before{animation:none;opacity:0}}
.pa-fab .av::after,.pa-h .av::after{content:"";position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:50%;background:#2FB36B;border:2px solid var(--ink)}
.pa-fab[aria-expanded=true]{display:none}
.pa-tease{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(84px + env(safe-area-inset-bottom));z-index:60;width:min(300px,calc(100vw - 32px));background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:16px 16px 4px 16px;padding:14px 38px 14px 14px;box-shadow:0 12px 30px rgba(3,47,107,.18);font-size:15px;line-height:1.4;cursor:pointer;animation:pa-pop .25s ease-out}
.pa-tease b{display:block;margin-bottom:2px}
.pa-tease button{position:absolute;top:6px;right:6px;border:0;background:none;color:var(--ink-2);font-size:18px;cursor:pointer;width:28px;height:28px}
.pa{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));z-index:61;width:min(410px,calc(100vw - 32px));height:min(640px,calc(100dvh - 32px));background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:22px;box-shadow:0 24px 60px rgba(3,47,107,.3);display:none;flex-direction:column;overflow:hidden}
.pa.open{display:flex}
@media (max-width:520px){.pa{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0;border:0}}
.pa-h{display:flex;align-items:center;gap:11px;padding:12px 12px 12px 14px;background:var(--ink);color:#fff}
.pa-h .av{position:relative;flex:none}
.pa-h .av img{width:44px;height:44px;border-radius:50%;object-fit:cover;display:block;box-shadow:0 0 0 2px rgba(255,255,255,.85)}
.pa-h strong{display:block;font-size:15.5px;line-height:1.2}
.pa-h small{display:block;font-size:12.5px;opacity:.85;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pa-h .tx{min-width:0;flex:1}
.pa-h a,.pa-h button{border:0;background:rgba(255,255,255,.14);color:#fff;font:700 13px var(--f-body);padding:9px 12px;border-radius:999px;text-decoration:none;cursor:pointer;white-space:nowrap}
.pa-prog{display:flex;gap:4px;padding:8px 14px;background:var(--paper);border-bottom:1px solid var(--line)}
.pa-prog i{flex:1;height:4px;border-radius:4px;background:var(--line);transition:background .3s}
.pa-prog i.on{background:var(--accent)}
.pa-m{flex:1;overflow-y:auto;padding:14px 12px 6px;display:flex;flex-direction:column;gap:8px;background:var(--paper)}
.pa-row{display:flex;gap:8px;align-items:flex-end;max-width:90%}
.pa-row.me{align-self:flex-end;justify-content:flex-end}
.pa-msg{padding:10px 13px;border-radius:16px;font-size:15px;line-height:1.45;white-space:pre-line;animation:pa-pop .2s ease-out}
.pa-row.bot .pa-msg{background:var(--card);border:1px solid var(--line);border-bottom-left-radius:5px}
.pa-row.me .pa-msg{background:var(--ink);color:#fff;border-bottom-right-radius:5px}
.pa-row .pa-ava{visibility:hidden}.pa-row.first .pa-ava{visibility:visible}
.pa-msg a{color:inherit;font-weight:700}
.pa-msg img.shot{display:block;max-width:180px;max-height:180px;border-radius:10px;margin-top:2px}
.pa-msg.bare{padding:0;background:none!important;border:0!important}
.pa-msg.warn{background:#FDECEA!important;border-color:#F3B8B0!important;color:#7A1E12}
.pa-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 14px;font-size:14px;display:grid;gap:4px}
.pa-card b{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--water)}
@keyframes pa-pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.pa-typing{align-self:flex-start;margin-left:38px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px 14px;display:flex;gap:4px}
.pa-typing i{width:6px;height:6px;border-radius:50%;background:var(--ink-2);animation:pa-blink 1s infinite}.pa-typing i:nth-child(2){animation-delay:.15s}.pa-typing i:nth-child(3){animation-delay:.3s}
@keyframes pa-blink{0%,80%,100%{opacity:.25}40%{opacity:1}}
.pa-c{display:flex;gap:8px;padding:8px 12px;overflow-x:auto;scrollbar-width:none;background:var(--paper)}.pa-c::-webkit-scrollbar{display:none}.pa-c:empty{display:none}
.pa-chip{flex:none;border:1px solid var(--line);background:var(--card);color:var(--ink);font:600 13.5px var(--f-body);padding:8px 12px;border-radius:999px;cursor:pointer}
.pa-chip.urg{border-color:color-mix(in srgb,#C0392B 45%,var(--line));color:#B03A2E}
.pa-chip.pri{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.pa-f{display:flex;gap:8px;padding:10px 12px 4px;border-top:1px solid var(--line);align-items:center}
.pa-f input[type=text]{flex:1;min-width:0;border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:999px;padding:12px 16px;font:16px var(--f-body)}
.pa-f button{border:0;width:46px;height:46px;border-radius:50%;cursor:pointer;display:grid;place-items:center;flex:none}
.pa-f .send{background:var(--accent);color:var(--accent-ink)}
.pa-f .cam{background:var(--soft);color:var(--ink)}
.pa-r{font-size:11.5px;color:var(--ink-2);padding:2px 14px calc(10px + env(safe-area-inset-bottom));text-align:center}
.pa-r a{color:inherit}
@media (max-width:760px){body.has-mbar .pa-fab{bottom:calc(84px + env(safe-area-inset-bottom));padding:5px;gap:0;font-size:0}body.has-mbar .pa-fab .av img{width:54px;height:54px}body.has-mbar .pa-tease{bottom:calc(152px + env(safe-area-inset-bottom))}}
@media (prefers-reduced-motion:reduce){.pa-msg,.pa-tease{animation:none}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

const icCam='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
const icSend='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const avImg=AVA?`<img src="${AVA}" alt="">`:'';
const fab=document.createElement('button');fab.type='button';fab.className='pa-fab';fab.setAttribute('aria-expanded','false');fab.setAttribute('aria-controls','pa');
fab.innerHTML=`<span class="av">${avImg}</span>Écrire à ${OWNER}`;
const panel=document.createElement('div');panel.className='pa';panel.id='pa';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Écrire à '+OWNER);
panel.innerHTML=`<div class="pa-h"><span class="av">${avImg}</span><div class="tx"><strong>Votre assistante</strong><small>Assistante virtuelle · en ligne</small></div><a href="tel:${TEL}">Appeler</a><button type="button" class="pa-x" aria-label="Fermer">✕</button></div>
<div class="pa-prog" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
<div class="pa-m" aria-live="polite"></div><div class="pa-c"></div>
<div class="pa-f"><button type="button" class="cam" aria-label="Envoyer une photo du problème">${icCam}</button><input type="text" placeholder="Décrivez votre problème…" aria-label="Votre message" enterkeyhint="send" autocomplete="off"><button type="button" class="send" aria-label="Envoyer">${icSend}</button>
<input type="file" accept="image/*" hidden></div>
<div class="pa-r">Vos informations servent uniquement à traiter votre demande. <a href="mentions-legales.html#donnees">En savoir plus</a></div>`;
document.body.append(fab,panel);
const $m=panel.querySelector('.pa-m'),$c=panel.querySelector('.pa-c'),$i=panel.querySelector('input[type=text]'),$file=panel.querySelector('input[type=file]'),$prog=[...panel.querySelectorAll('.pa-prog i')];
let started=false,tease=null;
const ss={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};
function open(opts){hideTease();ss.set('pa-seen','1');panel.classList.add('open');fab.setAttribute('aria-expanded','true');
  if(!started){started=true;if(opts&&opts.photo){photoFirst()}else hello()}else if(opts&&opts.photo){$file.click()}
  setTimeout(()=>$i.focus({preventScroll:true}),60)}
function close(){panel.classList.remove('open');fab.setAttribute('aria-expanded','false');fab.focus({preventScroll:true})}
window.paOpen=open;
fab.addEventListener('click',()=>open());panel.querySelector('.pa-x').addEventListener('click',close);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))close()});
document.querySelectorAll('[data-open-assistant]').forEach(b=>b.addEventListener('click',()=>open({photo:b.hasAttribute('data-photo')})));

/* bulle d'accroche : une fois par session, après 14 s, jamais si l'assistant a déjà été ouvert */
function hideTease(){if(tease){tease.remove();tease=null}}
if(!ss.get('pa-seen')&&!ss.get('pa-tease')){setTimeout(()=>{if(started||ss.get('pa-seen'))return;ss.set('pa-tease','1');
  tease=document.createElement('div');tease.className='pa-tease';tease.setAttribute('role','status');
  tease.innerHTML=`<b>Un souci de plomberie ?</b>Décrivez-le en 30 secondes, ou envoyez une photo : ${OWNER} est prévenu tout de suite.<button type="button" aria-label="Fermer">✕</button>`;
  tease.addEventListener('click',e=>{if(e.target.tagName==='BUTTON'){hideTease();return}open()});document.body.append(tease)},14000)}

const lead={type:null,urgent:false,ville:null,nom:null,tel:null,creneau:null,detail:null,photo:null,photoAsked:false};
let step=null,gen=0,lastWho=null;
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap=s=>s.replace(/(^|[\s\-'])\S/g,m=>m.toUpperCase());
function progress(){const done=[lead.type||lead.photo,lead.ville,lead.nom,lead.tel,lead.creneau].filter(Boolean).length;$prog.forEach((p,i)=>p.classList.toggle('on',i<done))}
function add(html,who,cls){who=who||'bot';const row=document.createElement('div');row.className='pa-row '+who+(lastWho!==who?' first':'');lastWho=who;
  if(who==='bot'&&AVA){const a=document.createElement('img');a.className='pa-ava';a.src=AVA;a.alt='';row.append(a)}
  const d=document.createElement('div');d.className='pa-msg'+(cls?' '+cls:'');d.innerHTML=html;row.append(d);$m.appendChild(row);$m.scrollTop=$m.scrollHeight;progress();return d}
function say(lines,chips){const g=++gen;let t=0;$c.innerHTML='';
  lines.forEach((l,k)=>{const L=typeof l==='string'?{h:l}:l;t+=k===0?380:Math.min(1300,300+(L.c==='bare'?40:L.h.length)*8);
    setTimeout(()=>{if(g!==gen)return;const tp=document.createElement('div');tp.className='pa-typing';tp.innerHTML='<i></i><i></i><i></i>';$m.appendChild(tp);$m.scrollTop=$m.scrollHeight;
      setTimeout(()=>{tp.remove();if(g!==gen)return;add(L.h,'bot',L.c);if(k===lines.length-1)setChips(chips)},520)},t)});
}
function setChips(list){$c.innerHTML='';(list||[]).forEach(c=>{const b=document.createElement('button');b.type='button';b.className='pa-chip'+(c.u?' urg':'')+(c.p?' pri':'');b.textContent=c.t;b.onclick=()=>c.act?c.act():send(c.t);$c.appendChild(b)});requestAnimationFrame(()=>{$m.scrollTop=$m.scrollHeight})}
const Z4=(S.zones||[]).slice(0,4).map(t=>({t}));
const PHOTO_CHIP={t:'📷 Envoyer une photo',act:()=>$file.click()};
const START=[{t:'Fuite d\'eau, c\'est urgent',u:1},PHOTO_CHIP,{t:'Mon chauffe-eau ne chauffe plus'},{t:'Devis salle de bain'},{t:'Vous passez à '+((S.zones||[])[2]||S.city)+' ?'},{t:'C\'est combien ?'}];
function detectType(s){
  if(/gaz/.test(s)&&/odeur|sent|fuite|ca sent/.test(s))return'GAZ';
  if(/fuite|inond|degat|goutte|coule|eau partout|fuit/.test(s))return'Fuite d\'eau';
  if(/chauffe|ballon|eau chaude|cumulus|chaudiere/.test(s))return'Chauffe-eau / eau chaude';
  if(/bouch|evier|douche|wc|toilette|canalisation|engorg/.test(s))return'Débouchage / évacuation';
  if(/clim/.test(s))return'Climatisation';
  if(/salle de bain|renov|italienne|robinet|mitigeur|pose|install/.test(s))return /salle de bain|renov|italienne/.test(s)?'Rénovation salle de bain':'Installation / robinetterie';
  return null}
function detectVille(s){for(const z of ZONES){if(s.includes(norm(z)))return z}return null}
const slots=()=>lead.urgent?[{t:'Dès que possible'},{t:'Ce soir'}]:[{t:'Ce soir'},{t:'Demain matin'},{t:'Demain après-midi'},{t:'Ce week-end'}];
function nextQ(){
  if(!lead.type&&!lead.detail)return{s:'detail',t:'En quelques mots, quel est le problème ?'};
  if(!lead.ville)return{s:'ville',t:'Dans quelle commune se trouve le logement ?',c:Z4};
  if(!lead.nom)return{s:'nom',t:'À quel nom je note la demande ?'};
  if(!lead.tel)return{s:'tel',t:'Et le meilleur numéro pour vous rappeler ?'};
  if(!lead.creneau)return{s:'creneau',t:'Quand êtes-vous disponible ?',c:slots()};
  if(!lead.photo&&!lead.photoAsked){lead.photoAsked=true;return{s:'photo',t:`Dernière chose, facultative : une photo du problème aide ${OWNER} à préparer l'intervention (et parfois à vous dépanner plus vite).`,c:[{...PHOTO_CHIP,p:1},{t:'Envoyer sans photo'}]}}
  return null}
function ask(pre){const q=nextQ();if(!q){step='done';return finish()}step=q.s;say((pre||[]).concat([q.t]),q.c)}

/* photo : compression côté navigateur (max 1600 px, JPEG) pour rester sous la limite d'envoi */
function compress(file){return new Promise((res,rej)=>{const url=URL.createObjectURL(file);const im=new Image();
  im.onload=()=>{const k=Math.min(1,1600/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(url);c.toBlob(b=>b?res({blob:b,preview:c.toDataURL('image/jpeg',.5)}):rej(),'image/jpeg',.82)};
  im.onerror=()=>{URL.revokeObjectURL(url);rej()};im.src=url})}
$file.addEventListener('change',async()=>{const f=$file.files[0];$file.value='';if(!f)return;
  if(!/^image\//.test(f.type)){return say(['Je ne peux recevoir que des photos (JPEG, PNG, HEIC…).'])}
  try{const r=await compress(f);lead.photo=r.blob;$c.innerHTML='';gen++;add(`<img class="shot" src="${r.preview}" alt="Photo envoyée">`,'me');
    const pre=['Merci, photo bien reçue 👍 '+OCAP+' la verra avec votre demande.'];
    if(step==='photo'||step==='done'){step=null;return ask(pre)}
    if(!lead.type&&!lead.detail){step='detail';return say(pre.concat(['Pouvez-vous me dire en quelques mots ce qui se passe ?']),[{t:'Une fuite',u:1},{t:'Plus d\'eau chaude'},{t:'C\'est bouché'},{t:'Autre chose'}])}
    return ask(pre)}
  catch(e){say(['Je n\'ai pas réussi à lire cette photo. Vous pouvez réessayer, ou continuer sans.'],[PHOTO_CHIP,{t:'Continuer sans photo'}])}});
panel.querySelector('.cam').addEventListener('click',()=>$file.click());

function summary(){return `${lead.urgent?'URGENT · ':''}Demande via le site\nProblème : ${lead.type||'à préciser'}${lead.detail?' ('+lead.detail+')':''}\nCommune : ${lead.ville?cap(lead.ville):'?'}\nNom : ${lead.nom}\nTéléphone : ${lead.tel}\nCréneau : ${lead.creneau}${lead.photo?'\nPhoto : jointe à la demande':''}`}
function finish(){
  const fd=new FormData();
  Object.entries({'form-name':'demande',urgence:lead.urgent?'URGENT':'normale',probleme:(lead.type||'à préciser')+(lead.detail?' · '+lead.detail:''),commune:lead.ville?cap(lead.ville):'',nom:lead.nom,telephone:lead.tel,creneau:lead.creneau,resume:summary(),'bot-field':''}).forEach(([k,v])=>fd.append(k,v));
  if(lead.photo)fd.append('photo',lead.photo,'photo-probleme.jpg');
  fetch('/',{method:'POST',body:fd}).catch(()=>{});
  const wa='https://wa.me/'+WA+'?text='+encodeURIComponent('Bonjour, '+summary());
  const card={c:'bare',h:`<div class="pa-card"><b>Récapitulatif envoyé</b>${esc(summary()).replace(/\n/g,'<br>')}</div>`};
  say([`Merci ${esc(lead.nom.split(' ')[0])}, c'est noté : votre demande est transmise à ${OWNER}${lead.urgent?' <b>en priorité</b>':''}. Il vous rappelle ${lead.urgent?'au plus vite':'pour convenir du rendez-vous'}.`,
       card,
       `Pour aller encore plus vite, vous pouvez aussi lui envoyer ce récapitulatif sur WhatsApp : <a href="${wa}" target="_blank" rel="noopener">envoyer sur WhatsApp</a>.`,
       `En cas d'urgence, appelez directement le <a href="tel:${TEL}">${PHONE}</a>.`],[{t:'Nouvelle demande'}]);
}
function gas(){lead.type='Odeur de gaz';lead.urgent=true;step=null;
  return say([{h:`<b>Odeur de gaz : votre sécurité d'abord.</b>\n1. Ouvrez portes et fenêtres.\n2. Ne touchez à aucun interrupteur, appareil électrique ni sonnette.\n3. Fermez le robinet de gaz si vous le pouvez.\n4. Sortez du logement.\n5. Depuis l'extérieur, appelez Urgence Sécurité Gaz (GRDF), gratuit 24h/24 : <a href="tel:${GAS_TEL}">${GAS}</a>.`,c:'warn'},
    `Une fois la situation sécurisée, ${OWNER} peut intervenir sur l'installation. Voulez-vous que je lui transmette une demande ?`],[{t:'Oui, prévenir l\'artisan',p:1,act:()=>{add('Oui, prévenir l\'artisan','me');lead.detail='après sécurisation';ask()}},{t:'Non merci'}])}
function reply(raw){
  const s=norm(raw);
  if(/nouvelle demande/.test(s)&&step==='done'){Object.assign(lead,{type:null,urgent:false,ville:null,nom:null,tel:null,creneau:null,detail:null,photo:null,photoAsked:false});step=null;lastWho=null;$m.innerHTML='';return hello()}
  if(detectType(s)==='GAZ')return gas();
  if(step==='photo'||/sans photo/.test(s)){if(step==='photo')step=null;return ask()}
  if(/decrire plutot|^autre chose$/.test(s)){step='detail';return say(['Je vous écoute : décrivez le problème en quelques mots.'])}
  if(/^non merci/.test(s)){step='done';return say(['D\'accord. Prenez soin de vous, et revenez vers moi quand vous voulez.'],[{t:'Nouvelle demande'}])}
  if(step==='ville'){const v=detectVille(s);lead.ville=v||raw.trim().slice(0,40);
    return ask(v?[]:[`Je transmets à ${OWNER} : il intervient surtout à ${ZONE_LABEL}. Il vous confirmera s'il peut se déplacer jusqu'à ${esc(cap(raw.trim().slice(0,40)))}.`])}
  if(step==='nom'){lead.nom=cap(raw.trim().slice(0,40));return ask()}
  if(step==='tel'){const d=raw.replace(/[^\d+]/g,'');if(d.replace('+','').length<9)return say(['Je n\'ai pas reconnu le numéro, pouvez-vous le réécrire ? (ex. 06 12 34 56 78)']);lead.tel=raw.trim().slice(0,25);return ask()}
  if(step==='creneau'){lead.creneau=raw.trim().slice(0,60);return ask()}
  if(step==='detail'){const t=detectType(s);if(t&&!lead.type){lead.type=t;if(t==='Fuite d\'eau')lead.urgent=true}lead.detail=raw.trim().slice(0,80);
    return ask(lead.urgent&&t==='Fuite d\'eau'?['En attendant : <b>coupez l\'arrivée d\'eau</b> (robinet général, souvent près du compteur). Je signale votre demande <b>en urgence</b>.']:[])}
  if(step==='done')return say([`Votre demande est déjà transmise à ${OWNER}. Pour une autre demande, touchez « Nouvelle demande ».`],[{t:'Nouvelle demande'}]);
  if(/prix|tarif|combien|cout|cher/.test(s))
    return say([`${OCAP} ne donne pas de prix sans avoir vu le problème : le diagnostic est clair et le devis gratuit, sans frais cachés.`,'Astuce : envoyez une photo du problème, il pourra souvent vous donner une première idée plus vite.'],[PHOTO_CHIP,...START.slice(2,4)]);
  if(/horaire|ouvert|dimanche|week|nuit|soir|ferie|7j/.test(s)&&!detectType(s))
    return say([`${OCAP} intervient 7 jours sur 7, en général en moins de 24 h à ${S.city} et alentours.`,'Pour une urgence, je transmets votre demande en priorité.'],START.slice(0,3));
  if(/passez|intervenez|venez|deplac|secteur|zone|commune|ville/.test(s)||(detectVille(s)&&!detectType(s))){
    const v=detectVille(s);if(v)lead.ville=v;
    return say([v?`Oui, ${esc(cap(v))} fait partie de la zone d'intervention de ${OWNER} 👍`:`${OCAP} intervient à ${ZONE_LABEL}.`,'Quel est votre besoin ?'],START.filter(c=>!/^Vous passez/.test(c.t)))}
  if(/bonjour|salut|bonsoir|hello/.test(s)&&s.length<20)return say([`Bonjour ! Dites-moi ce qui se passe, je m'occupe de transmettre à ${OWNER}.`],START);
  const t=detectType(s);
  if(t){lead.type=t;const v=detectVille(s);if(v)lead.ville=v;
    if(t==='Fuite d\'eau'){lead.urgent=true;step=null;
      return ask(['D\'accord, on s\'en occupe. En attendant : <b>coupez l\'arrivée d\'eau</b> (robinet général, souvent près du compteur) et, si l\'eau approche d\'une prise, coupez l\'électricité de la pièce.',`Je signale votre demande <b>en urgence</b> à ${OWNER}.`])}
    step='detail';
    if(t==='Chauffe-eau / eau chaude')return say([`Compris, plus d'eau chaude, c'est vite pénible. ${OCAP} dépanne et remplace les chauffe-eau.`,'Il est électrique ou au gaz ? Et plutôt panne totale, ou eau tiède ?'],[{t:'Électrique, plus rien'},{t:'Électrique, eau tiède'},{t:'Gaz'},{t:'Je ne sais pas'}]);
    if(t==='Rénovation salle de bain')return say([`Avec plaisir : ${OWNER} rénove les salles de bain, y compris les douches à l'italienne.`,'Qu\'aimeriez-vous faire, en quelques mots ?'],[{t:'Remplacer la baignoire par une douche'},{t:'Rénovation complète'},{t:'Changer meuble et robinetterie'}]);
    return say(['Je vois. Pouvez-vous préciser en quelques mots (pièce concernée, depuis quand) ?'])}
  lead.detail=raw.trim().slice(0,80);
  return ask([`Je note : « ${esc(raw.trim().slice(0,80))} ». ${OCAP} verra le détail avec vous.`]);
}
function send(text){if(!text.trim())return;add(esc(text),'me');$c.innerHTML='';gen++;$m.querySelectorAll('.pa-typing').forEach(x=>x.remove());setTimeout(()=>reply(text),150)}
function hello(){say([`Bonjour 👋 Je suis l'assistante ${DE}${BRAND}.`,`Fuite, chauffe-eau, débouchage ou projet de salle de bain : dites-moi ce qui se passe, ou envoyez une photo. Je transmets tout de suite à ${OWNER}.`],START)}
function photoFirst(){say([`Bonjour 👋 Envoyez une photo du problème : ${OWNER} la reçoit avec votre demande et peut mieux préparer son intervention.`],[{...PHOTO_CHIP,p:1},{t:'Décrire plutôt par écrit'}]);setTimeout(()=>$file.click(),50)}
function submit(){const v=$i.value;if(!v.trim())return;$i.value='';send(v);$i.focus({preventScroll:true})}
panel.querySelector('.send').addEventListener('click',submit);
$i.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();submit()}});
})();
