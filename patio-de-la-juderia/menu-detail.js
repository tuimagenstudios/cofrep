window.PatioInitDetail = () => {
if (!document.querySelector('#menu-detail')) return;
const menus=window.PATIO_MENU_ES.groups.find(group=>group.id==='menus').menus;
const selectedId=new URLSearchParams(location.search).get('menu');
const selected=menus.find(menu=>menu.id===selectedId);
const host=document.querySelector('#menu-detail');
function make(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
function courseList(rows){const list=make('ol','detail-courses');rows.forEach(([name,description])=>{const li=make('li');li.append(make('h3','',name));if(description)li.append(make('p','',description));list.append(li)});return list}
if(!selected){host.append(make('h1','','Elige tu menú'),make('p','','Descubre nuestras tres experiencias de cocina y flamenco.'));const back=make('a','primary','Ver los menús');back.href='index.html#section-menus';host.append(back)}
else{
document.title=selected.name+' · Patio de la Judería';
host.append(make('p','eyebrow','GASTRONOMÍA & FLAMENCO'),make('h1','',selected.name),make('p','detail-summary',selected.summary),make('p','flamenco-badge','Espectáculo flamenco incluido'));
const terms=make('div','detail-terms');
const price=make('p','detail-price',new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(selected.price));price.append(make('span','',' / persona'));terms.append(price,make('p','',selected.condition));host.append(terms);
host.append(courseList(selected.courses));
if(selected.choices){host.append(make('h2','course-group-title',selected.choices.title));const choices=courseList(selected.choices.items);choices.classList.add('choice-list');host.append(choices)}
if(selected.desserts){host.append(make('h2','course-group-title','Postre'));host.append(courseList(selected.desserts))}
const includes=make('section','menu-includes');includes.append(make('h2','','Incluye'),make('p','',selected.included),make('p','','Espectáculo flamenco incluido. Precios con IVA incluido.'));host.append(includes);
const reserve=make('a','primary','Consultar reserva ↗');reserve.href='https://wa.me/34625940724?text='+encodeURIComponent('Hola, quiero reservar el '+selected.name+' en el Patio de la Judería. Somos __ personas para el día __ a las __.');reserve.target='_blank';reserve.rel='noopener';host.append(reserve);
const back=make('a','detail-back','← Volver a los menús');back.href='index.html#section-menus';host.append(back);
}

};
window.PatioInitDetail();
