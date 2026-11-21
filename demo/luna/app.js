import {business,products,categories} from './menu.js';
import {normalizeCart,changeQuantity,summarize,orderMessage} from './cart.js';
const $=s=>document.querySelector(s);
const money=cents=>new Intl.NumberFormat(business.locale,{style:'currency',currency:business.currency,maximumFractionDigits:0}).format(cents/100);
const storageKey='luna-cart-v1';
let cart={};try{cart=normalizeCart(JSON.parse(localStorage.getItem(storageKey)));}catch{}
let category='todos', query='', toastTimer;
const asset=p=>`assets/${p.kind}.svg`;
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanText=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function quantityControl(p){const n=cart[p.id]||0;return n?`<div class="quantity-actions" aria-label="Cantidad de ${p.name}"><button data-change="-1" data-id="${p.id}" aria-label="Quitar un ${p.name}">−</button><span aria-label="${n} unidades">${n}</span><button data-change="1" data-id="${p.id}" aria-label="Agregar un ${p.name}" ${n>=99?'disabled':''}>+</button></div>`:`<button class="add-product" data-change="1" data-id="${p.id}" aria-label="Agregar ${p.name}">+</button>`;}
function renderProducts(){
 const items=products.filter(p=>(category==='todos'||p.category===category)&&cleanText(`${p.name} ${p.description}`).includes(cleanText(query)));
 $('#product-grid').innerHTML=items.map(p=>`<article class="product-card" data-product="${p.id}"><button class="product-image-button" data-detail="${p.id}" aria-label="Ver detalle de ${p.name}"><img src="${asset(p)}" alt="Ilustración de ${p.name}" width="100" height="100" loading="lazy"></button><div class="product-info">${p.tag?`<span class="product-tag">${p.tag}</span>`:''}<h4>${p.name}</h4><p>${p.description}</p><span class="price">${money(p.price)}</span></div>${quantityControl(p)}</article>`).join('');
 $('#no-results').hidden=items.length!==0;
 $('#result-count').textContent=`${items.length} ${items.length===1?'antojo':'antojos'}`;
 $('#category-title').textContent=category==='todos'?'Un poco de todo':categories.find(c=>c.id===category).name;
}
function renderCart(){
 const {items,count,total}=summarize(cart);
 $('#header-count').textContent=count;
 $('#cup-count').textContent=count>99?'99+':count;
 $('#bar-title').textContent=count?`${count} ${count===1?'antojo elegido':'antojos elegidos'}`:'Tu próxima pausa';
 $('#bar-detail').textContent=count?`${money(total)} · Total de muestra`:'Elegí algo rico para empezar';
 $('#coffee-liquid').setAttribute('y',String(57-Math.min(count,5)/5*35));
 $('#cart-bar').classList.toggle('has-items',count>0);
 $('#cart-bar').setAttribute('aria-label',`Ver mi pedido, ${count} productos${count?`, total ${money(total)}`:''}`);
 $('#cart-total').textContent=money(total);
 $('#checkout-area').hidden=!count;
 $('#cart-items').innerHTML=count?items.map(p=>`<article class="cart-row"><img src="${asset(p)}" alt="" width="58" height="58"><div class="cart-row-info"><h3>${p.name}</h3><p>${money(p.price)} por unidad</p><strong>${money(p.price*p.quantity)}</strong></div>${quantityControl(p)}</article>`).join(''):`<div class="cart-empty"><div class="empty-moon" aria-hidden="true">☾</div><h3>Tu taza está esperando.</h3><p>Elegí un café, algo rico<br>y regalate un momento Luna.</p><button class="button primary" data-close="cart-dialog">Explorar la carta <span>↗</span></button></div>`;
}
function notify(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2400);}
function update(id,delta){
 const source=document.activeElement;const inCart=source?.closest('#cart-dialog');const old=cart[id]||0;
 cart=changeQuantity(cart,id,delta);try{localStorage.setItem(storageKey,JSON.stringify(cart));}catch{}
 $('#order-preview').hidden=true;renderProducts();renderCart();
 if(source?.matches('[data-change]')){const scope=inCart?$('#cart-items'):$('#product-grid');const matching=[...scope.querySelectorAll('[data-id]')].find(el=>el.dataset.id===id&&el.dataset.change===String(delta));if(matching)matching.focus({preventScroll:true});else if(inCart)$('#cart-dialog .close-dialog').focus({preventScroll:true});}
 if(delta>0&&(cart[id]||0)>old){$('#cart-bar').classList.remove('bump');requestAnimationFrame(()=>$('#cart-bar').classList.add('bump'));notify(`${products.find(p=>p.id===id).name} se sumó a tu pausa`);}
}
function openDialog(id){const dialog=$(`#${id}`);if(!dialog.open)dialog.showModal();}
function showProduct(id){
 const p=products.find(p=>p.id===id);if(!p)return;
 $('#product-detail').innerHTML=`<img class="detail-image" src="${asset(p)}" alt="Ilustración de ${p.name}" width="200" height="200"><div class="eyebrow">UN PEQUEÑO ANTOJO</div><h2>${p.name}</h2><p class="detail-description">${p.description}</p><div class="detail-footer"><strong class="detail-price">${money(p.price)}</strong><button class="button primary" data-detail-add="${p.id}">Sumar a mi pausa <span>+</span></button></div><p class="detail-note">Producto, precio e imagen ilustrativos. Consultá ingredientes y disponibilidad con la cafetería.</p>`;
 openDialog('product-dialog');
}
$('#categories').innerHTML=categories.map(c=>`<button class="category" data-category="${c.id}" aria-pressed="${c.id===category}">${c.name}</button>`).join('');
$('#categories').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;category=button.dataset.category;$('#categories').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderProducts();});
$('#search').addEventListener('input',event=>{query=event.target.value;renderProducts();});
document.addEventListener('click',event=>{
 const change=event.target.closest('[data-change]');if(change){update(change.dataset.id,Number(change.dataset.change));return;}
 const detail=event.target.closest('[data-detail]');if(detail){showProduct(detail.dataset.detail);return;}
 const close=event.target.closest('[data-close]');if(close){$(`#${close.dataset.close}`).close();return;}
 const add=event.target.closest('[data-detail-add]');if(add){update(add.dataset.detailAdd,1);$('#product-dialog').close();}
});
$('#header-cart').addEventListener('click',()=>openDialog('cart-dialog'));
$('#cart-bar').addEventListener('click',()=>openDialog('cart-dialog'));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));
$('#order-form').addEventListener('change',event=>{if(event.target.name==='delivery'){const delivery=event.target.value==='delivery';$('#address-label').hidden=!delivery;$('#address-label input').required=delivery;}$('#order-preview').hidden=true;});
$('#order-form').addEventListener('input',()=>{$('#order-preview').hidden=true;});
$('#order-form').addEventListener('submit',event=>{
 event.preventDefault();if(!summarize(cart).count)return;
 const data=Object.fromEntries(new FormData(event.target));if(!data.name.trim()){event.target.elements.name.setCustomValidity('Escribí tu nombre para preparar el pedido.');event.target.elements.name.reportValidity();return;}
 if(data.delivery==='delivery'&&!data.address.trim()){event.target.elements.address.setCustomValidity('Escribí la dirección de entrega.');event.target.elements.address.reportValidity();return;}
 const message=orderMessage(cart,data,money);
 if(business.whatsapp&&!business.demo){window.open(`https://wa.me/${business.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');}
 else{$('#order-text').value=`PEDIDO DE MUESTRA — PRECIOS A CONFIRMAR\n\n${message}`;$('#order-preview').hidden=false;$('#copy-status').textContent='';$('#order-text').focus();}
});
$('#order-form').addEventListener('input',event=>{event.target.setCustomValidity?.('');});
$('#copy-order').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#order-text').value);$('#copy-status').textContent='Pedido copiado. No se envió a la cafetería.';}catch{$('#order-text').focus();$('#order-text').select();$('#copy-status').textContent='Seleccionamos el pedido. Podés copiarlo desde el menú de tu dispositivo.';}});
$('#clear-cart').addEventListener('click',()=>{cart={};try{localStorage.removeItem(storageKey);}catch{}$('#order-preview').hidden=true;renderProducts();renderCart();$('#cart-dialog .close-dialog').focus();notify('Tu pedido quedó vacío');});
if(!business.demo){$('.demo-note').hidden=true;$('.cart-demo').hidden=true;$('#checkout-info').textContent='Revisá tu pedido. Se abrirá WhatsApp para enviarlo y confirmar disponibilidad.';$('#checkout-button').innerHTML='Continuar por WhatsApp <span>↗</span>';}
$('#ribbon-toggle').addEventListener('click',event=>{
 const button=event.currentTarget;
 const paused=button.getAttribute('aria-pressed')!=='true';
 button.setAttribute('aria-pressed',String(paused));
 button.setAttribute('aria-label',paused?'Reanudar la franja animada':'Pausar la franja animada');
 button.querySelector('span').textContent=paused?'▷':'Ⅱ';
 $('.ribbon').classList.toggle('loop-paused',paused);
});
renderProducts();renderCart();
