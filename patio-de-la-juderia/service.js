window.PatioInitService = () => {
const service=window.PATIO_SERVICE_ES;
const T=window.PatioT||((x,v)=>v?x.replace(/\{(\w+)\}/g,(m,k)=>v[k]):x);
const locale=window.PatioIdioma?window.PatioIdioma.locale():'es-ES';
const euros=n=>new Intl.NumberFormat(locale,{style:'currency',currency:'EUR'}).format(n);
document.querySelectorAll('[data-service-notice]').forEach(host=>{
host.innerHTML=`<div class="notice-heading"><p class="eyebrow">${T('PARA DISFRUTAR DEL PATIO')}</p><h2>${T('En nuestra mesa')}</h2></div>
<div class="notice-minimum"><p>${T('Consumo mínimo en mesa de restaurante con espectáculo')}</p><strong>${euros(service.minimum)} <span>${T('por persona')}</span></strong></div>
<div class="notice-body"><p>${T('Si algún plato no es de su agrado, comuníquelo al encargado y se le cambiará por otro plato de igual o menor valor.')} <strong>${T('Postres no incluidos.')}</strong></p>
<p>${T('Puede llevarse la comida que le sobre en un envase con un coste de {envase}. Si desea una bolsa de transporte, se añadirán {bolsa} más.',{envase:'<strong>'+euros(service.container)+'</strong>',bolsa:'<strong>'+euros(service.bag)+'</strong>'})}</p>
<p class="notice-bread">${T('Servicio de pan:')} <strong>${euros(service.bread)} ${T('por persona')}</strong></p>
<details><summary>${T('Declaración de alérgenos')}</summary><p>${T('En cumplimiento del Reglamento (UE) n.º 1169/2011 sobre la información alimentaria facilitada al consumidor, este establecimiento tiene disponible para su consulta la información relativa a la presencia de alérgenos de nuestros productos. Diríjase a nuestro personal si desea más información al respecto.')}</p></details>
<div class="notice-legend"><span><b>Veg*</b> ${T('Posibilidad de convertir a plato vegetariano')}</span><span><b>Veg</b> ${T('Vegetariano')}</span><span><b>SG*</b> ${T('Posibilidad de convertir a plato sin gluten')}</span></div>
<p class="notice-footnote">${T('Fotografías de platos orientativas. Precios con IVA incluido.')}</p></div>`;
});
document.querySelectorAll('[data-service-minimum]').forEach(host=>{host.textContent=T('Restaurante con espectáculo · Consumo mínimo {importe} por persona',{importe:euros(service.minimum)})});

};
window.PatioInitService();
