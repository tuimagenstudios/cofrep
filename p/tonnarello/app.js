const grid=document.querySelector('#menu-grid'),nav=document.querySelector('#categories'),paper=document.querySelector('.paper'),input=document.querySelector('#search'),notes=document.querySelector('#notes');
const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let language='it';
try{const requested=new URL(location.href).searchParams.get('lang'),stored=localStorage.getItem('tonnarello-language');language=[requested,stored,'it'].find(code=>Object.hasOwn(I18N,code));}catch{}
let baselineElements=[],baselineFrame;
let searching=false,searchOpenState=null,scrollOnToggle=null;
const dictionary=()=>I18N[language];
// La carta se dibuja desde un único modelo: el incluido en la carta o el de la planilla del local (modelo.js).
const MODELO_DATOS=TonnarelloModelo.desdeDatos();
let modelo=MODELO_DATOS;
const tx=value=>value?.[language]||value?.it||'';
const symbols=(category,list)=>(list||[]).map(symbol=>{const label=category.section==='bevande'&&symbol==='foglia'?dictionary().ui.organic:dictionary().symbols[symbol];return `<img class="food-symbol food-symbol-${symbol}" src="marca/icone/${symbol}.svg?v=9" alt="${escapeHTML(label)}" title="${escapeHTML(label+' · '+dictionary().ui.symbol)}" width="21" height="18">`;}).join('');
function categoryNote(category,text){
 if(category.section==='bevande')return escapeHTML(text);
 const content=category.code==='polpette'?escapeHTML(text).replace(/(\([^)]*\))/g,'<span class="note-aside">$1</span>'):escapeHTML(text);
 return `<strong>${content}</strong>`;
}
function renderMenu(){
 const d=dictionary(),currency=new Intl.NumberFormat(d.locale,{style:'currency',currency:'EUR'});
 const previousOpen=new Set([...grid.querySelectorAll('details[open]')].map(element=>element.id));
 grid.replaceChildren();nav.replaceChildren();
 const sectionNote=tx(modelo.sectionNote);
 [{id:'cucina',label:d.ui.food,navLabel:d.ui.foodNav},{id:'bevande',label:d.ui.drinks,navLabel:d.ui.drinksNav}].forEach(group=>{
  const categories=modelo.categories.filter(category=>category.section===group.id&&category.items.length);
  if(!categories.length)return;
  const mainLink=document.createElement('a');mainLink.href='#'+group.id;mainLink.textContent=group.label;nav.append(mainLink);
  const main=document.createElement('details');main.id=group.id;main.className='menu-section';main.open=previousOpen.has(group.id);
  main.innerHTML=`<summary class="section-summary"><span class="section-title">${escapeHTML(group.label)}</span><span class="accordion-indicator" aria-hidden="true"></span></summary><div class="section-content"><div class="section-toolbar"><nav class="category-nav" aria-label="${escapeHTML(group.navLabel)}">${categories.map(category=>`<a href="#${escapeHTML(category.code)}">${escapeHTML(tx(category.name))}</a>`).join('')}</nav></div>${group.id==='bevande'&&sectionNote?`<p class="section-note">${escapeHTML(sectionNote)}</p>`:''}<div class="section-categories"></div></div>`;
  categories.forEach(category=>{
   const id=category.code,note=tx(category.note);
   const section=document.createElement('details');section.id=id;section.className='category'+(category.featured?' featured':'');section.open=previousOpen.has(id);
   section.innerHTML=`<summary class="category-summary"><h2 id="${escapeHTML(id)}-title">${escapeHTML(tx(category.name))}${id==='contorni'?`<img class="category-symbol" src="marca/icone/foglia.svg?v=9" alt="${escapeHTML(d.symbols.foglia)}" width="22" height="18">`:''}${id==='vini'?'<span class="organic-word"> BIO</span>':''}</h2><span class="accordion-indicator" aria-hidden="true"></span></summary><div class="category-content">${note?`<p class="note${id==='pinse'?' note-red':''}">${categoryNote(category,note)}</p>`:''}${id==='birre'?'<div class="beverage-brand"><img src="marca/peroni-original.webp" alt="Peroni Nastro Azzurro" width="108" height="50"></div>':''}<div class="items">${category.items.map(item=>{
   const name=tx(item.name),description=tx(item.desc),allergens=item.allergens;
   const search=normalize([name,description,item.name.it,item.desc.it].join(' '));
   const isSpritz=category.section==='bevande'&&item.id==='spritz'&&id==='aperitivi';
   const data=`data-product-id="${escapeHTML(item.id)}" data-price="${item.price}" data-allergens="${escapeHTML(allergens)}" data-search="${escapeHTML(search)}"`;
   // El arte aportado incluye 8,5 €: solo se usa mientras coincida con el precio de la carta.
   if(isSpritz&&item.price===8.5)return `<article class="dish spritz-original" ${data}><img class="spritz-artwork" src="marca/spritz-original.webp" alt="" width="1822" height="863"><div class="sr-only"><h3>${escapeHTML(name)}</h3><span class="price">${currency.format(item.price)}</span><span>${escapeHTML(d.ui.allergens)} ${escapeHTML(allergens)}</span></div></article>`;
   const nameMarkup=isSpritz?`<img class="spritz-wordmark" src="marca/spritz.svg?v=2" alt="Spritz" width="150" height="75"><span class="spritz-caption">${escapeHTML(d.ui.aperitifTag)}</span>`:escapeHTML(name).replace(/BIO|organic|ecológico/giu,word=>`<span class="organic-word">${word}</span>`);
   return `<article class="dish${isSpritz?' spritz-feature':''}" ${data}>${isSpritz?'<img class="spritz-glass" src="marca/spritz-calice.png?v=2" alt="" width="45" height="78">':''}<div class="dish-top"><h3>${item.frozen?'<span class="mark">* </span>':''}${nameMarkup}${allergens&&!isSpritz?`<span class="allergens allergens-inline" aria-label="${escapeHTML(d.ui.allergens+' '+allergens)}">(${escapeHTML(allergens)})</span>`:''}</h3><span class="dish-meta"><span class="food-symbols">${id==='vini'?'':symbols(category,item.symbols)}</span><span class="price">${currency.format(item.price)}</span></span></div>${description?`<p>${escapeHTML(description)}</p>`:''}${allergens&&isSpritz?`<span class="allergens" aria-label="${escapeHTML(d.ui.allergens+' '+allergens)}">(${escapeHTML(allergens)})</span>`:''}</article>`;
   }).join('')}</div></div>`;
   main.querySelector('.section-categories').append(section);
  });
  grid.append(main);
 });
 renderClassics(d,currency);
}
// «I nostri classici»: los platos marcados como clásicos (columna «Classico» de la planilla). Toman nombre y precio de la carta.
const CLASSICS_TEXT={it:['I nostri classici','Il nostro cavallo di battaglia'],en:['Our classics','The dishes we are known for'],es:['Nuestros clásicos','Los platos que nos identifican']};
function renderClassics(d,currency){
 const [title,note]=CLASSICS_TEXT[language]||CLASSICS_TEXT.it;
 const picked=[];modelo.categories.forEach(category=>category.items.forEach(item=>{if(item.classic&&!picked.some(entry=>entry.item.id===item.id))picked.push({category,item});}));
 if(!picked.length)return;
 const rows=picked.slice(0,8).map(({category,item})=>`<li><a href="#${escapeHTML(category.code)}"><span class="classics-name">${escapeHTML(tx(item.name))}</span><span class="classics-dots" aria-hidden="true"></span><span class="classics-price">${currency.format(item.price)}</span></a></li>`).join('');
 const section=document.createElement('section');section.className='classics';section.setAttribute('aria-labelledby','classics-title');
 section.innerHTML=`<h2 id="classics-title" class="classics-title">${escapeHTML(title)}</h2><p class="classics-note">${escapeHTML(note)}</p><ul class="classics-list">${rows}</ul>`;
 grid.prepend(section);
}
function applyUI(){
 const d=dictionary(),u=d.ui;
 document.documentElement.lang=language;document.title='Tonnarello · '+u.title;
 const bindings={'.edition span:last-child':'edition','.skip':'skip','.heading-line span:first-child':'cuisine','.heading-line span:last-child':'season','h1':'title','.intro':'intro','.search-toggle span':'search','#search-area label':'searchLabel','#clear':'clear','.menu-meta>span':'meta','.menu-meta .notes-open':'info','#empty':'empty','.closing p':'closing','.closing>span:last-child':'heritage','.service':'service','footer .notes-open':'notes','footer a[href$=".pdf"]':'original'};
 Object.entries(bindings).forEach(([selector,key])=>{document.querySelector(selector).textContent=u[key];});
 document.querySelector('.source-note').replaceChildren(document.createTextNode(u.source),document.createElement('br'),document.createTextNode(u.scope));
 document.querySelector('.heritage-photo img').alt=u.photoAlt;document.querySelector('.logo').alt=u.logoAlt;
 nav.setAttribute('aria-label',u.categories);document.querySelector('.language-switch').setAttribute('aria-label',u.language);
 document.querySelector('.search-toggle').setAttribute('aria-label',u.search);input.placeholder=u.placeholder;
 document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===language)));
 notes.innerHTML=`<button id="close-notes" class="close" aria-label="${escapeHTML(u.close)}">×</button><h2 id="notes-title">${escapeHTML(u.info.replace(' ↗',''))}</h2><p>${escapeHTML(d.notes[0])}</p>${d.foodPassion?`<p>${escapeHTML(d.foodPassion)}</p>`:''}<p>${escapeHTML(d.notes[1])}</p><div class="symbol-legend">${Object.entries(d.symbols).map(([id,label])=>`<span><img class="food-symbol" src="marca/icone/${id}.svg?v=9" alt="" width="21" height="18">${escapeHTML(label)}</span>`).join('')}</div><ol>${d.allergens.map(label=>`<li>${escapeHTML(label)}</li>`).join('')}</ol><p>${escapeHTML(d.notes[2])}</p><p><b>*</b> ${escapeHTML(d.notes[3])}</p>${d.allergyReminder?`<p><strong>${escapeHTML(d.allergyReminder)}</strong></p>`:''}<p><b>${escapeHTML(u.service)}.</b> ${escapeHTML(d.notes[4])}</p><a href="https://tonnarello.it/wp-content/uploads/2026/11/Tonnarello_ITA_INV2026.pdf" target="_blank" rel="noopener">${escapeHTML(u.pdf)}</a>`;
}
function setupBaselines(){
 paper.querySelectorAll('.baseline-marker').forEach(marker=>marker.remove());
 // Los títulos de acordeón se alinean moviendo todo el encabezado, así el + acompaña al título.
 baselineElements=[...paper.querySelectorAll('.section-summary,.section-note,.category-summary,.category .note,.classics-title,.classics-note,.classics-list a,.dish h3,.dish-meta,.dish p,.allergens:not(.allergens-inline),.eyebrow,h1,.intro,.heading-line span,.closing p,.closing>span:last-child,.service,.source-note')];
 baselineElements.forEach(element=>{element.classList.add('baseline-snap');const marker=document.createElement('span');marker.className='baseline-marker';marker.setAttribute('aria-hidden','true');(element.matches('.dish-meta')?element.querySelector('.price'):element.matches('.spritz-feature h3')?element.querySelector('.spritz-caption'):element.matches('.section-summary')?element.querySelector('.section-title'):element.matches('.category-summary')?element.querySelector('h2'):element.matches('.classics-list a')?element.querySelector('.classics-name'):element).append(marker);});
 alignBaselines();document.fonts.ready.then(alignBaselines);
}
function alignBaselines(){
 cancelAnimationFrame(baselineFrame);
 baselineFrame=requestAnimationFrame(()=>{
  baselineElements.forEach(element=>element.style.removeProperty('--baseline-shift'));
  const origin=paper.getBoundingClientRect().top+paper.clientTop+23;
  const positions=baselineElements.filter(element=>element.getClientRects().length).map(element=>{const baseline=element.querySelector('.baseline-marker').getBoundingClientRect().top;return [element,origin+Math.round((baseline-origin)/24)*24-baseline];});
  positions.forEach(([element,shift])=>element.style.setProperty('--baseline-shift',`${shift}px`));
 });
}
function filterMenu(){
 const query=normalize(input.value).trim();let count=0;
 const terms=query.match(/[\p{L}\p{N}]+/gu)||[];
 if(query&&!searching)searchOpenState=new Set([...grid.querySelectorAll('details[open]')].map(element=>element.id));
 const wasSearching=searching;searching=Boolean(query);
 grid.querySelectorAll('.category').forEach(section=>{let matches=0;section.querySelectorAll('.dish').forEach(dish=>{const words=dish.dataset.search.match(/[\p{L}\p{N}]+/gu)||[];const match=terms.every(term=>words.some(word=>word.startsWith(term)));dish.hidden=!match;if(match){matches++;count++;}});section.hidden=matches===0;if(query)section.open=matches>0;});
 grid.querySelectorAll('.menu-section').forEach(section=>{section.hidden=![...section.querySelectorAll('.category')].some(category=>!category.hidden);if(query)section.open=!section.hidden;});
 if(!query&&wasSearching){grid.querySelectorAll('details').forEach(element=>element.open=searchOpenState?.has(element.id)||false);searchOpenState=null;}
 grid.querySelectorAll('.category-nav a').forEach(link=>{link.hidden=document.getElementById(link.hash.slice(1)).hidden;});
 document.querySelector('#empty').hidden=count>0;
 const classics=grid.querySelector('.classics');if(classics)classics.hidden=Boolean(query);
 const u=dictionary().ui;document.querySelector('#search-status').textContent=query?`${count} ${count===1?u.foundOne:u.foundMany}`:'';
 alignBaselines();
}
function setLanguage(code){
 if(!Object.hasOwn(I18N,code))return;
 if(searching){input.value='';filterMenu();}
 language=code;input.value='';renderMenu();applyUI();filterMenu();setupBaselines();setupCategoryNavs();
 try{localStorage.setItem('tonnarello-language',code);const url=new URL(location.href);url.searchParams.set('lang',code);history.replaceState(null,'',url);}catch{}
}
document.querySelector('.language-switch').addEventListener('click',event=>{const button=event.target.closest('[data-lang]');if(button)setLanguage(button.dataset.lang);});
input.addEventListener('input',filterMenu);
document.querySelector('#clear').addEventListener('click',()=>{input.value='';filterMenu();input.focus();});
document.querySelector('.search-toggle').addEventListener('click',event=>{const area=document.querySelector('#search-area');area.hidden=!area.hidden;event.currentTarget.setAttribute('aria-expanded',String(!area.hidden));if(!area.hidden)input.focus();else{input.value='';filterMenu();}alignBaselines();});
document.addEventListener('click',event=>{if(event.target.closest('.notes-open'))notes.showModal();if(event.target.closest('#close-notes'))notes.close();});
notes.addEventListener('click',event=>{if(event.target===notes){const rect=notes.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)notes.close();}});
function openMenuTarget(id,scroll=true){
 const target=document.getElementById(id);if(!target?.matches('.menu-section,.category'))return;
 if(input.value){input.value='';filterMenu();}
 const main=target.matches('.menu-section')?target:target.closest('.menu-section');
 grid.querySelectorAll('.menu-section').forEach(section=>{if(section!==main)section.open=false;});main.open=true;
 // Al abrir una sección sin categoría elegida, se despliega la primera para no mostrar solo títulos cerrados.
 if(target.matches('.menu-section')&&!main.querySelector('.category[open]')){const first=main.querySelector('.category');if(first)first.open=true;}
 if(target.matches('.category')){main.querySelectorAll('.category').forEach(category=>{if(category!==target)category.open=false;});target.open=true;}
 // La barra de categorías puede ocupar dos renglones en pantallas grandes: el salto tiene en cuenta su alto real.
 const bars=document.querySelector('.toolbar').offsetHeight+(main.querySelector('.section-toolbar')?.offsetHeight||0);
 main.style.setProperty('--category-offset',`${bars+12}px`);
 nav.querySelectorAll('a').forEach(link=>link.classList.toggle('active',link.hash==='#'+main.id));
 main.querySelectorAll('.category-nav a').forEach(link=>link.classList.toggle('active',link.hash==='#'+target.id));
 requestAnimationFrame(()=>{revealActiveCategory(main);const bar=main.querySelector('.section-toolbar');if(bar)updateNavArrows(bar);});
 alignBaselines();
 if(scroll)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
}
function handleCategoryLink(event){const link=event.target.closest('a[href^="#"]');if(!link)return;const id=link.hash.slice(1);if(!document.getElementById(id)?.matches('.menu-section,.category'))return;event.preventDefault();openMenuTarget(id);try{history.replaceState(null,'',link.href);}catch{}}
nav.addEventListener('click',handleCategoryLink);
grid.addEventListener('click',event=>{if(event.target.closest('.category-nav,.classics'))handleCategoryLink(event);const summary=event.target.closest('summary');if(summary&&!summary.parentElement.open)scrollOnToggle=summary.parentElement.id;});
grid.addEventListener('toggle',event=>{
 const target=event.target;if(!target.matches('.menu-section,.category'))return;
 if(target.open&&!searching){const siblings=target.matches('.menu-section')?grid.querySelectorAll('.menu-section'):target.closest('.menu-section').querySelectorAll('.category');siblings.forEach(element=>{if(element!==target)element.open=false;});}
 alignBaselines();
 if(target.open&&!searching&&scrollOnToggle===target.id){scrollOnToggle=null;requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));}
},true);
window.addEventListener('resize',alignBaselines);
// Barras de categorías deslizables: flechas cuando hay categorías ocultas a un costado, rueda del mouse en horizontal y la categoría activa siempre a la vista.
const ARROW_LABELS={it:['Categorie precedenti','Categorie successive'],en:['Previous categories','Next categories'],es:['Categorías anteriores','Categorías siguientes']};
function updateNavArrows(bar){const list=bar.querySelector('.category-nav');const max=list.scrollWidth-list.clientWidth;bar.classList.toggle('can-prev',list.scrollLeft>4);bar.classList.toggle('can-next',list.scrollLeft<max-4);}
function revealActiveCategory(main){const list=main?.querySelector('.category-nav'),link=list?.querySelector('a.active');if(!link||list.scrollWidth<=list.clientWidth)return;const left=link.offsetLeft-list.offsetLeft,target=left-(list.clientWidth-link.offsetWidth)/2;list.scrollTo({left:Math.max(0,target),behavior:'smooth'});}
function setupCategoryNavs(){
 const [prevLabel,nextLabel]=ARROW_LABELS[language]||ARROW_LABELS.it;
 grid.querySelectorAll('.section-toolbar').forEach(bar=>{
  const list=bar.querySelector('.category-nav');
  bar.insertAdjacentHTML('beforeend',`<button type="button" class="nav-arrow prev" aria-label="${escapeHTML(prevLabel)}" tabindex="-1">‹</button><button type="button" class="nav-arrow next" aria-label="${escapeHTML(nextLabel)}" tabindex="-1">›</button>`);
  bar.querySelector('.nav-arrow.prev').addEventListener('click',()=>list.scrollBy({left:-list.clientWidth*.7,behavior:'smooth'}));
  bar.querySelector('.nav-arrow.next').addEventListener('click',()=>list.scrollBy({left:list.clientWidth*.7,behavior:'smooth'}));
  list.addEventListener('scroll',()=>updateNavArrows(bar),{passive:true});
  list.addEventListener('wheel',event=>{if(list.scrollWidth<=list.clientWidth||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;const max=list.scrollWidth-list.clientWidth;if((event.deltaY<0&&list.scrollLeft<=0)||(event.deltaY>0&&list.scrollLeft>=max))return;event.preventDefault();list.scrollLeft+=event.deltaY;},{passive:false});
  updateNavArrows(bar);
 });
}
window.addEventListener('resize',()=>grid.querySelectorAll('.section-toolbar').forEach(updateNavArrows));
grid.addEventListener('toggle',event=>{const target=event.target;if(!target.matches?.('.category')||!target.open)return;const main=target.closest('.menu-section');main.querySelectorAll('.category-nav a').forEach(link=>link.classList.toggle('active',link.hash==='#'+target.id));requestAnimationFrame(()=>{revealActiveCategory(main);main.querySelector('.section-toolbar')&&updateNavArrows(main.querySelector('.section-toolbar'));});},true);
renderMenu();applyUI();filterMenu();setupBaselines();setupCategoryNavs();
// Sin enlace directo, la carta abre con la cocina y los antipasti a la vista.
if(location.hash&&document.getElementById(location.hash.slice(1))?.matches('.menu-section,.category'))openMenuTarget(location.hash.slice(1),false);else openMenuTarget('antipasti',false);

// Planilla del local: si está configurada, reemplaza la carta incluida en cuanto llega (y queda guardada para la próxima visita).
TonnarelloPlanilla.cargar({respaldo:MODELO_DATOS,alListo:nuevo=>{
 modelo=nuevo;
 const query=input.value;
 renderMenu();filterMenu();setupBaselines();setupCategoryNavs();
 if(!grid.querySelector('.menu-section[open]')){const first=grid.querySelector('.category');if(first)openMenuTarget(first.id,false);}
 if(query){input.value=query;filterMenu();}
}});
