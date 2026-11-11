/* Kit Permanence · formulaire de contact et guide d'urgence */
document.getElementById('cform').addEventListener('submit',async function(e){
  e.preventDefault();var f=e.target,btn=f.querySelector('button[type=submit]'),err=document.getElementById('c-err');
  if(f.elements['bot-field'].value)return;
  btn.disabled=true;btn.textContent='Envoi en cours…';err.style.display='none';
  var file=f.elements.photo.files[0],photo=null;
  if(file){try{photo=(await window.paCompress(file)).blob}catch(x){photo=null}}
  var d={nom:f.elements.nom.value.trim(),telephone:f.elements.telephone.value.trim(),commune:f.elements.commune.value.trim(),message:f.elements.message.value.trim(),urgence:/urgen|fuite|inond|d[ée]g[âa]t/i.test(f.elements.message.value)?'URGENT':'normale'};
  var ok=window.paSend?await window.paSend('contact',d,photo):false;
  if(ok){f.querySelectorAll('input,textarea,button').forEach(function(x){x.disabled=true});btn.textContent='Demande envoyée';document.getElementById('c-ok').style.display='block'}
  else{btn.disabled=false;btn.textContent='Envoyer ma demande';err.style.display='block'}
});
document.getElementById('c-photo').addEventListener('change',function(){var f=this.files[0];document.getElementById('c-photo-l').textContent=f?('Photo ajoutée : '+f.name):'Ajouter une photo du problème (facultatif)';if(f&&f.size>7.5e6){this.value='';document.getElementById('c-photo-l').textContent='Photo trop lourde (8 Mo max) : choisissez-en une plus légère.'}});
/* onglets du guide d'urgence */
(function(){var tabs=[].slice.call(document.querySelectorAll('.urg [role=tab]'));function sel(t,focus){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on});document.querySelector('.urg').classList.toggle('is-gaz',t.id==='tb-gaz');if(focus)t.focus()}
tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(t)});t.addEventListener('keydown',function(e){var k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(k){e.preventDefault();sel(tabs[(i+k+tabs.length)%tabs.length],true)}})})})();

/* Mobile v5 : carrousels, contact, partage, clavier */
(function(){var S=window.SITE||{};
document.querySelectorAll('[data-swipe]').forEach(function(el){var n=el.children.length;if(n<2)return;var d=document.createElement('div');d.className='dots';d.setAttribute('aria-hidden','true');for(var i=0;i<n;i++)d.appendChild(document.createElement('i'));el.parentNode.insertBefore(d,el.nextSibling);
 function up(){var max=el.scrollWidth-el.clientWidth,k=max>0?Math.round(el.scrollLeft/max*(n-1)):0;for(var i=0;i<n;i++)d.children[i].classList.toggle('on',i===k)}
 el.addEventListener('scroll',function(){requestAnimationFrame(up)},{passive:true});up()});
document.querySelectorAll('[data-vcard]').forEach(function(b){b.addEventListener('click',function(){
 var v=['BEGIN:VCARD','VERSION:3.0','N:;'+S.brand+';;;','FN:'+S.brand,'ORG:'+S.brand,'TITLE:'+S.trade+' · urgences 7j/7','TEL;TYPE=CELL,VOICE:'+S.phone_intl,S.phone2?'TEL;TYPE=WORK,VOICE:'+S.phone2.intl:'',S.addr?'ADR;TYPE=WORK:;;'+S.addr:'','URL:'+location.origin+'/','NOTE:Plombier à '+S.city+' · 24h/24 et 7j/7','END:VCARD'].filter(Boolean).join('\r\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([v],{type:'text/vcard;charset=utf-8'}));a.download=(S.brand||'contact').replace(/[^\w]+/g,'-')+'.vcf';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500)})});
document.querySelectorAll('[data-share]').forEach(function(b){b.addEventListener('click',function(){var url=location.origin+'/',txt=S.brand+' : plombier à '+S.city+', 7j/7. '+S.phone;
 if(navigator.share){navigator.share({title:S.brand,text:txt,url:url}).catch(function(){})}
 else if(navigator.clipboard){navigator.clipboard.writeText(txt+' '+url).then(function(){var s=b.querySelector('small');if(s)s.textContent='Lien copié : collez-le dans un message'})}})});
var typing=function(on){document.body.classList.toggle('typing',on)};
document.addEventListener('focusin',function(e){if(e.target.matches&&e.target.matches('input:not([type=file]),textarea,select'))typing(true)});
document.addEventListener('focusout',function(){setTimeout(function(){var a=document.activeElement;typing(!!(a&&a.matches&&a.matches('input:not([type=file]),textarea,select')))},60)});
})();
