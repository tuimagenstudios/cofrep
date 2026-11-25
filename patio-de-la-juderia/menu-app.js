window.PatioInitCarta = () => {
if (!document.querySelector('#menu-results')) return;
const groups = window.PATIO_MENU_ES.groups;
const T=(window.PatioT||((x,v)=>v?x.replace(/\{(\w+)\}/g,(m,k)=>v[k]):x));
const order=['cordoba','frios','ensaladas','ninos','calientes','pescados','carnes','postres','sobremesa','vinos','verano-sangria','agua-refrescos-cafe','aperitivos','copas','cervezas','menus'];
groups.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
const beverageIds=new Set(['vinos','verano-sangria','agua-refrescos-cafe','aperitivos','copas','cervezas']);
const beverageGroups=groups.filter(group=>beverageIds.has(group.id));
const beverageSection={id:'bebidas',name:T('Carta de bebidas'),description:T('Vinos, cervezas, refrescos, aperitivos y copas. Toca una categoría para ver sus opciones.'),rows:beverageGroups.flatMap(group=>group.rows.map(row=>{
  const entry=[...row];
  entry[6]=group.id==='vinos'?row[6]:group.name;
  entry[8]=group.name;
  return entry;
}))};
const foodGroups=groups.filter(group=>!beverageIds.has(group.id)&&group.id!=='menus');
const foodSection={id:'comida',name:T('Carta de comida'),description:T('Sabores de Córdoba, entrantes, ensaladas, pescados, carnes y postres. Toca una categoría para descubrir sus platos.'),rows:foodGroups.flatMap(group=>group.rows.map(row=>{
  const entry=[...row];entry[6]=group.name;entry[8]=group.name;return entry;
}))};
const displayGroups=[foodSection,beverageSection,groups.find(group=>group.id==='menus')];
let active = location.hash === '#section-menus' ? 'menus' : null;
let activeWine = null;
const results = document.querySelector('#menu-results');
const search = document.querySelector('#search');
const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const money = value => new Intl.NumberFormat(window.PatioIdioma?window.PatioIdioma.locale():'es-ES', {style:'currency', currency:'EUR'}).format(value);
const labels = {'vegetariano':T('Vegetariano'),'opcion-vegetariana':T('Adaptable a vegetariano'),'opcion-sin-gluten':T('Consultar opción sin gluten')};
const total = groups.reduce((sum,g) => sum + (g.rows || g.menus).length, 0);
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function dish(row,group) {
  const [number,name,price,description,unit='',tags=[]]=row;
  const article=element('article','dish');article.dataset.itemId='carta-'+String(number).padStart(2,'0');
  const printedNumber=typeof number==='number'?number:row[7];
  // El nombre de la sección solo se muestra al buscar (dentro de la sección sería repetirlo).
  const dishId=element('div','dish-id'+(printedNumber?'':' solo-seccion'),printedNumber?T('N.º ')+String(printedNumber).padStart(2,'0'):'');
  dishId.append(element('span','dish-cat',(printedNumber?' · ':'')+(row[8]||group.name).toUpperCase()));
  article.append(dishId);
  const top=element('div','dish-top');top.append(element('h4','',name));
  if(Array.isArray(price)){
    const options=element('div','price-options');
    price.forEach(option=>options.append(element('span','price',money(option.price)+' / '+option.unit)));
    top.append(options);
  }else top.append(element('span','price',money(price)+(unit?' '+unit:'')));
  article.append(top);
  if(description)article.append(element('p','',description));
  if(tags.length){const list=element('ul','diet-tags');list.setAttribute('aria-label',T('Opciones indicadas en la carta'));tags.forEach(tag=>list.append(element('li',tag,labels[tag])));article.append(list)}
  return article;
}
function tastingMenu(menu) {
  const article=element('article','tasting-menu');article.dataset.itemId=menu.id;
  article.append(element('p','eyebrow',menu.condition));
  const top=element('div','dish-top');top.append(element('h4','',menu.name),element('span','price',money(menu.price)+T(' / persona')));article.append(top);
  article.append(element('p','flamenco-badge',T('Espectáculo flamenco incluido')),element('p','menu-card-summary',menu.summary),element('p','menu-card-includes',menu.included));
  const link=element('a','primary');link.href='menu.html?menu='+encodeURIComponent(menu.id);
  link.setAttribute('aria-label',T('Ver menú completo: ')+menu.name);
  link.append(element('span','',T('Ver menú completo')),element('span','','→'));
  article.append(link);return article;
}
function accordion(id,name,count,kind) {
  const panel=element('details',kind==='wine'?'wine-accordion':'menu-accordion');
  panel.dataset.accordionId=id;
  panel.name=kind==='wine'?'wine-families':'menu-sections';
  const summary=element('summary','accordion-summary');
  summary.append(element(kind==='wine'?'h4':'h3','',name),element('span','accordion-count',count+' '+T(count===1?'opción':'opciones')));
  const icon=element('span','accordion-icon','+');icon.setAttribute('aria-hidden','true');summary.append(icon);panel.append(summary);
  if(kind==='main'&&id==='menus'){
    panel.classList.add('menu-offer');
    const copy=element('div','offer-copy');
    copy.append(element('p','eyebrow',T('GASTRONOMÍA + ESPECTÁCULO')),element('h3','',name),element('p','offer-description',T('Tres experiencias para saborear Córdoba con flamenco incluido.')));
    const action=element('div','offer-action');
    const startingPrice=Math.min(...groups.find(group=>group.id==='menus').menus.map(menu=>menu.price));
    const price=element('p','offer-price');price.append(element('span','',T('Desde ')),element('strong','',money(startingPrice)),element('span','',T(' / persona')));
    const toggle=element('span','offer-toggle');
    toggle.append(element('span','offer-open-label',T('Descubrir los menús')),element('span','offer-close-label',T('Cerrar los menús')),icon);
    action.append(price,toggle);summary.replaceChildren(copy,action);
  }
  summary.addEventListener('click',event=>{
    event.preventDefault();
    const opening=!panel.open;
    if(opening){
      const siblings=kind==='wine'?results.querySelectorAll('.wine-accordion'):results.querySelectorAll('.menu-accordion');
      siblings.forEach(other=>{if(other!==panel)other.open=false});
      if(kind==='wine')activeWine=id;else active=id;
    }else if(kind==='wine'&&activeWine===id)activeWine=null;
    else if(kind!=='wine'&&active===id)active=null;
    panel.open=opening;
    if(opening)summary.scrollIntoView({block:'nearest',behavior:'instant'});
  });
  return panel;
}
function render() {
  const query=normalize(search.value.trim());
  results.replaceChildren();let count=0;
  results.classList.toggle('is-search',!!query);
  let opened=false;
  displayGroups.forEach((group,index)=>{
    const rows=(group.rows||[]).filter(row=>!query||normalize([group.name,row[1],row[3],row[6]||'',row[8]||''].join(' ')).includes(query));
    const menus=(group.menus||[]).filter(menu=>!query||normalize([menu.name,menu.condition,menu.summary,menu.included,...menu.courses.flat(),...(menu.choices?.items||[]).flat(),...(menu.desserts||[]).flat()].join(' ')).includes(query));
    if(!rows.length&&!menus.length)return;count+=rows.length+menus.length;
    const section=accordion(group.id,group.name,rows.length+menus.length,'main');section.id='section-'+group.id;
    section.open=!opened&&(query?true:active===group.id);if(section.open)opened=true;
    const content=element('div','accordion-content');
    content.append(element('p','section-description',group.description));
    if(group.id==='bebidas'||group.id==='comida'){
      const families=[...new Set(rows.map(row=>row[6]))];
      families.forEach((family,position)=>{
        const matching=rows.filter(row=>row[6]===family);
        const wine=accordion(family,family,matching.length,'wine');
        if(group.id==='comida')wine.classList.add('food-accordion');
        wine.open=query?position===0:activeWine===family;
        const dishes=element('div','dishes');matching.forEach(row=>dishes.append(dish(row,group)));wine.append(dishes);content.append(wine);
      });
    }else{
      const dishes=element('div',menus.length?'tasting-menus':'dishes');rows.forEach(row=>dishes.append(dish(row,group)));
      menus.forEach(menu=>dishes.append(tastingMenu(menu)));content.append(dishes);
    }
    section.append(content);
    results.append(section);
  });
  document.querySelector('#count').textContent=count+' '+T(count===1?'referencia':'referencias');
  if(!count){const empty=element('div','empty');empty.append(element('h3','',T('No encontramos ese sabor')),element('p','',T('Prueba con otro plato o vuelve a explorar la carta.')));const reset=element('button','',T('Ver las secciones'));reset.type='button';reset.onclick=()=>{active=null;search.value='';render();search.focus()};empty.append(reset);results.append(empty)}
}
// oninput (y no addEventListener): al cambiar de idioma la carta se vuelve a armar sin duplicar el buscador.
search.oninput=()=>{
  render();
  search.closest('.toolbar').scrollIntoView({block:'start',behavior:'instant'});
};render();

// Same eight dishes highlighted on the official home page. Prices, names and
// units are read from the Spanish menu so the two places cannot diverge.
const featuredSelection = [
  {number:3,title:'Salmorejo cordobés',kicker:'EL CLÁSICO CORDOBÉS',description:'Tomate, pan y jamón.'},
  {number:8,title:'Flamenquín cordobés',kicker:'TRADICIÓN EN LA MESA',description:'Cerdo y jamón, con guarnición.'},
  {number:11,title:'Rabo de toro',kicker:'COCINA CON HISTORIA',description:'Estofado con verduras.'},
  {number:5,title:'Mazamorra cordobesa',kicker:'LA OTRA CREMA DE CÓRDOBA',description:'Crema fría de almendra.'},
  {number:1,title:'Berenjenas con miel',kicker:'RAÍCES SEFARDÍES',description:'Fritas, con miel de caña.'},
  {number:15,title:'Trampantojo de foie',kicker:'UN BOCADO SORPRENDENTE',description:'Foie y frutos secos.',minimum:'Mínimo 4 unidades'},
  {number:38,title:'Milhojas de presa',kicker:'SABORES QUE SE ENCUENTRAN',description:'Con foie y setas.'},
  {number:26,title:'Alcachofas en flor',kicker:'UN TOQUE DE TRUFA',description:'Aceite de trufa y sal negra.',minimum:'Mínimo 2 unidades'}
];
function revealFeaturedDish(groupId, number) {
  active='comida';activeWine=groups.find(group=>group.id===groupId).name;search.value='';render();
  const target=results.querySelector('[data-item-id="carta-'+String(number).padStart(2,'0')+'"]');
  target.classList.add('from-featured');target.tabIndex=-1;
  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
  target.focus({preventScroll:true});
}
featuredSelection.forEach((selection,index)=>{
  const group=groups.find(g=>(g.rows||[]).some(row=>row[0]===selection.number));
  const row=group.rows.find(row=>row[0]===selection.number);
  const card=element('article','featured-card');card.dataset.featuredId=String(selection.number);
  const meta=element('div','featured-card-meta');
  meta.append(element('span','',T(selection.kicker)),element('span','',String(index+1).padStart(2,'0')));
  card.append(meta,element('h3','',T(selection.title)),element('p','featured-description',T(selection.description)));
  const bottom=element('div','featured-card-bottom');
  bottom.append(element('span','price',money(row[2])+(row[4]?' '+row[4]:'')));
  if(selection.minimum)bottom.append(element('span','featured-minimum',T(selection.minimum)));
  const button=element('button');button.type='button';
  button.setAttribute('aria-label',T('Ver {plato} en la carta',{plato:row[1]}));
  const arrow=element('span','','↗');arrow.setAttribute('aria-hidden','true');
  button.append(element('span','',T('Ver plato')),arrow);
  button.onclick=()=>revealFeaturedDish(group.id,selection.number);
  bottom.append(button);card.append(bottom);document.querySelector('#featured-dishes').append(card);
});

};
window.PatioInitCarta();
