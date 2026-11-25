window.PatioInitService = () => {
const service=window.PATIO_SERVICE_ES;
const euros=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
document.querySelectorAll('[data-service-notice]').forEach(host=>{
host.innerHTML=`<div class="notice-heading"><p class="eyebrow">PARA DISFRUTAR DEL PATIO</p><h2>En nuestra mesa</h2></div>
<div class="notice-minimum"><p>Consumo mínimo en mesa de restaurante con espectáculo</p><strong>${euros(service.minimum)} <span>por persona</span></strong></div>
<div class="notice-body"><p>Si algún plato no es de su agrado, comuníquelo al encargado y se le cambiará por otro plato de igual o menor valor. <strong>Postres no incluidos.</strong></p>
<p>Puede llevarse la comida que le sobre en un envase con un coste de <strong>${euros(service.container)}</strong>. Si desea una bolsa de transporte, se añadirán <strong>${euros(service.bag)}</strong> más.</p>
<p class="notice-bread">Servicio de pan: <strong>${euros(service.bread)} por persona</strong></p>
<details><summary>Declaración de alérgenos</summary><p>En cumplimiento del Reglamento (UE) n.º 1169/2011 sobre la información alimentaria facilitada al consumidor, este establecimiento tiene disponible para su consulta la información relativa a la presencia de alérgenos de nuestros productos. Diríjase a nuestro personal si desea más información al respecto.</p></details>
<div class="notice-legend"><span><b>Veg*</b> Posibilidad de convertir a plato vegetariano</span><span><b>Veg</b> Vegetariano</span><span><b>SG*</b> Posibilidad de convertir a plato sin gluten</span></div>
<p class="notice-footnote">Fotografías de platos orientativas. Precios con IVA incluido.</p></div>`;
});
document.querySelectorAll('[data-service-minimum]').forEach(host=>{host.textContent='Restaurante con espectáculo · Consumo mínimo '+euros(service.minimum)+' por persona'});

};
window.PatioInitService();
